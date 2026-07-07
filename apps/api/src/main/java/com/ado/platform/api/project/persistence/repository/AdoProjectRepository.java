package com.ado.platform.api.project.persistence.repository;

import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdoProjectRepository extends JpaRepository<AdoProjectEntity, UUID> {

    boolean existsByProjectKey(String projectKey);

    Optional<AdoProjectEntity> findByProjectKey(String projectKey);
}
