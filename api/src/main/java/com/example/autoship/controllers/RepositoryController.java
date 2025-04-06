package com.example.autoship.controllers;

import com.example.autoship.services.OauthService;
import com.example.autoship.utils.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/repos")
@AllArgsConstructor
public class RepositoryController {

    private final OauthService oauthService;
    private final ResponseBuilder responseBuilder;

    @Operation(summary = "Get Repos", responses = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully Fetching Repos for user ."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error while trying to send http request to github api")
    })
    @GetMapping
    public ResponseEntity<?> getUserRepos(@RequestHeader("Authorization") String authHeader){
        // 1. Extract JWT
        String jwtToken = authHeader.substring(7);
        return responseBuilder.buildResponse(HttpStatus.OK.value(),"User repos fetched successfully",oauthService.getUserRepos(jwtToken));
    }
}
