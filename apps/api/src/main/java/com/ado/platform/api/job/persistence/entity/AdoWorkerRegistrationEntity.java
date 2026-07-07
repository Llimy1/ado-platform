package com.ado.platform.api.job.persistence.entity;

import com.ado.platform.api.common.persistence.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "ado_worker_registration")
public class AdoWorkerRegistrationEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    private UUID id;

    @Column(name = "worker_key", nullable = false, length = 120)
    private String workerKey;

    @Column(name = "display_name", length = 200)
    private String displayName;

    @Column(nullable = false, length = 30)
    private AdoWorkerStatus status;

    @Column(name = "capabilities_json", nullable = false, columnDefinition = "text")
    private String capabilitiesJson;

    @Column(nullable = false, length = 80)
    private String version;

    @Column(name = "max_concurrent_jobs", nullable = false)
    private int maxConcurrentJobs;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "last_heartbeat_at", nullable = false)
    private Instant lastHeartbeatAt;

    @Column(name = "offline_at")
    private Instant offlineAt;

    @Builder(access = AccessLevel.PRIVATE)
    private AdoWorkerRegistrationEntity(
            String workerKey,
            String displayName,
            AdoWorkerStatus status,
            String capabilitiesJson,
            String version,
            int maxConcurrentJobs,
            Instant startedAt,
            Instant lastHeartbeatAt
    ) {
        this.workerKey = workerKey;
        this.displayName = displayName;
        this.status = status;
        this.capabilitiesJson = capabilitiesJson;
        this.version = version;
        this.maxConcurrentJobs = maxConcurrentJobs;
        this.startedAt = startedAt;
        this.lastHeartbeatAt = lastHeartbeatAt;
    }

    public static AdoWorkerRegistrationEntity register(
            String workerKey,
            String displayName,
            String capabilitiesJson,
            String version,
            Instant startedAt
    ) {
        return AdoWorkerRegistrationEntity.builder()
                .workerKey(workerKey)
                .displayName(displayName)
                .status(AdoWorkerStatus.IDLE)
                .capabilitiesJson(capabilitiesJson)
                .version(version)
                .maxConcurrentJobs(1)
                .startedAt(startedAt)
                .lastHeartbeatAt(startedAt)
                .build();
    }
}
