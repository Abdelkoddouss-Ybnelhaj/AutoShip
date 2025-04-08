package com.example.autoship.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "webhook_listeners")
@Getter
@Setter
public class WebhookListener {

    @Id
    @GeneratedValue
    @Column(nullable = false, name = "listener_id")
    private Long listenerID;

    @Column(nullable = false, name = "repo_id")
    private Long repoID;

    @Column(nullable = false, name = "branch")
    private String branch;

    private String webhook_secret;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public WebhookListener(Long repoID, String branch, String webhook_secret) {
        this.repoID = repoID;
        this.branch = branch;
        this.webhook_secret = webhook_secret;
    }
}
