package com.example.autoship.repositories;

import com.example.autoship.models.WebhookListener;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WebhookListenerRepository extends JpaRepository<WebhookListener,Long> {
}
