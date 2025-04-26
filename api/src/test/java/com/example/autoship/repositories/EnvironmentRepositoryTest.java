package com.example.autoship.repositories;

import com.example.autoship.models.Environment;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class EnvironmentRepositoryTest {

    @Autowired
    private EnvironmentRepository environmentRepository;

    @BeforeEach
    void setup(){
        Environment environment = new Environment(2L,"IP add","server1","user","key");
        Environment environment2 = new Environment(3L,"IP add2","server2","user2","key");
        environmentRepository.save(environment);
        environmentRepository.save(environment2);
    }

    @Test
    void test_findEnvByUser(){
        var result = environmentRepository.findEnvByUser(2L);
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(1);
    }

    @Test
    void test_findEnvByUserAndId(){
        Environment environment = new Environment(2L,"IP add3","server2","user","key");
        var savedEnv = environmentRepository.save(environment);

        var result = environmentRepository.findEnvByUserANDId(2L,savedEnv.getEnvID());
        assertThat(result).isNotNull();
        assertThat(result.getServerIP()).isEqualTo("IP add3");
        assertThat(result.getServerName()).isEqualTo("server2");
    }
}
