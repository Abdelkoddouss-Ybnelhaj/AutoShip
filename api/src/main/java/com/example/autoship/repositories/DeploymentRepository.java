package com.example.autoship.repositories;

import com.example.autoship.dtos.response.DeploymentDTO;
import com.example.autoship.models.Deployment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeploymentRepository extends JpaRepository<Deployment,Long> {

    @Query(value = """
        SELECT d.dep_id, p.repo_name,
            w.branch , d.event, d.commit , d.status, d.created_at
        FROM deployments d
        JOIN webhook_listeners w ON w.listener_id = d.listenerID
        JOIN projects p ON p.repo_id = w.repo_id
        WHERE p.user_id = :userID
        ORDER BY d.dep_id DESC
        """, nativeQuery = true)
    List<DeploymentDTO> getAllDeploymentsForUser(@Param("userID") Long userID);


    @Query(value = """
        SELECT d.dep_id, p.repo_name, w.branch , d.event , d.commit , d.status, b.status ,
            d.logs , b.logs , d.cmd , a.name , d.created_at
        FROM deployments d
        JOIN builds b ON b.dep_id = d.dep_id
        LEFT JOIN artifacts a ON a.build_id = b.build_id
        JOIN webhook_listeners w ON w.listener_id = d.listenerID
        JOIN projects p ON p.repo_id = w.repo_id
        WHERE d.dep_id = :depID AND p.user_id = :userID
        """, nativeQuery = true)
    List<Object[]> getDeploymentDetailsForUser(@Param("userID") Long userID,@Param("depID") Long depID);


    @Query(value = """
        SELECT p.repo_name , w.branch , ev.name , e.server_name , p.created_at , w.listener_id
        FROM projects p
        JOIN webhook_listeners w ON w.repo_id = p.repo_id
        JOIN deployment_infos df ON df.listenerID = w.listener_id
        JOIN events ev ON ev.listener_id = w.listener_id
        LEFT JOIN environments e ON e.env_id = df.envID
        WHERE p.user_id = :userID
        """, nativeQuery = true)
    List<Object[]> getAllDeploymentConfigsForUser(@Param("userID") Long userID);


    @Query(value = """
        SELECT p.repo_name , w.branch , ev.name , e.server_name , p.created_at, w.listener_id
        FROM projects p
        JOIN webhook_listeners w ON w.repo_id = p.repo_id
        JOIN deployment_infos df ON df.listenerID = w.listener_id
        JOIN events ev ON ev.listener_id = w.listener_id
        LEFT JOIN environments e ON e.env_id = df.envID
        WHERE p.user_id = :userID AND w.listener_id = :listenerID
        """, nativeQuery = true)
    List<Object[]> getAllDeploymentConfigForUser(@Param("userID") Long userID,Long listenerID);
}
