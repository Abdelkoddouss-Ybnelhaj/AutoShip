package com.example.autoship.services;

import com.example.autoship.exceptions.GithubRequestException;

import java.util.List;
import java.util.Map;

public interface GitService {

    List<String> getUserRepos(String token) throws GithubRequestException;

    String createWebhook(String owner, String repo, String secret, String accessToken) throws Exception;

    Map<String, Object> getRepoInfos(String owner, String repoName) throws Exception;

    void cloneRepo(Map<String, Object> payload);

    void cleanPath(String path);
}
