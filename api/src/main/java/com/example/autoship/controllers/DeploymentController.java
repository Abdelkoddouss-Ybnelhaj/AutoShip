package com.example.autoship.controllers;

import com.example.autoship.dtos.request.DeploymentConfigDTO;
import com.example.autoship.exceptions.DeploymentNotFoundException;
import com.example.autoship.exceptions.GithubRequestException;
import com.example.autoship.services.DeploymentService;
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
@RequestMapping("/api/v1/deployments")
@AllArgsConstructor
public class DeploymentController {

    private final ProjectService projectService;
    private final ResponseBuilder responseBuilder;
    private final DeploymentService deploymentService;


    @Operation(summary = "Deployment Configuration", responses = {
            @ApiResponse(responseCode = "201", description = INFO_DEPLOYMENT_CONFIGURATION),
            @ApiResponse(responseCode = "404", description = ERROR_RESOURCE_NOT_FOUND),
            @ApiResponse(responseCode = "422", description = ERROR_HOOK_EXIST),
            @ApiResponse(responseCode = "500", description = ERROR_DEPLOYMENT_CONFIGURATION)
    })



    @PostMapping("/config")
    public ResponseEntity<?> configDeployment(@RequestHeader("Authorization") String authHeader,
                                           @RequestBody @Valid DeploymentConfigDTO request) throws Exception {

        String jwtToken = authHeader.substring(7);
        projectService.configDeployment(request,jwtToken);
        return responseBuilder.buildResponse(HttpStatus.CREATED.value(), INFO_DEPLOYMENT_CONFIGURATION);
    }




    @Operation(summary = "Fetching Deployments", responses = {
            @ApiResponse(responseCode = "200", description = INFO_FETCHING_DEPLOYMENTS),
            @ApiResponse(responseCode = "500", description = ERROR_UNEXPECTED_ERROR)
    })
    @GetMapping
    public ResponseEntity<?> getDeployments(@RequestHeader("Authorization") String authHeader){
        String jwtToken = authHeader.substring(7);
        return responseBuilder.buildResponse(HttpStatus.OK.value(),INFO_FETCHING_DEPLOYMENTS,deploymentService.getAllDeployments(jwtToken));
    }




    @Operation(summary = "Fetching Deployment Details", responses = {
            @ApiResponse(responseCode = "200", description = INFO_FETCHING_DEPLOYMENT_DETAILS),
            @ApiResponse(responseCode = "404", description = ERROR_DEPLOYMENT_NOT_FOUND),
            @ApiResponse(responseCode = "500", description = ERROR_UNEXPECTED_ERROR)
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getDeploymentDetails(@PathVariable("id") Long id ,@RequestHeader("Authorization") String authHeader) throws DeploymentNotFoundException {
        String jwtToken = authHeader.substring(7);
        return responseBuilder.buildResponse(HttpStatus.OK.value(),INFO_FETCHING_DEPLOYMENT_DETAILS,deploymentService.getDepDetails(jwtToken,id));
    }



    @Operation(summary = "Fetching All Deployments Configs", responses = {
            @ApiResponse(responseCode = "200", description = INFO_FETCHING_DEPLOYMENT_CONFIGS),
            @ApiResponse(responseCode = "500", description = ERROR_UNEXPECTED_ERROR)
    })
    @GetMapping("configs")
    public ResponseEntity<?> getDeploymentConfigs(@RequestHeader("Authorization") String authHeader){
        String jwtToken = authHeader.substring(7);
        return responseBuilder.buildResponse(HttpStatus.OK.value(),INFO_FETCHING_DEPLOYMENT_CONFIGS,deploymentService.getDeploymentConfigs(jwtToken));
    }




    @Operation(summary = "Fetching Deployment Configuration", responses = {
            @ApiResponse(responseCode = "200", description = INFO_FETCHING_DEPLOYMENT_CONFIG),
            @ApiResponse(responseCode = "500", description = ERROR_UNEXPECTED_ERROR)
    })
    @GetMapping("configs/{id}")
    public ResponseEntity<?> getDeploymentConfig(@RequestHeader("Authorization") String authHeader,
                                                @PathVariable("id") Long id){
        String jwtToken = authHeader.substring(7);
        return responseBuilder.buildResponse(HttpStatus.OK.value(),INFO_FETCHING_DEPLOYMENT_CONFIG,deploymentService.getDeploymentConfig(jwtToken,id));
    }


    @Operation(summary = "Deleting Deployment Configuration", responses = {
            @ApiResponse(responseCode = "204", description = INFO_DELETING_DEPLOYMENT_CONFIG),
            @ApiResponse(responseCode = "404", description = ERROR_RESOURCE_NOT_FOUND),
            @ApiResponse(responseCode = "500", description = ERROR_UNEXPECTED_ERROR)
    })
    @DeleteMapping("configs/{repo}/{hookID}")
    public ResponseEntity<?> deleteDeploymentConfig(@RequestHeader("Authorization") String authHeader,
                                                @PathVariable("repo") String repo,
                                                @PathVariable("hookID") Long hookID) throws GithubRequestException {
        String jwtToken = authHeader.substring(7);
        projectService.deleteDeploymentConfig(jwtToken,repo,hookID);
        return responseBuilder.buildResponse(204,INFO_DELETING_DEPLOYMENT_CONFIG);
    }

}
