package com.example.autoship.repositories;

import com.example.autoship.models.WebhookListener;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WebhookListenerRepository extends JpaRepository<WebhookListener,Long> {

    WebhookListener findOneByProject_RepoIDAndBranch(Long repoID, String branch);
}
