package com.example.autoship.repositories;

import com.example.autoship.models.DockerCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DockerCredRepository extends JpaRepository<DockerCredentials,Long> {

}
