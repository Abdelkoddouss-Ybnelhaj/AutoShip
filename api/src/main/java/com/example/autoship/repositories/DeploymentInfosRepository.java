package com.example.autoship.repositories;

import com.example.autoship.models.DeploymentInfos;
import com.example.autoship.models.Environment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeploymentInfosRepository extends JpaRepository<DeploymentInfos,Long> {

    DeploymentInfos findOneByWebhookListener_ListenerID(Long listenerID);

}
