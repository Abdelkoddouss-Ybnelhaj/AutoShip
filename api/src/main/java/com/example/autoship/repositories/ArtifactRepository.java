package com.example.autoship.repositories;

import com.example.autoship.models.Artifact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtifactRepository extends JpaRepository<Artifact,Long> {
}
