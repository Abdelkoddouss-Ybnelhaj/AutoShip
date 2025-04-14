package com.example.autoship.repositories;

import com.example.autoship.models.Deployment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeploymentRepository extends JpaRepository<Deployment,Long> {
}
