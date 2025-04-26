package com.example.autoship.repositories;

import com.example.autoship.models.DockerCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DockerCredRepository extends JpaRepository<DockerCredentials,Long> {

    @Query(value = """
        SELECT CASE
                WHEN COUNT(*) > 0 THEN TRUE
                ELSE FALSE
               END
        FROM docker_credentials
        WHERE username = :username
        """, nativeQuery = true)
    boolean existByUsername(@Param("username") String username);

    @Query(value = """
        SELECT *
        FROM docker_credentials
        WHERE username = :username
        """, nativeQuery = true)
    DockerCredentials findByUsername(@Param("username") String username);





}
