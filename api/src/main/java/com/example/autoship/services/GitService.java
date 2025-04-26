package com.example.autoship.services;

import com.example.autoship.exceptions.GithubRequestException;

import java.util.List;
import java.util.Map;

public interface GitService {

    List<String> getUserRepos(String token) throws GithubRequestException;

    String createWebhook(String owner, String repo, List<String> events, String secret, String accessToken) throws Exception;

    Map<String, Object> getRepoInfos(String owner, String repoName) throws Exception;

    void deleteWebhook(String owner, String repo, Long hookID, String accessToken) throws GithubRequestException;

    void cloneRepo(Map<String, Object> payload);

    void cleanPath(String path);
}
