package com.example.autoship.services;

import com.example.autoship.models.DeploymentInfos;
import com.example.autoship.models.Environment;
import com.example.autoship.models.WebhookListener;

public interface DeploymentInfosService {

    DeploymentInfos addDeploymentInfos(WebhookListener webhookListener, String cmd, String dockerRepo, Environment env);
}
