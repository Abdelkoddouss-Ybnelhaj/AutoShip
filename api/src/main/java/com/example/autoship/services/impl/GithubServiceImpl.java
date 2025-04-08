package com.example.autoship.services.impl;

import com.example.autoship.services.JwtService;
import com.example.autoship.services.GitService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
@Slf4j
public class GithubServiceImpl implements GitService {

    private JwtService jwtService;
    private final RestTemplate restTemplate;
    @Value("${spring.security.oauth2.client.registration.github.api-url}")
    private String GITHUB_API;
    @Value("${spring.webhook-url}")
    private String PAYLOAD_URL;

    @Override
    public List<String> getUserRepos(String token)  {
        String accessToken = jwtService.extractKey(token,"access-token");
        String login = jwtService.extractKey(token,"login");

        String apiUrl = GITHUB_API + "/users/" + login + "/repos";

        // Example using RestTemplate to fetch repositories
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

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

        return repoNames;
    }

    @Override
    public void createWebhook(String owner, String repo, String secret,String accessToken) {
        String url = GITHUB_API + "/repos/" + owner + "/" + repo + "/hooks";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> config = new HashMap<>();
        config.put("url", PAYLOAD_URL);
        config.put("content_type", "json");
        config.put("secret", secret);
        config.put("insecure_ssl", "0");

        Map<String, Object> body = new HashMap<>();
        body.put("name", "web");
        body.put("active", true);
        body.put("events", List.of("push", "pull_request"));
        body.put("config", config);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            System.out.println("Response: " + response.getStatusCode() + " " + response.getBody());
        } catch (HttpClientErrorException e) {
            System.err.println("GitHub error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        }
    }
}
