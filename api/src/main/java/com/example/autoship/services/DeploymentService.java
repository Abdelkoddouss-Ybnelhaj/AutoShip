package com.example.autoship.services;

import com.example.autoship.dtos.response.DepDetailsDTO;
import com.example.autoship.dtos.response.DeploymentConfigDTO;
import com.example.autoship.dtos.response.DeploymentDTO;
import com.example.autoship.exceptions.DeploymentNotFoundException;

import java.util.List;
import java.util.Map;

public interface DeploymentService {

    void startDeployment(String eventType, Map<String, Object> payload);
    List<DeploymentDTO> getAllDeployments(String token);
    DepDetailsDTO getDepDetails(String token,Long depID) throws DeploymentNotFoundException;
    List<DeploymentConfigDTO> getDeploymentConfigs(String token);
    DeploymentConfigDTO getDeploymentConfig(String token,Long listenerID);

}
