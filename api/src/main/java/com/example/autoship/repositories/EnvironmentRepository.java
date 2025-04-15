package com.example.autoship.repositories;

import com.example.autoship.models.Environment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnvironmentRepository extends JpaRepository<Environment,Long> {

    Environment findOneByProject_RepoID(Long repoID);

}
