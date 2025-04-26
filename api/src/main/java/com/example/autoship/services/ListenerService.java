package com.example.autoship.services;

import com.example.autoship.models.Project;
import com.example.autoship.models.WebhookListener;

public interface ListenerService {

    WebhookListener addListener(Long webhookID, Project project,String branch,String secret);
}
