package com.example.autoship.repositories;

import com.example.autoship.models.DockerCredentials;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DockerCredRepository extends JpaRepository<DockerCredentials,Long> {
}
