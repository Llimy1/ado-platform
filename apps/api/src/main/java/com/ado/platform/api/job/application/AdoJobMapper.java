package com.ado.platform.api.job.application;

import com.ado.platform.api.job.api.dto.AdoArtifactResponse;
import com.ado.platform.api.job.api.dto.AdoJobAttemptDetailResponse;
import com.ado.platform.api.job.api.dto.AdoJobAttemptSummaryResponse;
import com.ado.platform.api.job.api.dto.AdoJobEventResponse;
import com.ado.platform.api.job.api.dto.AdoJobResponse;
import com.ado.platform.api.job.persistence.entity.AdoArtifactEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobAttemptEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobEventEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobTargetType;

import java.util.List;

final class AdoJobMapper {

    private AdoJobMapper() {
    }

    static AdoJobResponse toResponse(AdoJobEntity job) {
        return toResponse(job, null);
    }

    static AdoJobResponse toResponse(AdoJobEntity job, AdoJobAttemptEntity latestAttempt) {
        return new AdoJobResponse(
                job.getId(),
                job.getProject().getId(),
                job.getProject().getProjectKey(),
                job.getJobKey(),
                job.getIdempotencyKey(),
                job.getJobType(),
                job.getTargetType(),
                job.getTargetRef(),
                job.getContextPacket() == null ? null : job.getContextPacket().getArtifact().getArtifactKey(),
                job.getTitle(),
                job.getDescription(),
                job.getStatus(),
                job.getPriority(),
                job.getScheduledAt(),
                latestAttempt == null ? null : toSummaryResponse(latestAttempt),
                job.getCreatedAt(),
                job.getUpdatedAt()
        );
    }

    static AdoJobAttemptSummaryResponse toSummaryResponse(AdoJobAttemptEntity attempt) {
        return new AdoJobAttemptSummaryResponse(
                attempt.getId(),
                attempt.getAttemptNumber(),
                attempt.getStatus(),
                attempt.getWorkerKey(),
                attempt.getLastHeartbeatAt()
        );
    }

    static AdoJobAttemptDetailResponse toDetailResponse(AdoJobAttemptEntity attempt) {
        AdoJobEntity job = attempt.getJob();
        String projectKey = job.getProject().getProjectKey();
        String jobApiHref = "/v1/projects/%s/jobs/%s".formatted(
                projectKey,
                job.getJobKey()
        );
        AdoJobAttemptDetailResponse.TargetSummary target = toTargetSummary(
                projectKey,
                job.getTargetType(),
                job.getTargetRef()
        );

        return new AdoJobAttemptDetailResponse(
                attempt.getId(),
                attempt.getAttemptNumber(),
                attempt.getStatus(),
                new AdoJobAttemptDetailResponse.JobSummary(
                        job.getJobKey(),
                        job.getJobType().value(),
                        jobApiHref,
                        target
                ),
                attempt.getWorkerKey() == null
                        ? null
                        : new AdoJobAttemptDetailResponse.WorkerSummary(
                                attempt.getWorkerKey(),
                                "/v1/workers/" + attempt.getWorkerKey()
                        ),
                new AdoJobAttemptDetailResponse.LeaseSummary(
                        null,
                        attempt.getLeaseExpiresAt(),
                        attempt.getLastHeartbeatAt()
                ),
                new AdoJobAttemptDetailResponse.TimingSummary(
                        attempt.getStartedAt(),
                        attempt.getFinishedAt(),
                        attempt.getTimeoutAt()
                ),
                new AdoJobAttemptDetailResponse.TerminalSummary(
                        attempt.getExitCode(),
                        attempt.getSignal(),
                        attempt.getFailureCode(),
                        attempt.getRedactedSummary()
                ),
                attempt.getResultArtifact() == null
                        ? null
                        : "/v1/projects/%s/artifacts/%s".formatted(
                                projectKey,
                                attempt.getResultArtifact().getArtifactKey()
                        ),
                List.of(),
                List.of(),
                List.of()
        );
    }

    private static AdoJobAttemptDetailResponse.TargetSummary toTargetSummary(
            String projectKey,
            AdoJobTargetType targetType,
            String targetRef
    ) {
        String apiHref = switch (targetType) {
            case PROJECT -> "/v1/projects/" + targetRef;
            case ROADMAP -> "/v1/projects/%s/roadmaps/%s".formatted(projectKey, targetRef);
            case ARTIFACT -> "/v1/projects/%s/artifacts/%s".formatted(projectKey, targetRef);
            case FEATURE_UNIT, COMPONENT_WORK, REVIEW_GROUP, VERIFICATION_RUN -> null;
        };
        String uiHref = switch (targetType) {
            case PROJECT -> "/ado-projects/" + targetRef;
            case ROADMAP -> "/projects/%s/roadmaps/%s".formatted(projectKey, targetRef);
            case ARTIFACT -> "/projects/%s/artifacts/%s".formatted(projectKey, targetRef);
            case FEATURE_UNIT, COMPONENT_WORK, REVIEW_GROUP, VERIFICATION_RUN -> null;
        };

        return new AdoJobAttemptDetailResponse.TargetSummary(
                targetType,
                targetRef,
                apiHref,
                uiHref,
                targetRef
        );
    }

    static AdoJobEventResponse toEventResponse(AdoJobEventEntity event) {
        return new AdoJobEventResponse(
                event.getSequence(),
                event.getOccurredAt(),
                event.getLevel(),
                event.getEventType(),
                event.getMessage()
        );
    }

    static AdoArtifactResponse toArtifactResponse(AdoArtifactEntity artifact) {
        return new AdoArtifactResponse(
                artifact.getId(),
                artifact.getArtifactKey(),
                artifact.getArtifactType(),
                artifact.getStatus(),
                artifact.getClassification(),
                artifact.getContentSha256(),
                artifact.getByteSize(),
                artifact.getStorageUri(),
                artifact.getCreatedAt()
        );
    }
}
