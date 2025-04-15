package com.example.autoship.controllers;

import com.example.autoship.services.DeploymentService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/webhook")
@AllArgsConstructor
public class WebhookController {

    private final DeploymentService deploymentService;

    @PostMapping
    public ResponseEntity<String> handleWebhook(
            @RequestHeader("X-GitHub-Event") String eventType,
            @RequestHeader("X-Hub-Signature-256") String signature,
            @RequestBody Map<String, Object> payload) {

        deploymentService.startDeployment(eventType,payload);
        return ResponseEntity.ok("Webhook received successfully");
    }
}
