package com.example.autoship.services.impl;

import com.example.autoship.exceptions.GithubRequestException;
import com.example.autoship.services.JwtService;
import com.example.autoship.services.GitService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
public class GithubServiceImpl implements GitService {

    private final JwtService jwtService;
    private final String GITHUB_API;
    private final String PAYLOAD_URL;

    public GithubServiceImpl(JwtService jwtService,
                             @Value("${spring.github-api}") String GITHUB_API,
                             @Value("${spring.webhook-url}")String PAYLOAD_URL) {
        this.jwtService = jwtService;
        this.GITHUB_API = GITHUB_API;
        this.PAYLOAD_URL = PAYLOAD_URL;
    }


    @Override
    public List<String> getUserRepos(String token) throws GithubRequestException {
        String accessToken = jwtService.extractKey(token,"access-token");
        String login = jwtService.extractKey(token,"login");

        log.info("User {} - Attempting to get github repos",login);

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

            log.info("User {} - Getting github repos successfully",login);
            return repoNames;
        } catch (HttpClientErrorException e) {
            log.error("User {} - GitHub API error: {} {} ",login, e.getStatusCode(),e.getResponseBodyAsString());
            throw new GithubRequestException(e.getResponseBodyAsString(),e.getStatusCode().value());
        } catch (Exception ex) {
            log.error("User {} - Unexpected error: {}",login, ex.getMessage());
            throw new RuntimeException(ex.getMessage());
        }
    }

    @Override
    public String createWebhook(String owner, String repo, String secret,String accessToken) throws Exception {
        log.info("User {} - Attempting to create a github Webhook",owner);
        String url = GITHUB_API + "/repos/" + owner + "/" + repo + "/hooks";

        // Header
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
        requestBody.put("events", List.of("push", "pull_request"));
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

            log.info("User {} - Webhook created successfully: {} ",owner,response.getStatusCode());
            return Objects.requireNonNull(response.getBody()).get("id").toString();
        } catch (HttpClientErrorException e) {
            System.out.println(e);
            log.error("User {} - GitHub API error: {} {} ",owner, e.getStatusCode(),e.getResponseBodyAsString());
            throw new GithubRequestException(e.getResponseBodyAsString(),e.getStatusCode().value());
        } catch (Exception ex) {
            log.error("User {} - Unexpected error: {}",owner, ex.getMessage());
            throw new Exception(ex.getMessage());
        }
    }
}
