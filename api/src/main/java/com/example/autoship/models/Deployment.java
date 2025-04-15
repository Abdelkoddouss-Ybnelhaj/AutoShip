package com.example.autoship.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "deployments")
@Getter
@Setter
@NoArgsConstructor
public class Deployment {

    @Id
    @GeneratedValue
    @Column(nullable = false, name = "dep_id")
    private Long depID;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "listenerID")
    private WebhookListener webhookListener;

    @Column(nullable = false, name = "cmd")
    private String cmd;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusType status;

    @OneToMany(mappedBy = "deployment")
    private List<Build> builds;

    @Column(name = "logs",columnDefinition = "TEXT")
    private String logs;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Deployment(WebhookListener webhookListener, String cmd, StatusType status) {
        this.webhookListener = webhookListener;
        this.cmd = cmd;
        this.status = status;
    }

    public Deployment(WebhookListener webhookListener, String cmd) {
        this.webhookListener = webhookListener;
        this.cmd = cmd;
    }
}
