package com.ado.platform.api.job.api.dto;

import com.ado.platform.api.job.persistence.entity.AdoJobAttemptStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "ADO Job Attempt 요약")
public record AdoJobAttemptSummaryResponse(
        @Schema(description = "Job Attempt ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f903")
        UUID jobAttemptId,

        @Schema(description = "Attempt 번호", example = "1")
        int attemptNumber,

        @Schema(description = "Attempt 상태", example = "queued")
        AdoJobAttemptStatus status,

        @Schema(description = "Worker key", example = "worker-macos-local")
        String workerKey,

        @Schema(description = "마지막 heartbeat 시각", example = "2026-07-06T01:00:10Z")
        Instant lastHeartbeatAt
) {
}
