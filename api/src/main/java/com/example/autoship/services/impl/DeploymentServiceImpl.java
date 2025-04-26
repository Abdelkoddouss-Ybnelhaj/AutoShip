package com.example.autoship.services.impl;

import com.example.autoship.dtos.BuildResult;
import com.example.autoship.dtos.response.DepDetailsDTO;
import com.example.autoship.dtos.response.DeploymentConfigDTO;
import com.example.autoship.dtos.response.DeploymentDTO;
import com.example.autoship.exceptions.BuildFailedException;
import com.example.autoship.exceptions.DeploymentNotFoundException;
import com.example.autoship.exceptions.ListenerNotFoundException;
import com.example.autoship.mapper.DeploymentMapper;
import com.example.autoship.models.*;
import com.example.autoship.repositories.*;
import com.example.autoship.services.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private final JwtService jwtService;

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

            destination = payloadInfos.get("destination");
            Object repoID = payloadInfos.get("repoID");
            Object branch = payloadInfos.get("branch");
            Object commit = payloadInfos.get("commit");

            if (destination == null || repoID == null || branch == null) {
                log.error("[Deployment] Missing critical deployment info: destination={}, repoID={}, branch={}.", destination, repoID, branch);
                return;
            }

            // verify if the change was made within the appropriate branch
            WebhookListener listener = webhookListenerRepository.findOneByProject_RepoIDAndBranch(Long.valueOf(repoID.toString()), branch.toString());
            if (listener == null) {
                throw new ListenerNotFoundException("Listener not found for repoID=" + repoID + " and branch=" + branch);
            }

            // start cloning the repo
            gitService.cloneRepo(payloadInfos);
            DeploymentInfos deploymentInfos = deploymentInfosRepository.findOneByWebhookListener_ListenerID(listener.getListenerID());

            deployment = new Deployment(listener, deploymentInfos.getCmd(), eventType,commit.toString());
            log.info("[Deployment] Deployment object created for repoID={} with event={}", repoID, eventType);

            BuildResult buildResult = dockerService.build_pushDockerImages(
                    deploymentRepository.save(deployment), destination.toString(), Long.valueOf(repoID.toString()), branch.toString(), deploymentInfos.getDocker_repo()
            );

            if (buildResult.getExistCode() != 0) {
                throw new BuildFailedException("Build process failed with exit code " + buildResult.getExistCode());
            }

            Environment environment = deploymentInfosRepository.findOneByWebhookListener_ListenerID(listener.getListenerID()).getEnvironment();
            keyPath = storeSshKey(environment.getSshKey(), repoID.toString());

            // Extract the image tag ex: abdo001/meta-cal:MetaCal-1
            String tag = buildResult.getArtifacts().getFirst().split(":")[1]; // MetaCal-1
            String containerName = tag.split("-")[0]; // MetaCal
            String image = deploymentInfos.getDocker_repo() + ":" + containerName; // abdo001/meta-cal:MetaCal
            deployApplication(environment, keyPath, deploymentInfos.getCmd(), containerName, image, logs);

            deployment.setStatus(StatusType.SUCCESSED);
            deployment.setLogs(logs.toString());
            deploymentRepository.save(deployment);
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

    @Override
    public List<DeploymentDTO> getAllDeployments(String token) {
        String userId = jwtService.extractKey(token, "sub");
        log.info("User {} - Fetching all deployments for user", userId);

        return deploymentRepository.getAllDeploymentsForUser(Long.valueOf(userId));
    }

    @Override
    public DepDetailsDTO getDepDetails(String token, Long depID) throws DeploymentNotFoundException {
        String userId = jwtService.extractKey(token, "sub");
        log.info("User {} - Fetching deployment details for user", userId);

        var result = deploymentRepository.getDeploymentDetailsForUser(Long.valueOf(userId), depID);
        if (result == null || result.isEmpty()) {
            throw new DeploymentNotFoundException("Deployment not found with ID=" + depID);
        }
        return DeploymentMapper.mapToDepDetailsDTO(result);
    }

    @Override
    public List<DeploymentConfigDTO> getDeploymentConfigs(String token) {
        String userId = jwtService.extractKey(token, "sub");
        log.info("User {} - Fetching all deployments configs for user", userId);

        var result = deploymentRepository.getAllDeploymentConfigsForUser(Long.valueOf(userId));
        return DeploymentMapper.mapToDeploymentConfigDTOs(result);
    }

    @Override
    public DeploymentConfigDTO getDeploymentConfig(String token, Long listenerID) {
        String userId = jwtService.extractKey(token, "sub");
        log.info("User {} - Fetching deployment config with listenerID={}", userId,listenerID);

        var result = deploymentRepository.getAllDeploymentConfigForUser(Long.valueOf(userId),listenerID);
        return DeploymentMapper.mapToDeploymentConfigDTO(result);
    }

    private Map<String, Object> extractPayloadInfo(Map<String, Object> payload) {
        Map<String, Object> infos = new HashMap<>();
        String branch = ((String) payload.get("ref")).split("/")[2];
        String commit = (String) payload.get("after");
        Map repository = (Map) payload.get("repository");

        Object repoID = repository.get("id");
        String full_name = (String) repository.get("full_name");
        String clone_url = (String) repository.get("clone_url");


        infos.put("branch", branch);
        infos.put("commit", commit);
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

    private void deployApplication(Environment env, String keyPath, String cmd, String containerName, String image, StringBuilder logs) throws IOException, InterruptedException {
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

}
