package com.example.autoship.repositories;


import com.example.autoship.models.DockerCredentials;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class DockerCredRepositoryTest {

    @Autowired
    private DockerCredRepository credRepository;

    @BeforeEach
    void setup(){
        DockerCredentials credentials = new DockerCredentials(2L,"username","password");
        credRepository.save(credentials);
    }

    @Test
    void test_FindCredByUsername(){
        var result = credRepository.existByUsername("username");
        assertThat(result).isTrue();
    }
}
