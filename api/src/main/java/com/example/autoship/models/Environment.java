package com.example.autoship.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "environments")
@Getter
@Setter
@NoArgsConstructor
public class Environment {

    @Id
    @GeneratedValue
    @Column(nullable = false,name = "env_id")
    private Long envID;

    @Column(nullable = false,name = "user_id")
    private Long userID;

    @ManyToOne
    @JoinColumn(name = "repo_id")
    private Project project;

    @Column(nullable = false, name = "server_ip")
    private String serverIP;

    @Column(nullable = false, name = "username")
    private String username;

    @Column(nullable = false, name = "sshKey", columnDefinition = "TEXT")
    private String sshKey;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Environment(Long userID, Project project, String serverIP, String username, String sshKey) {
        this.userID = userID;
        this.project = project;
        this.serverIP = serverIP;
        this.username = username;
        this.sshKey = sshKey;
    }
}
