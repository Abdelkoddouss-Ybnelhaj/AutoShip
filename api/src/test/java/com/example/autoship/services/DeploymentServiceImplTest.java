package com.example.autoship.services;


import com.example.autoship.dtos.BuildResult;
import com.example.autoship.dtos.response.DeploymentConfigDTO;
import com.example.autoship.dtos.response.DeploymentDTO;
import com.example.autoship.exceptions.BuildFailedException;
import com.example.autoship.exceptions.DeploymentNotFoundException;
import com.example.autoship.exceptions.ListenerNotFoundException;
import com.example.autoship.models.*;
import com.example.autoship.repositories.*;
import com.example.autoship.services.impl.DeploymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeploymentServiceImplTest {

    @Mock
    private GitService gitService;

    @Mock
    private DockerService dockerService;

    @Mock
    private WebhookListenerRepository webhookListenerRepository;

    @Mock
    private DeploymentInfosRepository deploymentInfosRepository;

    @Mock
    private DeploymentRepository deploymentRepository;

    @Mock
    private JwtService jwtService;

    private DeploymentService deploymentService;

    private Map<String, Object> payload;

    @BeforeEach
    void setUp() {
        deploymentService = new DeploymentServiceImpl(
                gitService,
                dockerService,
                webhookListenerRepository,
                deploymentInfosRepository,
                deploymentRepository,
                jwtService
        );
        payload = Map.of(
                "ref", "refs/heads/main",
                "repository", Map.of(
                        "id", 123L,
                        "full_name", "test/repo",
                        "clone_url", "https://github.com/test/repo.git"
                )
        );
    }

    @Test
    void shouldReturnWhenPingEventReceived() {
        deploymentService.startDeployment("ping", payload);
        verifyNoInteractions(gitService, dockerService);
    }

    @Test
    void shouldThrowListenerNotFoundException() {
        when(webhookListenerRepository.findOneByProject_RepoIDAndBranch(anyLong(), anyString())).thenReturn(null);

        Exception exception = assertThrows(ListenerNotFoundException.class, () ->
                deploymentService.startDeployment("push", payload)
        );

        assertTrue(exception.getMessage().contains("Listener not found"));
    }

    @Test
    void shouldFailBuildWhenBuildFails() throws BuildFailedException {
        WebhookListener listener = mock(WebhookListener.class);
        DeploymentInfos deploymentInfos = mock(DeploymentInfos.class);

        when(webhookListenerRepository.findOneByProject_RepoIDAndBranch(anyLong(), anyString())).thenReturn(listener);
        when(deploymentInfosRepository.findOneByWebhookListener_ListenerID(anyLong())).thenReturn(deploymentInfos);

        BuildResult buildResult = new BuildResult();
        buildResult.setExistCode(1);
        when(dockerService.build_pushDockerImages(any(), anyString(), anyLong(), anyString(), anyString())).thenReturn(buildResult);

        assertThrows(BuildFailedException.class, () ->
                deploymentService.startDeployment("push", payload)
        );
    }

    @Test
    void shouldReturnAllDeployments() {
        when(jwtService.extractKey(anyString(), eq("sub"))).thenReturn("1");
        when(deploymentRepository.getAllDeploymentsForUser(1L)).thenReturn(List.of(mock(DeploymentDTO.class)));

        List<DeploymentDTO> deployments = deploymentService.getAllDeployments("mock-token");

        assertThat(deployments).isNotNull();
        assertThat(deployments).hasSize(1);
    }

    @Test
    void shouldThrowDeploymentNotFoundException() {
        when(jwtService.extractKey(anyString(), eq("sub"))).thenReturn("1");
        when(deploymentRepository.getDeploymentDetailsForUser(1L, 99L)).thenReturn(null);

        assertThrows(DeploymentNotFoundException.class, () ->
                deploymentService.getDepDetails("mock-token", 99L)
        );
    }

    @Test
    void shouldNotReturnDeploymentConfigs() {
        when(jwtService.extractKey(anyString(), eq("sub"))).thenReturn("1");
        when(deploymentRepository.getAllDeploymentConfigsForUser(1L)).thenReturn(List.of());

        List<DeploymentConfigDTO> configs = deploymentService.getDeploymentConfigs("mock-token");

        assertThat(configs).isNull();
    }
}
