package com.example.autoship.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "webhook_listeners")
@Getter
@Setter
@NoArgsConstructor
public class WebhookListener {

    @Id
    @Column(nullable = false, name = "listener_id")
    private Long listenerID;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "repo_id")
    private Project project;

    @Column(nullable = false, name = "branch")
    private String branch;

    @Column(nullable = false, name = "webhook_secret")
    private String webhook_secret;

    @OneToOne(mappedBy = "webhookListener", cascade = CascadeType.ALL, orphanRemoval = true)
    private DeploymentInfos deploymentInfos;

    @OneToMany(mappedBy = "webhookListener", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Deployment> deployments;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public WebhookListener(Long listenerID ,Project project, String branch, String webhook_secret) {
        this.listenerID = listenerID;
        this.project = project;
        this.branch = branch;
        this.webhook_secret = webhook_secret;
    }
}
