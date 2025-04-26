package com.example.autoship.services.impl;

import com.example.autoship.models.Project;
import com.example.autoship.models.WebhookListener;
import com.example.autoship.repositories.WebhookListenerRepository;
import com.example.autoship.services.ListenerService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class ListenerServiceImpl implements ListenerService {

    private final WebhookListenerRepository listenerRepository;

    @Override
    public WebhookListener addListener(Long webhookID, Project project, String branch, String secret) {
        //log.debug("User: {} - Saving webhook listener for project: {} and branch: {}", login, savedProject.getRepoID(), request.getBranch());
        Optional<WebhookListener> listener = listenerRepository.findById(webhookID);

        if(listener.isEmpty()){
            WebhookListener hook = new WebhookListener(webhookID,project, branch, secret);
            return listenerRepository.save(hook);
        }
        //log.info("User: {} - Webhook listener saved with listener ID: {}", login, savedListener.getListenerID());
        return listener.get();
    }
}
