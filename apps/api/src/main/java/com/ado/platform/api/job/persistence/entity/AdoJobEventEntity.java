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
@Table(name = "ado_job_event")
public class AdoJobEventEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private AdoJobEntity job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_attempt_id")
    private AdoJobAttemptEntity jobAttempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artifact_id")
    private AdoArtifactEntity artifact;

    @Column(nullable = false)
    private long sequence;

    @Column(name = "event_type", nullable = false, length = 80)
    private String eventType;

    @Column(nullable = false, length = 20)
    private AdoJobEventLevel level;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Builder(access = AccessLevel.PRIVATE)
    private AdoJobEventEntity(
            AdoJobEntity job,
            AdoJobAttemptEntity jobAttempt,
            AdoArtifactEntity artifact,
            long sequence,
            String eventType,
            AdoJobEventLevel level,
            String message,
            Instant occurredAt
    ) {
        this.job = job;
        this.jobAttempt = jobAttempt;
        this.artifact = artifact;
        this.sequence = sequence;
        this.eventType = eventType;
        this.level = level;
        this.message = message;
        this.occurredAt = occurredAt;
    }

    public static AdoJobEventEntity create(
            AdoJobEntity job,
            AdoJobAttemptEntity jobAttempt,
            long sequence,
            String eventType,
            AdoJobEventLevel level,
            String message,
            Instant occurredAt
    ) {
        return AdoJobEventEntity.builder()
                .job(job)
                .jobAttempt(jobAttempt)
                .sequence(sequence)
                .eventType(eventType)
                .level(level)
                .message(message)
                .occurredAt(occurredAt)
                .build();
    }
}
