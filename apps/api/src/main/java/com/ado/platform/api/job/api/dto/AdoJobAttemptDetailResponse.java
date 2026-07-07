package com.ado.platform.api.job.api.dto;

import com.ado.platform.api.job.persistence.entity.AdoJobAttemptStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(description = "ADO Job Attempt 상세")
public record AdoJobAttemptDetailResponse(
        @Schema(description = "Job Attempt ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f903")
        UUID jobAttemptId,

        @Schema(description = "Attempt 번호", example = "1")
        int attemptNumber,

        @Schema(description = "Attempt 상태", example = "queued")
        AdoJobAttemptStatus state,

        @Schema(description = "Job 요약")
        JobSummary job,

        @Schema(description = "Worker 요약")
        WorkerSummary worker,

        @Schema(description = "Lease 정보")
        LeaseSummary lease,

        @Schema(description = "실행 시간 정보")
        TimingSummary timing,

        @Schema(description = "터미널 결과")
        TerminalSummary terminal,

        @Schema(description = "결과 Artifact href")
        String resultArtifactHref,

        @Schema(description = "AgentRun 목록. Runner 구현 전에는 빈 배열입니다.")
        List<Object> agentRuns,

        @Schema(description = "CommandRun 목록. Runner 구현 전에는 빈 배열입니다.")
        List<Object> commandRuns,

        @Schema(description = "Artifact 목록. Runner 구현 전에는 빈 배열입니다.")
        List<Object> artifacts
) {

    public record JobSummary(
            String jobKey,
            String type,
            String targetHref
    ) {
    }

    public record WorkerSummary(
            String workerKey,
            String href
    ) {
    }

    public record LeaseSummary(
            Instant leasedAt,
            Instant expiresAt,
            Instant lastHeartbeatAt
    ) {
    }

    public record TimingSummary(
            Instant startedAt,
            Instant finishedAt,
            Instant timeoutAt
    ) {
    }

    public record TerminalSummary(
            Integer exitCode,
            String signal,
            String failureCode,
            String redactedSummary
    ) {
    }
}
