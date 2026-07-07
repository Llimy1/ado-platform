package com.ado.platform.api.job.persistence.repository;

import com.ado.platform.api.job.persistence.entity.AdoJobEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdoJobRepository extends JpaRepository<AdoJobEntity, UUID> {

    List<AdoJobEntity> findByProjectProjectKeyOrderByPriorityAscScheduledAtAscCreatedAtAscIdAsc(String projectKey);

    Optional<AdoJobEntity> findByProjectProjectKeyAndJobKey(String projectKey, String jobKey);

    Optional<AdoJobEntity> findByProjectProjectKeyAndIdempotencyKey(String projectKey, String idempotencyKey);
}
