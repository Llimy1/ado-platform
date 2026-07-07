package com.ado.platform.api.job.persistence.entity;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.common.persistence.entity.BaseTimeEntity;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
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
@Table(name = "ado_job")
public class AdoJobEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private AdoProjectEntity project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "context_packet_id")
    private AdoContextPacketEntity contextPacket;

    @Column(name = "job_key", nullable = false, length = 120)
    private String jobKey;

    @Column(name = "idempotency_key", nullable = false, length = 160)
    private String idempotencyKey;

    @Column(name = "job_type", nullable = false, length = 60)
    private AdoJobType jobType;

    @Column(name = "target_type", nullable = false, length = 60)
    private AdoJobTargetType targetType;

    @Column(name = "target_ref", nullable = false, length = 200)
    private String targetRef;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private int priority;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt;

    @Column(nullable = false, length = 30)
    private AdoJobStatus status;

    @Builder(access = AccessLevel.PRIVATE)
    private AdoJobEntity(
            AdoProjectEntity project,
            AdoContextPacketEntity contextPacket,
            String jobKey,
            String idempotencyKey,
            AdoJobType jobType,
            AdoJobTargetType targetType,
            String targetRef,
            String title,
            String description,
            int priority,
            Instant scheduledAt,
            AdoJobStatus status
    ) {
        this.project = project;
        this.contextPacket = contextPacket;
        this.jobKey = jobKey;
        this.idempotencyKey = idempotencyKey;
        this.jobType = jobType;
        this.targetType = targetType;
        this.targetRef = targetRef;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.scheduledAt = scheduledAt;
        this.status = status;
    }

    public static AdoJobEntity createQueued(
            AdoProjectEntity project,
            AdoContextPacketEntity contextPacket,
            String jobKey,
            String idempotencyKey,
            AdoJobType jobType,
            AdoJobTargetType targetType,
            String targetRef,
            String title,
            String description,
            int priority,
            Instant scheduledAt
    ) {
        return AdoJobEntity.builder()
                .project(project)
                .contextPacket(contextPacket)
                .jobKey(jobKey)
                .idempotencyKey(idempotencyKey)
                .jobType(jobType)
                .targetType(targetType)
                .targetRef(targetRef)
                .title(title)
                .description(description)
                .priority(priority)
                .scheduledAt(scheduledAt)
                .status(AdoJobStatus.QUEUED)
                .build();
    }

    public static AdoJobEntity createPending(
            AdoProjectEntity project,
            String title,
            String description
    ) {
        return createQueued(
                project,
                null,
                "job-" + UUID.randomUUID(),
                UUID.randomUUID().toString(),
                AdoJobType.CODEX_IMPLEMENTATION,
                AdoJobTargetType.PROJECT,
                project.getProjectKey(),
                title,
                description,
                100,
                Instant.now()
        );
    }

    public void transitionTo(AdoJobStatus nextStatus) {
        if (!this.status.canTransitionTo(nextStatus)) {
            throw new BusinessException(ErrorCode.INVALID_JOB_STATUS_TRANSITION);
        }

        this.status = nextStatus;
    }
}
