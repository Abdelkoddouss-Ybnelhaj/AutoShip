package com.example.autoship.services;

import com.example.autoship.dtos.BuildResult;
import com.example.autoship.exceptions.BuildFailedException;
import com.example.autoship.models.Deployment;
import com.example.autoship.models.DockerCredentials;

public interface DockerService {

    BuildResult build_pushDockerImages(Deployment deployment, String dir_path, Long repoID, String branch, String dockerRepo) throws BuildFailedException;
    DockerCredentials addDockerCred(Long userId,String username,String password);
}
