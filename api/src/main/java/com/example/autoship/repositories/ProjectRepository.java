package com.example.autoship.repositories;

import com.example.autoship.models.DockerCredentials;
import com.example.autoship.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project,Long> {

}
