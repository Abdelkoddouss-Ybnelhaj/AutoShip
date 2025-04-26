package com.example.autoship.controllers;

import com.example.autoship.services.EnvironmentService;
import com.example.autoship.utils.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.example.autoship.common.MessageKeys.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/servers")
public class EnvironmentController {

    private EnvironmentService environmentService;
    private final ResponseBuilder responseBuilder;

    @Operation(summary = "Fetching Environments", responses = {
            @ApiResponse(responseCode = "200", description = INFO_FETCHING_ENVIRONMENTS),
            @ApiResponse(responseCode = "500", description = ERROR_UNEXPECTED_ERROR)
    })
    @GetMapping
    public ResponseEntity<?> getAllEnvironments(@RequestHeader("Authorization") String authHeader){
        String jwtToken = authHeader.substring(7);
        return responseBuilder.buildResponse(HttpStatus.OK.value(),INFO_FETCHING_ENVIRONMENTS,environmentService.getAllEnvironments(jwtToken));
    }

    @Operation(summary = "Fetching Environment Details", responses = {
            @ApiResponse(responseCode = "200", description = INFO_FETCHING_ENVIRONMENT_DETAILS),
            @ApiResponse(responseCode = "500", description = ERROR_UNEXPECTED_ERROR)
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getEnvironment(@PathVariable("id") Long id , @RequestHeader("Authorization") String authHeader) {
        String jwtToken = authHeader.substring(7);
        return responseBuilder.buildResponse(HttpStatus.OK.value(),INFO_FETCHING_ENVIRONMENT_DETAILS,environmentService.getEnvironment(jwtToken,id));
    }
}
