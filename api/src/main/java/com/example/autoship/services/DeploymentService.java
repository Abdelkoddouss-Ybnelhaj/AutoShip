package com.example.autoship.services;

import java.util.Map;

public interface DeploymentService {

    void startDeployment(String eventType, Map<String, Object> payload);
}
