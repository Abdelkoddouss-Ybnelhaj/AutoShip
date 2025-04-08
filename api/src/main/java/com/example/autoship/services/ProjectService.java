package com.example.autoship.services;

import com.example.autoship.dtos.DeploymentConfigDTO;

public interface ProjectService {
    void configDeployment(DeploymentConfigDTO request,String token) throws Exception;
}
