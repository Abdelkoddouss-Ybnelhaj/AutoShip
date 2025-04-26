package com.example.autoship.repositories;

import com.example.autoship.models.DockerCredentials;
import com.example.autoship.models.Project;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class ProjectRepositoryTest {

    @Autowired
    private DockerCredRepository dockerCredRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @BeforeEach
    void setup(){
        // initiate a docker cred record
        DockerCredentials credentials = new DockerCredentials(2L,"abdo","passwd");
        Project project = new Project(145L,2L, credentials, "Repo");

        dockerCredRepository.save(credentials);
        projectRepository.save(project);
    }


    @Test
    void Test_GetCredentials(){
        var result = projectRepository.findById(145L);

        assertThat(result).isNotNull();
        assertThat(result.get().getDockerCredentials().getUsername()).isEqualTo("abdo");
    }


}
