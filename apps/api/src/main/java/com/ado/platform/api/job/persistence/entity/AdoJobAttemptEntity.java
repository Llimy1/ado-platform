package com.ado.platform.api.job.persistence.entity;

import com.ado.platform.api.common.persistence.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "ado_job_attempt")
public class AdoJobAttemptEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private AdoJobEntity job;

    @Column(name = "attempt_number", nullable = false)
    private int attemptNumber;

    @Column(nullable = false, length = 30)
    private AdoJobAttemptStatus status;

    @Column(name = "worker_key", length = 120)
    private String workerKey;

    @Column(name = "lease_expires_at")
    private Instant leaseExpiresAt;

    @Column(name = "last_heartbeat_at")
    private Instant lastHeartbeatAt;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    @Column(name = "timeout_at")
    private Instant timeoutAt;

    @Column(name = "exit_code")
    private Integer exitCode;

    @Column(length = 80)
    private String signal;

    @Column(name = "failure_code", length = 120)
    private String failureCode;

    @Column(name = "redacted_summary", length = 1000)
    private String redactedSummary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_artifact_id")
    private AdoArtifactEntity resultArtifact;

    @Builder(access = AccessLevel.PRIVATE)
    private AdoJobAttemptEntity(
            AdoJobEntity job,
            int attemptNumber,
            AdoJobAttemptStatus status
    ) {
        this.job = job;
        this.attemptNumber = attemptNumber;
        this.status = status;
    }

    public static AdoJobAttemptEntity createQueued(AdoJobEntity job, int attemptNumber) {
        return AdoJobAttemptEntity.builder()
                .job(job)
                .attemptNumber(attemptNumber)
                .status(AdoJobAttemptStatus.QUEUED)
                .build();
    }
}
