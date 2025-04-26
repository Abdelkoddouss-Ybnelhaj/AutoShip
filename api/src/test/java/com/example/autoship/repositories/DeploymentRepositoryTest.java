package com.example.autoship.repositories;

import com.example.autoship.models.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class DeploymentRepositoryTest {

    @Autowired
    private DeploymentRepository deploymentRepository;

    @Autowired
    private ArtifactRepository artifactRepository;

    @Autowired
    private BuildRepository buildRepository;

    @Autowired
    private EnvironmentRepository environmentRepository;

    @Autowired
    private DeploymentInfosRepository deploymentInfosRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private WebhookListenerRepository webhookListenerRepository;

    @Autowired
    private DockerCredRepository dockerCredRepository;

    @Autowired
    private EventRepository eventRepository;

    private Deployment deployment;

    @BeforeEach
    void setup(){
        // initiate a docker cred record
        DockerCredentials credentials = new DockerCredentials(2L,"abdo","passwd");
        var savedCred = dockerCredRepository.save(credentials);

        Project project = new Project(145L,2L, savedCred, "Repo");
        var savedProject = projectRepository.save(project);

        WebhookListener listener = new WebhookListener(1L,savedProject,"main","web-secret");
        var savedListener = webhookListenerRepository.save(listener);

        Event event = new Event(listener.getListenerID(),"push");
        eventRepository.save(event);

        deployment = new Deployment(savedListener,"cmd", StatusType.SUCCESSED,"push","commit");
        deployment.setLogs("dep logs");
        Deployment deployment2 = new Deployment(savedListener,"cmd",StatusType.SUCCESSED,"push","commit");
        deployment2.setLogs("dep2 logs");
        Build build = new Build(deployment,StatusType.SUCCESSED,"logs");
        Build build2 = new Build(deployment,StatusType.SUCCESSED,"logs");
        Build build3 = new Build(deployment2,StatusType.SUCCESSED,"logs");
        buildRepository.save(build);
        buildRepository.save(build2);
        buildRepository.save(build3);

        Artifact record = new Artifact(build,"artifact");
        artifactRepository.save(record);

        Artifact record2 = new Artifact(build2,"artifact");
        artifactRepository.save(record2);

        Environment env = new Environment(2L,"serverIP","ServerName","username","sshKey");
        DeploymentInfos deploymentInfos = new DeploymentInfos(savedListener,"cmd","docker_repo",environmentRepository.save(env));
        deploymentInfosRepository.save(deploymentInfos);

    }

    @Test
    void test_GetAllDeployments(){

        var result = deploymentRepository.getAllDeploymentsForUser(2L);

        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(2);
    }

    @Test
    void test_GetDeploymentDetails(){
        // mapping
        var result = deploymentRepository.getDeploymentDetailsForUser(2L,deployment.getDepID());
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(2);
    }

    @Test
    void test_GetAllDeploymentsConfigsForUser(){
        var result = deploymentRepository.getAllDeploymentConfigsForUser(2L);
        assertThat(result).isNotNull();
    }

    @Test
    void test_GetAllDeploymentsConfigForUser(){
        var result = deploymentRepository.getAllDeploymentConfigForUser(2L,1L);
        assertThat(result).isNotNull();
    }
}
