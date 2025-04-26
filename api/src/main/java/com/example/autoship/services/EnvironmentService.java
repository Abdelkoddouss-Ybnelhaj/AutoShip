package com.example.autoship.services;

import com.example.autoship.dtos.response.EnvironmentDTO;
import com.example.autoship.models.Environment;

import java.util.List;

public interface EnvironmentService {

    Environment addEnvironment(Long userID, String serverIP, String serverName, String username, String sshKey);
    List<EnvironmentDTO> getAllEnvironments(String token);
    EnvironmentDTO getEnvironment(String token,Long envID);
}
