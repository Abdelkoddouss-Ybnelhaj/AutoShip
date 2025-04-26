package com.example.autoship.models;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "deployment_infos")
@Getter
@Setter
@NoArgsConstructor
public class DeploymentInfos {

    @Id
    @GeneratedValue
    @Column(nullable = false, name = "id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "listenerID")
    private WebhookListener webhookListener;

    @ManyToOne
    @JoinColumn(name = "envID")
    private Environment environment;

    @Column(nullable = false, name = "cmd")
    private String cmd;

    @Column(nullable = false, name = "docker_repo")
    private String docker_repo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    public DeploymentInfos(WebhookListener webhookListener, String cmd, String docker_repo,Environment environment) {
        this.webhookListener = webhookListener;
        this.cmd = cmd;
        this.docker_repo = docker_repo;
        this.environment = environment;
    }
}
