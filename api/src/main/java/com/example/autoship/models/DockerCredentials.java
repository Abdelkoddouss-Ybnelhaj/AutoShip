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
@Table(name = "docker_credentials")
@Getter
@Setter
@NoArgsConstructor
public class DockerCredentials {

    @Id
    @GeneratedValue
    @Column(nullable = false, name = "cred_id")
    private Long credID;

    @Column(nullable = false,name = "user_id")
    private Long userID;

    @Column(nullable = false, name = "username")
    private String username;

    @Column(nullable = false, name = "password")
    private String password;

    @OneToMany(mappedBy = "dockerCredentials")
    private List<Project> projects;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public DockerCredentials(Long userID,String username, String password) {
        this.userID = userID;
        this.username = username;
        this.password = password;
    }
}
