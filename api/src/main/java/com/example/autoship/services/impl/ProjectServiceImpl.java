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

    @Override
    public void configDeployment(DeploymentConfigDTO request, String token) throws Exception {
        log.info("Starting deployment configuration for repository: {}", request.getRepo_name());

        String accessToken = jwtService.extractKey(token, "access-token");
        String login = jwtService.extractKey(token, "login");
        String userId = jwtService.extractKey(token, "sub");

        // Step 1: Create webhook
        log.debug("Creating webhook for repo: {} by user: {}", request.getRepo_name(), login);
        String webhookId = gitService.createWebhook(login, request.getRepo_name(), "webhook-secret", accessToken);
        log.info("Webhook created successfully for repo: {} with ID: {}", request.getRepo_name(), webhookId);

        try {

            // Step 2: Save project info
            log.debug("Saving project information for repo: {} and user: {}", request.getRepo_name(), login);
            Project project = new Project(Long.valueOf(userId), request.getRepo_name());
            Project savedProject = projectRepository.save(project);
            log.info("Project saved with repo ID: {}", savedProject.getRepoID());

            // Step 3: Save server info
            log.debug("Saving server information for user: {} and project ID: {}", login, savedProject.getRepoID());
            Environment environment = new Environment(
                    Long.valueOf(userId),
                    savedProject.getRepoID(),
                    request.getServerIP(),
                    passwordEncoder.encode(request.getUsername()),
                    passwordEncoder.encode(request.getSshKey())
            );
            envRepository.save(environment);
            log.info("Server information saved for project: {} and user: {}", savedProject.getRepoID(), login);

            // Step 4: Save webhook listener info
            log.debug("Saving webhook listener for project: {} and branch: {} for user {}", savedProject.getRepoID(), request.getBranch(),login);
            WebhookListener listener = new WebhookListener(savedProject.getRepoID(), request.getBranch(), "webhook-secret");
            WebhookListener savedListener = webhookListenerRepository.save(listener);
            log.info("Webhook listener saved with listener ID: {}", savedListener.getListenerID());

            // Step 5: Save events
            log.debug("Saving events for listener ID: {}", savedListener.getListenerID());
            for (String event : request.getEvents()) {
                Event eventEntity = new Event(savedListener.getListenerID(), event);
                eventRepository.save(eventEntity);
                log.info("Event saved: {}", event);
            }

            // Step 6: Save docker credentials
            log.debug("Saving Docker credentials for user: {}", login);
            DockerCredentials dockerCredentials = new DockerCredentials(
                    passwordEncoder.encode(request.getDocker_username()),
                    passwordEncoder.encode(request.getDocker_password())
            );
            credRepository.save(dockerCredentials);
            log.info("Docker credentials saved for user: {}", login);

        } catch (Exception e) {
            log.error("Error occurred during deployment configuration: {}", e.getMessage(), e);
            throw new Exception("Deployment configuration failed", e);
        }

        log.info("Deployment configuration completed successfully.");
    }
}
