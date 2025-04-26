package com.example.autoship.repositories;

import com.example.autoship.models.DockerCredentials;
import com.example.autoship.models.Project;
import com.example.autoship.models.WebhookListener;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class WebhookListenerRepositoryTest {

    @Autowired
    private WebhookListenerRepository webhookListenerRepository;

    @BeforeEach
    void setup(){
        DockerCredentials credentials = new DockerCredentials(2L,"abdo","passwd");
        Project project = new Project(145L,2L, credentials, "Repo");
        WebhookListener webhookListener = new WebhookListener(1L,project,"master","");
        webhookListenerRepository.save(webhookListener);
    }

    @Test
    void test_GetWebhookListenerByRepoIDAndBranch(){
        Long repoID = 145L;
        String branch = "master";

        var result = webhookListenerRepository.findOneByProject_RepoIDAndBranch(repoID,branch);

        assertThat(result).isNotNull();
        assertThat(result.getProject().getRepoID()).isEqualTo(repoID);
        assertThat(result.getBranch()).isEqualTo(branch);
    }
}
