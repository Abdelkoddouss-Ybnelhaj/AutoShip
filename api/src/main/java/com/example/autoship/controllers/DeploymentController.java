package com.example.autoship.controllers;

import com.example.autoship.dtos.DeploymentConfigDTO;
import com.example.autoship.services.ProjectService;
import com.example.autoship.utils.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import static com.example.autoship.common.MessageKeys.*;

@RestController
@RequestMapping("/api/v1/deployment")
@AllArgsConstructor
public class DeploymentController {

    private final ProjectService projectService;
    private final ResponseBuilder responseBuilder;

    @Operation(summary = "Get Repos", responses = {
            @ApiResponse(responseCode = "201", description = INFO_DEPLOYMENT_CONFIGURATION),
            @ApiResponse(responseCode = "404", description = ERROR_REPO_NOT_FOUND),
            @ApiResponse(responseCode = "422", description = ERROR_HOOK_EXIST),
            @ApiResponse(responseCode = "500", description = ERROR_DEPLOYMENT_CONFIGURATION)
    })
    @PostMapping
    public ResponseEntity<?> configDeployment(@RequestHeader("Authorization") String authHeader,
                                           @RequestBody @Valid DeploymentConfigDTO request) throws Exception {

        String jwtToken = authHeader.substring(7);
        projectService.configDeployment(request,jwtToken);
        return responseBuilder.buildResponse(HttpStatus.CREATED.value(), INFO_DEPLOYMENT_CONFIGURATION);
    }



}
