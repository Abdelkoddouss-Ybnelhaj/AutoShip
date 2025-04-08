package com.example.autoship.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "repositories")
@Getter
@Setter
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue
    @Column(nullable = false,name = "repo_id")
    private Long repoID;

    @Column(nullable = false,name = "user_id")
    private Long userID;

    @Column(nullable = false,name = "repo_name")
    private String repoName;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Project(Long gitHubID, String repoName) {
        this.userID = gitHubID;
        this.repoName = repoName;
    }
}
