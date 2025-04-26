package com.example.autoship.services.impl;

import com.example.autoship.models.DeploymentInfos;
import com.example.autoship.models.Environment;
import com.example.autoship.models.WebhookListener;
import com.example.autoship.repositories.DeploymentInfosRepository;
import com.example.autoship.services.DeploymentInfosService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class DeploymentInfosServiceImpl implements DeploymentInfosService {

    private final DeploymentInfosRepository infosRepository;

    @Override
    public DeploymentInfos addDeploymentInfos(WebhookListener webhookListener, String cmd, String dockerRepo, Environment env) {
        DeploymentInfos existInfos = infosRepository.findOneByWebhookListener_ListenerID(webhookListener.getListenerID());

        if(existInfos == null){
            DeploymentInfos deploymentInfos = new DeploymentInfos(webhookListener, cmd, dockerRepo, env);
            return infosRepository.save(deploymentInfos);
        }

        log.info("Deployment Infos saved with cmd={} and docker_repo_name={}",cmd,dockerRepo);
        return existInfos;
    }
}
