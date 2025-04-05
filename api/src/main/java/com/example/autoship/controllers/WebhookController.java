package com.example.autoship.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhook")
public class WebhookController {

//    @Autowired
//    private DeploymentService deploymentService;

    @PostMapping
    public ResponseEntity<String> handleWebhook(@RequestHeader("X-Hub-Signature-256") String signature,
                                                @RequestBody String payload) {
//        if (!deploymentService.verifySignature(payload, signature)) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
//        }
//        deploymentService.processWebhook(payload);
        return ResponseEntity.ok("Webhook received successfully");
    }
}
