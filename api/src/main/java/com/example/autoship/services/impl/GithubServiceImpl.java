package com.example.autoship.services.impl;

import com.example.autoship.exceptions.GithubRequestException;
import com.example.autoship.exceptions.RepositoryCloningException;
import com.example.autoship.services.JwtService;
import com.example.autoship.services.GitService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.*;

@Service
@Slf4j
public class GithubServiceImpl implements GitService {

    private final JwtService jwtService;
    private final String GITHUB_API;
    private final String PAYLOAD_URL;
    private final ProcessBuilder processBuilder;


    public GithubServiceImpl(JwtService jwtService,
                             ProcessBuilder processBuilder,
                             @Value("${spring.github-api}") String GITHUB_API,
                             @Value("${spring.webhook-url}") String PAYLOAD_URL) {
        this.jwtService = jwtService;
        this.GITHUB_API = GITHUB_API;
        this.PAYLOAD_URL = PAYLOAD_URL;
        this.processBuilder = processBuilder;
    }

    @Override
    public List<String> getUserRepos(String token) throws GithubRequestException {
        String accessToken = jwtService.extractKey(token, "access-token");
        String login = jwtService.extractKey(token, "login");

        log.info("User {} - Attempting to get github repos", login);

        String apiUrl = GITHUB_API + "/users/" + login + "/repos";

        // Example using RestTemplate to fetch repositories
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map[]> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.GET,
                    entity,
                    Map[].class
            );

            List<String> repoNames = new ArrayList<>();
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                for (Map repo : response.getBody()) {
                    repoNames.add((String) repo.get("name"));
                }
            }

            log.info("User {} - Getting github repos successfully", login);
            return repoNames;
        } catch (HttpClientErrorException e) {
            log.error("User {} - GitHub API error: {} {} ", login, e.getStatusCode(), e.getResponseBodyAsString());
            throw new GithubRequestException(e.getResponseBodyAsString(), e.getStatusCode().value());
        } catch (Exception ex) {
            log.error("User {} - Unexpected error: {}", login, ex.getMessage());
            throw new RuntimeException(ex.getMessage());
        }
    }

    @Override
    public String createWebhook(String owner, String repo,List<String> events, String secret, String accessToken) throws Exception {
        log.info("User {} - Attempting to create a github Webhook", owner);
        String url = GITHUB_API + "/repos/" + owner + "/" + repo + "/hooks";

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Accept", "application/vnd.github+json");

        // Payload
        Map<String, Object> config = new HashMap<>();
        config.put("url", PAYLOAD_URL);
        config.put("content_type", "json");
        config.put("secret", secret);
        config.put("insecure_ssl", "0");

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("name", "web");
        requestBody.put("active", true);
        requestBody.put("events", events);
        requestBody.put("config", config);

        // Request entity
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // RestTemplate
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            log.info("User {} - Webhook created successfully: {} ", owner, response.getStatusCode());
            return Objects.requireNonNull(response.getBody()).get("id").toString();
        } catch (HttpClientErrorException e) {
            log.error("User {} - GitHub API error: {} {} ", owner, e.getStatusCode(), e.getResponseBodyAsString());
            throw new GithubRequestException(e.getResponseBodyAsString(), e.getStatusCode().value());
        } catch (Exception ex) {
            log.error("User {} - Unexpected error: {}", owner, ex.getMessage());
            throw new Exception(ex.getMessage());
        }
    }

    @Override
    public Map getRepoInfos(String owner, String repoName) throws Exception {
        try {
            String url = GITHUB_API + "/repos/" + owner + "/" + repoName;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/vnd.github+json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            // RestTemplate
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            return response.getBody();
        } catch (HttpClientErrorException e) {
            log.error("User {} - GitHub API error: {} {} ", owner, e.getStatusCode(), e.getResponseBodyAsString());
            throw new GithubRequestException(e.getResponseBodyAsString(), e.getStatusCode().value());
        } catch (Exception ex) {
            log.error("User {} - Unexpected error: {}", owner, ex.getMessage());
            throw new Exception(ex.getMessage());
        }
    }

    @Override
    public void deleteWebhook(String owner, String repo, Long hookID, String accessToken) throws GithubRequestException {
        log.info("User {} - Attempting to delete GitHub Webhook ID={}", owner, hookID);

        String url = String.format("%s/repos/%s/%s/hooks/%s", GITHUB_API, owner, repo, hookID);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.valueOf("application/vnd.github+json")));

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Void> response = restTemplate.exchange(
                    url,
                    HttpMethod.DELETE,
                    requestEntity,
                    new ParameterizedTypeReference<>() {}
            );

            if (response.getStatusCode() == HttpStatus.NO_CONTENT) {
                log.info("User {} - Webhook ID={} deleted successfully (HTTP 204)", owner, hookID);

            } else {
                log.warn("User {} - Webhook ID={} deletion returned status: {}", owner, hookID, response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            log.error("User {} - GitHub API error: {} - {}", owner, e.getStatusCode(), e.getResponseBodyAsString());
            throw new GithubRequestException(e.getResponseBodyAsString(), e.getStatusCode().value());
        } catch (Exception e) {
            log.error("User {} - Unexpected error: {}", owner, e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void cloneRepo(Map<String, Object> payload) {
        // problems to solve:
        // verify that the cloned code is concerning the appropriate branch

        log.info("Attempting to clone the {}",payload.get("clone_url").toString());

        processBuilder.command("git", "clone", payload.get("clone_url").toString(), payload.get("destination").toString());
        try {
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                log.info("Repository: {} - Cloned successfully.",payload.get("clone_url").toString());
            } else {
                throw new RepositoryCloningException("Git clone failed with exit code " + exitCode);
            }
        } catch (IOException | InterruptedException | RepositoryCloningException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void cleanPath(String path) {
        processBuilder.command("rm","-rf",path);
        try {
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                System.out.println("Cleaning path successfully.");
            } else {
                System.err.println("Cleaning path failed with exit code " + exitCode);
            }
        } catch (IOException | InterruptedException e) {
            log.error("{}", e.getMessage());
        }
    }

}
