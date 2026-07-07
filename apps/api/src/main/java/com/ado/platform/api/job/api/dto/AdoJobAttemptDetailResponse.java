package com.ado.platform.api.job.api.dto;

import com.ado.platform.api.job.persistence.entity.AdoJobAttemptStatus;
import com.ado.platform.api.job.persistence.entity.AdoJobTargetType;
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
            @Schema(description = "Project 안에서 유일한 Job 키", example = "job-ado-api-contract-001")
            String jobKey,

            @Schema(description = "Job 유형", example = "codex_implementation")
            String type,

            @Schema(description = "Job API href", example = "/v1/projects/ado-platform/jobs/job-ado-api-contract-001")
            String jobApiHref,

            @Schema(description = "Job 실행 대상")
            TargetSummary target
    ) {
    }

    public record TargetSummary(
            @Schema(description = "Job 대상 유형", example = "project")
            AdoJobTargetType type,

            @Schema(description = "Job 대상 참조", example = "ado-platform")
            String ref,

            @Schema(description = "대상 API href. 아직 API가 없는 대상은 null입니다.", example = "/v1/projects/ado-platform")
            String apiHref,

            @Schema(description = "대상 Control Room UI href. 아직 안정된 UI route가 없는 대상은 null입니다.", example = "/ado-projects/ado-platform")
            String uiHref,

            @Schema(description = "사람이 읽는 대상 표시 이름", example = "ado-platform")
            String label
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
