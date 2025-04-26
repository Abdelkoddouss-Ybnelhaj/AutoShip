package com.example.autoship.services.impl;

import com.example.autoship.dtos.BuildResult;
import com.example.autoship.dtos.ScriptResult;
import com.example.autoship.exceptions.BuildFailedException;
import com.example.autoship.models.*;
import com.example.autoship.repositories.ArtifactRepository;
import com.example.autoship.repositories.BuildRepository;
import com.example.autoship.repositories.DockerCredRepository;
import com.example.autoship.repositories.ProjectRepository;
import com.example.autoship.services.DockerService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
@AllArgsConstructor
@Slf4j
public class DockerServiceImpl implements DockerService {

    private final ProjectRepository projectRepository;
    private final DockerCredRepository dockerCredRepository;
    private final BuildRepository buildRepository;
    private final ArtifactRepository artifactRepository;
    private static final String DOCKER_BUILD_PUSH_SCRIPT = "../scripts/build_push_docker_images.sh";

    @Override
    public BuildResult build_pushDockerImages(Deployment deployment, String dir_path, Long repoID, String branch, String dockerRepo) throws BuildFailedException {
        log.info("[BUILD][RepoID:{}] ▶️ Starting build & push process for branch: '{}'", repoID, branch);

        // Get Docker credentials
        log.info("[BUILD][RepoID:{}] 🔐 Fetching Docker credentials...", repoID);
        var credentials = projectRepository.findById(repoID).get().getDockerCredentials();
        log.info("[BUILD][RepoID:{}] ✅ Credentials retrieved — Docker Username: '{}'", repoID, credentials.getUsername());


        // get the build number
        log.info("[BUILD][RepoID:{}] 🔍 Fetching last build number for branch: '{}'", repoID, branch);
        Pageable limitOne = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "buildID"));
        List<Build> builds = buildRepository.findByDeployment_WebhookListener_Project_RepoIDAndDeployment_WebhookListener_Branch(repoID,branch,limitOne);
        log.info("[BUILD][RepoID:{}] 📦 Previous Build ID: {}", repoID, builds.isEmpty() ? "None" : builds.getFirst().getBuildID());


        // build docker images
        ScriptResult scriptResult = runDockerScript(
                dir_path,
                dockerRepo,
                builds.isEmpty() ? 1 : builds.getFirst().getBuildID() + 1,
                credentials.getUsername(),
                credentials.getPassword()
        );

        Build build = new Build(
                deployment,
                scriptResult.getSuccess() == 0 ? StatusType.SUCCESSED : StatusType.FAILED,
                scriptResult.getLogs()
        );
        buildRepository.save(build);
        log.info("[BUILD][RepoID:{}] 💾 Build status saved as '{}'", repoID, build.getStatus());


        if(scriptResult.getSuccess() == 0){
            for(String artifact: scriptResult.getArtifacts()){
                Artifact record = new Artifact(build,artifact);
                artifactRepository.save(record);
                log.info("[BUILD][RepoID:{}] 🗂️ Saving {} artifacts...", repoID, scriptResult.getArtifacts().size());
            }
        }

        log.info("[BUILD][RepoID:{}] 🏁 Build process completed for branch: '{}'. Result: {}", repoID, branch, build.getStatus());
        return new BuildResult(scriptResult.getSuccess(), scriptResult.getArtifacts());
    }

    @Override
    public DockerCredentials addDockerCred(Long userId, String username, String password) {
        log.debug("User: {} - Saving Docker credentials", userId);

        DockerCredentials credentialsExist = dockerCredRepository.findByUsername(username);
        if (credentialsExist == null) {
            DockerCredentials dockerCredentials = new DockerCredentials(
                    userId,
                    username,
                    password
            );

            log.info("User: {} - Docker credentials saved successfully", userId);
            return dockerCredRepository.save(dockerCredentials);
        }

        return credentialsExist;
    }

    private ScriptResult runDockerScript(String proj_dir, String tag, Long buildNB, String username, String passwd) throws BuildFailedException {
        log.info("[BUILD][RepoID:{}] 🐳 Executing Docker build & push script. Build Number: {}", tag, buildNB);

        // I should separate the building images from pushing them
        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command(
                "bash",
                DOCKER_BUILD_PUSH_SCRIPT,
                proj_dir,
                tag,
                buildNB.toString(),
                username,
                passwd);

        try {
            List<String> artifacts = new ArrayList<>();
            StringBuilder logs = new StringBuilder();
            Process process = processBuilder.start();

            // Capture both STDOUT and STDERR in separate threads for concurrent reading
            Thread stdoutThread = new Thread(() -> {
                Pattern pattern = Pattern.compile("ARTIFACT:\\s*(\\S+)");

                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        log.info("[DockerScript-OUT] {}", line);
                        logs.append("[DockerScript-OUT] ").append(line).append("\n");

                        // Catch Artifacts
                        Matcher matcher = pattern.matcher(line);
                        if (matcher.find()) {
                            String artifact = matcher.group(1);
                            artifacts.add(artifact);
                            log.info("Artifact detected from STDOUT: {}", artifact);
                        }
                    }

                } catch (IOException e) {
                    log.error("Error reading STDOUT: {}", e.getMessage());
                }
            });

            Thread stderrThread = new Thread(() -> {
                try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                    String errorLine;
                    while ((errorLine = errorReader.readLine()) != null) {
                        log.error("[DockerScript-ERR] {}", errorLine);
                        logs.append("[DockerScript-ERR] ").append(errorLine).append("\n");
                    }
                } catch (IOException e) {
                    log.error("Error reading STDERR: {}", e.getMessage());
                }
            });

            // Start the threads to capture STDOUT and STDERR simultaneously
            stdoutThread.start();
            stderrThread.start();

            // Wait for both threads to finish before checking the process exit code
            stdoutThread.join();
            stderrThread.join();

            int exitCode = process.waitFor();

            if (exitCode == 0) {
                log.info("[BUILD][RepoID:{}] ✅ Docker script executed successfully.", tag);
            } else {
                log.error("[BUILD][RepoID:{}] ❌ Docker script failed with Exit Code: {}", tag, exitCode);
            }

            return new ScriptResult(exitCode,logs.toString(),artifacts);
        } catch (IOException | InterruptedException e) {
            throw new BuildFailedException("Error executing script: "+ e.getMessage());
        }
    }
}
