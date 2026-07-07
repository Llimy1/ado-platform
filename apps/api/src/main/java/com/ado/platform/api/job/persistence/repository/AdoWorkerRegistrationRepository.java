package com.ado.platform.api.job.persistence.repository;

import com.ado.platform.api.job.persistence.entity.AdoWorkerRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdoWorkerRegistrationRepository extends JpaRepository<AdoWorkerRegistrationEntity, UUID> {

    Optional<AdoWorkerRegistrationEntity> findByWorkerKey(String workerKey);
}
