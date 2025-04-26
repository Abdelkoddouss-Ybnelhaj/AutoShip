package com.example.autoship.controllers;

import com.example.autoship.exceptions.GithubRequestException;
import com.example.autoship.services.GitService;
import com.example.autoship.utils.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.example.autoship.common.MessageKeys.*;

@RestController
@RequestMapping("/api/v1/repos")
@AllArgsConstructor
public class RepositoryController {

    private final GitService gitService;
    private final ResponseBuilder responseBuilder;


    @Operation(summary = "Get Repos", responses = {
            @ApiResponse(responseCode = "200", description = INFO_REPOS_FETCHED),
            @ApiResponse(responseCode = "500", description = ERROR_GITHUB_HTTP_REQUEST)
    })
    @GetMapping
    public ResponseEntity<?> getUserRepos(@RequestHeader("Authorization") String authHeader) throws GithubRequestException {
        String jwtToken = authHeader.substring(7);
        return responseBuilder.buildResponse(HttpStatus.OK.value(),INFO_REPOS_FETCHED,gitService.getUserRepos(jwtToken));
    }

}
