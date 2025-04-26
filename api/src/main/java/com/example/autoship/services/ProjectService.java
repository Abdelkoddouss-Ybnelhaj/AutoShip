package com.example.autoship.services;

import com.example.autoship.dtos.request.DeploymentConfigDTO;
import com.example.autoship.exceptions.GithubRequestException;
import com.example.autoship.models.DockerCredentials;
import com.example.autoship.models.Project;

public interface ProjectService {
    void configDeployment(DeploymentConfigDTO request,String token) throws Exception;
    void deleteDeploymentConfig(String token,String repoName,Long hookID) throws GithubRequestException;

    Project addProject(Long githubID, Long userID, DockerCredentials dockerCredentials,String repoName);
}
