package com.example.autoship.services.impl;

import com.example.autoship.services.JwtService;
import com.example.autoship.services.OauthService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
@Slf4j
public class GithubOauthService implements OauthService {

    private JwtService jwtService;

    @Override
    public List<String> getUserRepos(String token)  {
        String accessToken = jwtService.extractKey(token,"access-token");
        String login = jwtService.extractKey(token,"login");

        String apiUrl = "https://api.github.com/users/"+login+"/repos";

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
}
