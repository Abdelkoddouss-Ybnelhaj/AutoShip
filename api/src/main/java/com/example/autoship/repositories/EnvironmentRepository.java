package com.example.autoship.repositories;

import com.example.autoship.dtos.response.EnvironmentDTO;
import com.example.autoship.models.Environment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EnvironmentRepository extends JpaRepository<Environment, Long> {

    @Query(value = """
            SELECT env_id,server_ip,server_name,username,created_at
            FROM environments
            WHERE user_id = :userID
            """, nativeQuery = true)
    List<EnvironmentDTO> findEnvByUser(@Param("userID") Long userID);

    @Query(value = """
            SELECT *
            FROM environments
            WHERE user_id = :userID AND server_name = :serverName
            """, nativeQuery = true)
    Environment findEnvByUserAndName(@Param("userID") Long userID,@Param("serverName") String serverName);

    @Query(value = """
            SELECT env_id,server_ip,server_name,username,created_at
            FROM environments
            WHERE user_id = :userID AND env_id = :envID
            """, nativeQuery = true)
    EnvironmentDTO findEnvByUserANDId(@Param("userID") Long userID, @Param("envID") Long envID);

}
