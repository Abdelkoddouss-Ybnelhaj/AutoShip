package com.example.autoship.services.impl;

import com.example.autoship.dtos.response.EnvironmentDTO;
import com.example.autoship.models.Environment;
import com.example.autoship.repositories.EnvironmentRepository;
import com.example.autoship.services.EnvironmentService;
import com.example.autoship.services.JwtService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class EnvironmentServiceImpl implements EnvironmentService {

    private EnvironmentRepository environmentRepository;
    private final JwtService jwtService;

    @Override
    public Environment addEnvironment(Long userID, String serverIP, String serverName, String username, String sshKey) {
        log.debug("User: {} - Saving server information with serverName={} and username={}", userID,serverName,username);
        Environment result = environmentRepository.findEnvByUserAndName(userID,serverName);
        if(result == null){
            Environment environment = new Environment(
                    userID,
                    serverIP,
                    serverName,
                    username,
                    sshKey
            );

            result = environmentRepository.save(environment);
            log.info("User: {} - Server information saved Successfully with serverName={} and username={}", userID, serverName,username);
        }

        return result;
    }

    @Override
    public List<EnvironmentDTO> getAllEnvironments(String token) {
        String userId = jwtService.extractKey(token, "sub");
        log.info("User {} - Fetching all environments details for user",userId);

        return environmentRepository.findEnvByUser(Long.valueOf(userId));
    }

    @Override
    public EnvironmentDTO getEnvironment(String token, Long envID) {
        String userId = jwtService.extractKey(token, "sub");
        log.info("User {} - Fetching environment details for user",userId);

        return environmentRepository.findEnvByUserANDId(Long.valueOf(userId),envID);
    }
}
