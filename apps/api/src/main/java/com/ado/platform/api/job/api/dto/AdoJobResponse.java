package com.ado.platform.api.job.api.dto;

import com.ado.platform.api.job.persistence.entity.AdoJobStatus;
import com.ado.platform.api.job.persistence.entity.AdoJobTargetType;
import com.ado.platform.api.job.persistence.entity.AdoJobType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "ADO Job 응답")
public record AdoJobResponse(
        @Schema(description = "Job ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f902")
        UUID id,

        @Schema(description = "프로젝트 ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f900")
        UUID projectId,

        @Schema(description = "프로젝트 키", example = "ado-platform")
        String projectKey,

        @Schema(description = "Project 안에서 유일한 Job 키", example = "job-ado-api-contract-001")
        String jobKey,

        @Schema(description = "동일 요청 재생 방지용 idempotency key", example = "idem-ado-api-contract-001")
        String idempotencyKey,

        @Schema(description = "Job 유형", example = "codex_implementation")
        AdoJobType jobType,

        @Schema(description = "Job 대상 유형", example = "project")
        AdoJobTargetType targetType,

        @Schema(description = "Job 대상 참조", example = "ado-platform")
        String targetRef,

        @Schema(description = "ContextPacket artifact key", example = "ctx-ado-api-contract-001")
        String contextArtifactKey,

        @Schema(description = "Job 제목", example = "Run backend verification")
        String title,

        @Schema(description = "Job 설명", example = "Run API tests and collect verification result")
        String description,

        @Schema(description = "Job 상태", example = "queued")
        AdoJobStatus status,

        @Schema(description = "우선순위. 0이 가장 높습니다.", example = "100")
        int priority,

        @Schema(description = "예약 실행 시각", example = "2026-07-06T01:00:00Z")
        Instant scheduledAt,

        @Schema(description = "최근 Attempt 요약")
        AdoJobAttemptSummaryResponse latestAttempt,

        @Schema(description = "생성 일시", example = "2026-07-05T01:41:29Z")
        Instant createdAt,

        @Schema(description = "수정 일시", example = "2026-07-05T01:41:29Z")
        Instant updatedAt
) {
}
