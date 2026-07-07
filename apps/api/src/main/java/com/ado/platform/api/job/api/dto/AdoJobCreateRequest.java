package com.ado.platform.api.job.api.dto;

import com.ado.platform.api.job.persistence.entity.AdoJobTargetType;
import com.ado.platform.api.job.persistence.entity.AdoJobType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record AdoJobCreateRequest(
        @Schema(description = "Project 안에서 유일한 Job 키", example = "job-ado-api-contract-001")
        @NotBlank(message = "Job 키는 필수입니다.")
        String jobKey,

        @Schema(description = "동일 요청 재생 방지용 idempotency key", example = "idem-ado-api-contract-001")
        @NotBlank(message = "idempotency key는 필수입니다.")
        String idempotencyKey,

        @Schema(description = "Job 유형", example = "codex_implementation")
        @NotNull(message = "Job 유형은 필수입니다.")
        AdoJobType jobType,

        @Schema(description = "Job 대상 유형", example = "project")
        @NotNull(message = "Job 대상 유형은 필수입니다.")
        AdoJobTargetType targetType,

        @Schema(description = "Job 대상 참조", example = "ado-platform")
        @NotBlank(message = "Job 대상 참조는 필수입니다.")
        String targetRef,

        @Schema(description = "실행 ContextPacket artifact key", example = "ctx-ado-api-contract-001")
        String contextArtifactKey,

        @Schema(description = "Job 제목", example = "Run backend verification")
        @NotBlank(message = "Job 제목은 필수입니다.")
        String title,

        @Schema(description = "Job 설명", example = "Run API tests and collect verification result")
        String description,

        @Schema(description = "우선순위. 0이 가장 높습니다.", example = "100")
        @Min(value = 0, message = "Job 우선순위는 0 이상이어야 합니다.")
        Integer priority,

        @Schema(description = "예약 실행 시각", example = "2026-07-06T01:00:00Z")
        Instant scheduledAt
) {
}
