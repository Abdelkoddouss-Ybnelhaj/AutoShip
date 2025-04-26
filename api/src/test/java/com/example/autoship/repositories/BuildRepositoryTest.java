package com.example.autoship.repositories;

import com.example.autoship.models.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class BuildRepositoryTest {

    @Autowired
    private WebhookListenerRepository webhookListenerRepository;

    @Autowired
    private DeploymentRepository deploymentRepository;

    @Autowired
    private BuildRepository buildRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void Test_GetBuildNumber(){
        // initiate a docker cred record
        DockerCredentials credentials = new DockerCredentials(2L,"abdo","passwd");
        Project project = new Project(145L,2L, credentials, "Repo");

        WebhookListener listener = new WebhookListener(1L,project,"main","web-secret");
        Deployment deployment = new Deployment(listener,"cmd",StatusType.SUCCESSED,"push","commit");
        Deployment deployment2 = new Deployment(listener,"cmd",StatusType.SUCCESSED,"push","commit");
        Build build = new Build(deployment,StatusType.SUCCESSED,"logs");
        Build build2 = new Build(deployment,StatusType.SUCCESSED,"logs");
        Build build3 = new Build(deployment2,StatusType.SUCCESSED,"logs");
        buildRepository.save(build);
        buildRepository.save(build2);
        buildRepository.save(build3);

        Pageable limitOne = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "buildID"));
        List<Build> builds = buildRepository.findByDeployment_WebhookListener_Project_RepoIDAndDeployment_WebhookListener_Branch(project.getRepoID(), "main",limitOne);


        assertThat(builds.getFirst().getBuildID()).isEqualTo(build3.getBuildID());
    }
}
