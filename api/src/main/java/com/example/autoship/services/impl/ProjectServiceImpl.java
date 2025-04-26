package com.example.autoship.services.impl;

import com.example.autoship.dtos.request.DeploymentConfigDTO;
import com.example.autoship.exceptions.GithubRequestException;
import com.example.autoship.models.*;
import com.example.autoship.repositories.*;
import com.example.autoship.services.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final GitService gitService;
    private final JwtService jwtService;
    private final ProjectRepository projectRepository;
    private final WebhookListenerRepository webhookListenerRepository;
    private final ListenerService listenerService;
    private final EnvironmentService environmentService;
    private final DockerService dockerService;
    private final DeploymentInfosService deploymentInfosService;
    private final EventService eventService;

    @Override
    public void configDeployment(DeploymentConfigDTO request, String token) throws Exception {

        String accessToken = jwtService.extractKey(token, "access-token");
        String login = jwtService.extractKey(token, "login");
        String userId = jwtService.extractKey(token, "sub");

        log.info("User: {} - Starting deployment configuration for repository: {}", login, request.getRepo_name());

        // Step 1: Create webhook
        log.debug("User: {} - Creating webhook for repo: {}", login, request.getRepo_name());
        String webhookId = gitService.createWebhook(login, request.getRepo_name(), request.getEvents() ,"webhook-secret", accessToken);
        log.info("User: {} - Webhook created successfully for repo: {} with ID: {}", login, request.getRepo_name(), webhookId);


        Object githubRepoID = gitService.getRepoInfos(login, request.getRepo_name()).get("id");
        log.info("User: {} - RepoID successfully retrieved for repo: {}", login, request.getRepo_name());

        try {
            // verify first is the listener already exist
            var result = webhookListenerRepository.findById(Long.valueOf(webhookId));
            if(result.isPresent()){
                return;
            }

            // Step 1: Save docker credentials
            DockerCredentials dockerCredentials = dockerService.addDockerCred(Long.valueOf(userId), request.getDocker_username(), request.getDocker_password());

            // Step 2: Save project info
            Project savedProject = addProject(
                    Long.valueOf(githubRepoID.toString()),
                    Long.valueOf(userId),
                    dockerCredentials,
                    request.getRepo_name()
            );

            // Step 3: Save server info
            Environment savedEnv = environmentService.addEnvironment(
                    Long.valueOf(userId),
                    request.getServerIP(),
                    request.getServerName(),
                    request.getUsername(),
                    request.getSshKey()
            );

            // Step 4: Save webhook listener info
            WebhookListener savedListener = listenerService.addListener(Long.valueOf(webhookId),savedProject, request.getBranch(), "webhook-secret");

            // Save Deployment Infos
            deploymentInfosService.addDeploymentInfos(savedListener, request.getCmd(), request.getDocker_username() + "/" + request.getDocker_repo_name(), savedEnv);

            // Step 5: Save events
            eventService.addEvents(savedListener,request.getEvents());

        } catch (Exception e) {
            log.error("User: {} - Error occurred during deployment configuration: {}", login, e.getMessage());
            throw new Exception("Deployment configuration failed", e);
        }

        log.info("User: {} - Deployment configuration completed successfully.", login);
    }

    @Override
    public void deleteDeploymentConfig(String token,String repoName,Long hookID) throws GithubRequestException {
        // Delete GitHub webhook
        String accessToken = jwtService.extractKey(token, "access-token");
        String owner = jwtService.extractKey(token, "login");

        gitService.deleteWebhook(owner,repoName,hookID,accessToken);
        // then delete webhook listener with related table's record
        webhookListenerRepository.deleteById(hookID);
        log.info("Webhook listener ID={} , Deleted successfully from DB. ",hookID);
    }

    @Override
    public Project addProject(Long githubID, Long userID, DockerCredentials dockerCredentials, String repoName) {
        log.info("User: {} , Attempting to save/get repo with ID={}",userID,githubID);

        Optional<Project> result = projectRepository.findById(githubID);
        if(result.isEmpty()){
            log.debug("Saving project information for repo: {} and user: {}", repoName, userID);
            //var result = projectRepository.findById(Long.valueOf(githubRepoID.t));
            Project project = new Project(githubID, userID, dockerCredentials, repoName);
            Project savedProject = projectRepository.save(project);
            log.info("Project saved with repo ID: {}", savedProject.getRepoID());
            return  savedProject;
        }
        return result.get();
    }

}
