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

    @Column(nullable = false, unique = true, name = "server_ip")
    private String serverIP;

    @Column(nullable = false, name = "server_name")
    private String serverName;

    @Column(nullable = false, name = "username")
    private String username;

    @Column(nullable = false, name = "ssh_key", columnDefinition = "TEXT")
    private String sshKey;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Environment(Long userID, String serverIP,String serverName, String username, String sshKey) {
        this.userID = userID;
        this.serverIP = serverIP;
        this.serverName = serverName;
        this.username = username;
        this.sshKey = sshKey;
    }
}
