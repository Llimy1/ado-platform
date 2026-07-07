package com.ado.platform.api.job.persistence.repository;

import com.ado.platform.api.job.persistence.entity.AdoArtifactEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdoArtifactRepository extends JpaRepository<AdoArtifactEntity, UUID> {

    Optional<AdoArtifactEntity> findByProjectProjectKeyAndArtifactKey(String projectKey, String artifactKey);
}
