package com.ado.platform.api.job.persistence.repository;

import com.ado.platform.api.job.persistence.entity.AdoJobEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AdoJobEventRepository extends JpaRepository<AdoJobEventEntity, UUID> {

    List<AdoJobEventEntity> findByJobAttemptIdAndSequenceGreaterThanOrderBySequenceAsc(UUID jobAttemptId, long sequence);
}
