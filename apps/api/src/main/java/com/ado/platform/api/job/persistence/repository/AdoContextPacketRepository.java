package com.ado.platform.api.job.persistence.repository;

import com.ado.platform.api.job.persistence.entity.AdoContextPacketEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdoContextPacketRepository extends JpaRepository<AdoContextPacketEntity, UUID> {

    Optional<AdoContextPacketEntity> findByArtifactProjectProjectKeyAndArtifactArtifactKey(
            String projectKey,
            String artifactKey
    );
}
