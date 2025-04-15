package com.example.autoship.services.impl;

import com.example.autoship.dtos.DeploymentConfigDTO;
import com.example.autoship.models.*;
import com.example.autoship.repositories.*;
import com.example.autoship.services.GitService;
import com.example.autoship.services.JwtService;
import com.example.autoship.services.ProjectService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final GitService gitService;
    private final JwtService jwtService;
    private final EnvironmentRepository envRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;
    private final WebhookListenerRepository webhookListenerRepository;
    private final EventRepository eventRepository;
    private final DockerCredRepository credRepository;
    private final DeploymentInfosRepository deploymentInfosRepository;

    @Override
    public void configDeployment(DeploymentConfigDTO request, String token) throws Exception {

        String accessToken = jwtService.extractKey(token, "access-token");
        String login = jwtService.extractKey(token, "login");
        String userId = jwtService.extractKey(token, "sub");

        log.info("User: {} - Starting deployment configuration for repository: {}", login, request.getRepo_name());

        // Step 1: Create webhook
        log.debug("User: {} - Creating webhook for repo: {}", login, request.getRepo_name());
        String webhookId = gitService.createWebhook(login, request.getRepo_name(), "webhook-secret", accessToken);
        log.info("User: {} - Webhook created successfully for repo: {} with ID: {}", login, request.getRepo_name(), webhookId);

        Object githubRepoID = gitService.getRepoInfos(login, request.getRepo_name()).get("id");
        log.info("User: {} - RepoID successfully retrieved for repo: {}", login, request.getRepo_name());

        try {
            // Step 1: Save docker credentials
            log.debug("User: {} - Saving Docker credentials", login);
            DockerCredentials dockerCredentials = new DockerCredentials(
                    Long.valueOf(userId),
                    request.getDocker_username(),
                    request.getDocker_password()
            );
            credRepository.save(dockerCredentials);
            log.info("User: {} - Docker credentials saved successfully", login);

            // Step 2: Save project info
            log.debug("Saving project information for repo: {} and user: {}", request.getRepo_name(), login);
            Project project = new Project(Long.valueOf(githubRepoID.toString()), Long.valueOf(githubRepoID.toString()), dockerCredentials, request.getRepo_name());
            Project savedProject = projectRepository.save(project);
            log.info("Project saved with repo ID: {}", savedProject.getRepoID());

            // Step 3: Save server info
            log.debug("User: {} - Saving server information for project ID: {}", login, savedProject.getRepoID());
            Environment environment = new Environment(
                    Long.valueOf(userId),
                    savedProject,
                    request.getServerIP(),
                    request.getUsername(),
                    request.getSshKey()
            );

            envRepository.save(environment);
            log.info("User: {} - Server information saved for project: {}", login, savedProject.getRepoID());

            // Step 4: Save webhook listener info
            log.debug("User: {} - Saving webhook listener for project: {} and branch: {}", login, savedProject.getRepoID(), request.getBranch());
            WebhookListener listener = new WebhookListener(savedProject, request.getBranch(), "webhook-secret");
            WebhookListener savedListener = webhookListenerRepository.save(listener);
            log.info("User: {} - Webhook listener saved with listener ID: {}", login, savedListener.getListenerID());

            // Save Deployment Infos
            DeploymentInfos deploymentInfos = new DeploymentInfos(savedListener, request.getCmd(), request.getDocker_repo_name());
            deploymentInfosRepository.save(deploymentInfos);
            log.info("User: {} - Deployment Infos saved with cmd={} and docker_repo_name={}", login, request.getCmd(), request.getDocker_repo_name());

            // Step 5: Save events
            log.debug("User: {} - Saving events for listener ID: {}", login, savedListener.getListenerID());
            for (String event : request.getEvents()) {
                Event eventEntity = new Event(savedListener.getListenerID(), event);
                eventRepository.save(eventEntity);
                log.info("User: {} - Event saved for listener ID:{}", login, savedListener.getListenerID());
            }

        } catch (Exception e) {
            log.error("User: {} - Error occurred during deployment configuration: {}", login, e.getMessage());
            throw new Exception("Deployment configuration failed", e);
        }

        log.info("User: {} - Deployment configuration completed successfully.", login);
    }
}
