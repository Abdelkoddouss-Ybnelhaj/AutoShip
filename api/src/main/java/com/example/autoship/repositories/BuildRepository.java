package com.example.autoship.repositories;

import com.example.autoship.models.Build;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BuildRepository extends JpaRepository<Build,Long> {

    List<Build> findByDeployment_WebhookListener_Project_RepoIDAndDeployment_WebhookListener_Branch(Long repoID, String branch, Pageable pageable);

}
