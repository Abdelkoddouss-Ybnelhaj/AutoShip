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
@Table(name = "builds")
@Getter
@Setter
@NoArgsConstructor
public class Build {

    @Id
    @GeneratedValue
    @Column(nullable = false, name = "build_id")
    private Long buildID;

    @ManyToOne
    @JoinColumn(name = "dep_id")
    private Deployment deployment;

    @Column(nullable = false, name = "status")
    @Enumerated(EnumType.STRING)
    private StatusType status;

    @Column(nullable = false, name = "logs",columnDefinition = "TEXT")
    private String logs;

    @OneToMany(mappedBy = "build", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Artifact> artifacts;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Build(Deployment deployment, StatusType status,String logs) {
        this.deployment = deployment;
        this.status = status;
        this.logs = logs;
    }

}
