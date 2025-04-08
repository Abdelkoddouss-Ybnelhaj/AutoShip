package com.example.autoship.services;

import com.example.autoship.exceptions.GithubRequestException;

import java.util.List;

public interface GitService {

    List<String> getUserRepos(String token) throws GithubRequestException;
    String createWebhook(String owner, String repo, String secret,String accessToken) throws Exception;
}
