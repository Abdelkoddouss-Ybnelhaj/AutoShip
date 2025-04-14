package com.example.autoship.repositories;

import com.example.autoship.models.Environment;
import com.example.autoship.models.Project;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class EnvironmentRepositoryTest {

    @Autowired
    private EnvironmentRepository environmentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @BeforeEach
    void setup(){
        Project project = new Project(145L,2L, null, "Repo");
        var savedProject = projectRepository.save(project);
        Environment environment = new Environment(14L,savedProject,"serverIP","username","sshKey");
        environmentRepository.save(environment);
    }

    @Test
    void test_GetEnvironmentByProject_RepoID(){
        var result = environmentRepository.findOneByProject_RepoID(145L);
        assertThat(result).isNotNull();
    }
}
