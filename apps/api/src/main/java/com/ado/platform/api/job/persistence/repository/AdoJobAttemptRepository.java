package com.ado.platform.api.job.persistence.repository;

import com.ado.platform.api.job.persistence.entity.AdoJobAttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdoJobAttemptRepository extends JpaRepository<AdoJobAttemptEntity, UUID> {

    Optional<AdoJobAttemptEntity> findFirstByJobIdOrderByAttemptNumberDesc(UUID jobId);
}
