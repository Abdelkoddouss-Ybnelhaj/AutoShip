package com.example.autoship.services.impl;

import com.example.autoship.dtos.BuildResult;
import com.example.autoship.exceptions.BuildFailedException;
import com.example.autoship.models.*;
import com.example.autoship.repositories.*;
import com.example.autoship.services.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@AllArgsConstructor
@Slf4j
public class DeploymentServiceImpl implements DeploymentService {

    private static final String DESTINATION_DIR = "/tmp";
    private static final String DEPLOYMENT_SCRIPT = "../scripts/deploy-app.sh";

    private final GitService gitService;
    private final DockerService dockerService;
    private final WebhookListenerRepository webhookListenerRepository;
    private final DeploymentInfosRepository deploymentInfosRepository;
    private final DeploymentRepository deploymentRepository;
    private final EnvironmentRepository environmentRepository;

    @Override
    public void startDeployment(String eventType, Map<String, Object> payload) {
        if ("ping".equals(eventType)) {
            log.info("[Webhook] Received ping event. No action will be taken.");
            return;
        }

        log.info("[Deployment] Initiating new deployment...");
        StringBuilder logs = new StringBuilder();
        Deployment deployment = null;
        String keyPath = null;
        Object destination = null;

        try {
            Map<String, Object> payloadInfos = extractPayloadInfo(payload);
            gitService.cloneRepo(payloadInfos);

            destination = payloadInfos.get("destination");
            Object repoID = payloadInfos.get("repoID");
            Object branch = payloadInfos.get("branch");

            if (destination == null || repoID == null || branch == null) {
                log.error("[Deployment] Missing critical deployment info: destination={}, repoID={}, branch={}.", destination, repoID, branch);
                return;
            }

            WebhookListener listener = webhookListenerRepository.findOneByProject_RepoIDAndBranch(Long.valueOf(repoID.toString()), branch.toString());
            DeploymentInfos deploymentInfos = deploymentInfosRepository.findOneByWebhookListener_ListenerID(listener.getListenerID());

            deployment = new Deployment(listener, deploymentInfos.getCmd());
            log.info("[Deployment] Deployment object created for repoID={}", repoID);

            BuildResult buildResult = dockerService.build_pushDockerImages(
                    deployment, destination.toString(), Long.valueOf(repoID.toString()), branch.toString(), deploymentInfos.getDocker_repo()
            );

            if (buildResult.getExistCode() != 0) {
                throw new BuildFailedException("Build process failed with exit code " + buildResult.getExistCode());
            }

            Environment environment = environmentRepository.findOneByProject_RepoID(Long.valueOf(repoID.toString()));
            keyPath = storeSshKey(environment.getSshKey(), repoID.toString());

            String image = buildResult.getArtifacts().getFirst().split("-")[0];
            String containerName = image.split(":")[1];
            deployApplication(environment, keyPath, deploymentInfos.getCmd(), containerName, image, logs);

            deployment.setStatus(StatusType.SUCCESSED);
            log.info("[Deployment] Deployment completed successfully for repoID={}", repoID);

        } catch (Exception e) {
            log.error("[Deployment] Deployment failed: {}", e.getMessage());
            logs.append("[ERROR] ").append(e.getMessage()).append("\n");
            if (deployment != null) {
                deployment.setStatus(StatusType.FAILED);
                deployment.setLogs(logs.toString());
                deploymentRepository.save(deployment);
            }
        } finally {
            cleanPath(destination, "repository");
            cleanPath(keyPath, "SSH key");
        }
    }

    private Map<String, Object> extractPayloadInfo(Map<String, Object> payload) {
        Map<String, Object> infos = new HashMap<>();
        String branch = ((String) payload.get("ref")).split("/")[2];
        Map repository = (Map) payload.get("repository");

        Object repoID = repository.get("id");
        String full_name = (String) repository.get("full_name");
        String clone_url = (String) repository.get("clone_url");

        infos.put("branch", branch);
        infos.put("repoID", Long.valueOf(repoID.toString()));
        infos.put("clone_url", clone_url);
        infos.put("destination", DESTINATION_DIR + "/" + full_name);

        log.info("[Webhook] Extracted deployment info: repoID={}, branch={}, cloneUrl={}", repoID, branch, clone_url);
        return infos;
    }

    private String storeSshKey(String sshKey, String repoID) throws IOException {
        String tempFileName = repoID + System.currentTimeMillis();
        File tempKeyFile = File.createTempFile(tempFileName, ".key");

        try (FileWriter writer = new FileWriter(tempKeyFile)) {
            writer.write(sshKey);
        }

        tempKeyFile.setReadable(false, false);
        tempKeyFile.setReadable(true, true);

        log.info("[SSH] Temporary SSH key stored at: {}", tempKeyFile.getAbsolutePath());
        return tempKeyFile.getAbsolutePath();
    }

    private void deployApplication(Environment env, String keyPath, String cmd, String containerName,String image, StringBuilder logs) throws IOException, InterruptedException {
        copyDeploymentScriptToRemote(env, keyPath, logs);

        String deployCommand = String.format(
                "./deploy-app.sh \"%s\" \"%s\" \"%s\"",
                containerName, image, cmd
        );
        ProcessBuilder builder = new ProcessBuilder("ssh", "-i", keyPath, "-o", "StrictHostKeyChecking=no",
                env.getUsername() + "@" + env.getServerIP(), deployCommand);

        executeAndLogProcess(builder, logs);
    }

    private void copyDeploymentScriptToRemote(Environment env, String keyPath, StringBuilder logs) throws IOException, InterruptedException {
        String targetPath = String.format("%s@%s:/home/%s", env.getUsername(), env.getServerIP(), env.getUsername());
        ProcessBuilder builder = new ProcessBuilder("scp", "-i", keyPath, "-o", "StrictHostKeyChecking=no", DEPLOYMENT_SCRIPT, targetPath);
        executeAndLogProcess(builder, logs);
        log.info("[Deployment] Deployment script copied to remote server: {}", env.getServerIP());
    }

    private void executeAndLogProcess(ProcessBuilder builder, StringBuilder logs) throws IOException, InterruptedException {
        Process process = builder.start();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                logs.append(line).append("\n");
                log.info("[Process] {}", line);
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            String error = "Process exited with code: " + exitCode;
            logs.append("[ERROR] ").append(error).append("\n");
            throw new RuntimeException(error);
        }
    }

    private void cleanPath(Object path, String type) {
        if (path != null) {
            gitService.cleanPath(path.toString());
            log.info("[Cleanup] {} cleaned: {}", type, path);
        }
    }

    public static String extractImageName(String image) {
        Pattern pattern = Pattern.compile(":(\\w+)-");
        Matcher matcher = pattern.matcher(image);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }
}
