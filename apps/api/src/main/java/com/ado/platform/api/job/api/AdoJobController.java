package com.ado.platform.api.job.api;

import com.ado.platform.api.common.api.docs.CreatedResponse;
import com.ado.platform.api.common.api.docs.OkResponse;
import com.ado.platform.api.common.api.docs.ValidationErrorResponse;
import com.ado.platform.api.common.api.response.ApiResponse;
import com.ado.platform.api.job.api.docs.InvalidJobStatusTransitionResponse;
import com.ado.platform.api.job.api.docs.JobNotFoundResponse;
import com.ado.platform.api.job.api.dto.AdoArtifactResponse;
import com.ado.platform.api.job.api.dto.AdoJobAttemptDetailResponse;
import com.ado.platform.api.job.api.dto.AdoJobCreateRequest;
import com.ado.platform.api.job.api.dto.AdoJobLogPageResponse;
import com.ado.platform.api.job.api.dto.AdoJobResponse;
import com.ado.platform.api.job.api.dto.AdoJobStatusUpdateRequest;
import com.ado.platform.api.job.application.AdoArtifactQueryService;
import com.ado.platform.api.job.application.AdoJobAttemptQueryService;
import com.ado.platform.api.job.application.AdoJobCommandService;
import com.ado.platform.api.job.application.AdoJobQueryService;
import com.ado.platform.api.project.api.docs.ProjectNotFoundResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/v1", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Jobs", description = "ADO Job API")
public class AdoJobController {

    private final AdoJobQueryService queryService;
    private final AdoJobCommandService commandService;
    private final AdoJobAttemptQueryService attemptQueryService;
    private final AdoArtifactQueryService artifactQueryService;

    @Operation(
            summary = "프로젝트 Job 목록 조회",
            description = "프로젝트 키로 ADO Job 목록을 조회합니다."
    )
    @OkResponse
    @ProjectNotFoundResponse
    @GetMapping("/projects/{projectKey}/jobs")
    public ApiResponse<List<AdoJobResponse>> findJobs(
            @Parameter(description = "프로젝트 키", example = "ado-platform", required = true)
            @PathVariable String projectKey
    ) {
        return ApiResponse.success(queryService.findJobs(projectKey));
    }

    @Operation(
            summary = "Job 단건 조회",
            description = "프로젝트 키와 Job 키로 ADO Job을 조회합니다."
    )
    @OkResponse
    @JobNotFoundResponse
    @GetMapping("/projects/{projectKey}/jobs/{jobKey}")
    public ApiResponse<AdoJobResponse> findJob(
            @Parameter(description = "프로젝트 키", example = "ado-platform", required = true)
            @PathVariable String projectKey,
            @Parameter(description = "Job 키", example = "job-ado-api-contract-001", required = true)
            @PathVariable String jobKey
    ) {
        return ApiResponse.success(queryService.findJob(projectKey, jobKey));
    }

    @Operation(
            summary = "Job 생성",
            description = "프로젝트에 queued 상태의 ADO Job을 생성합니다."
    )
    @CreatedResponse
    @ValidationErrorResponse
    @ProjectNotFoundResponse
    @PostMapping(value = "/projects/{projectKey}/jobs", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdoJobResponse> createJob(
            @Parameter(description = "프로젝트 키", example = "ado-platform", required = true)
            @PathVariable String projectKey,
            @Valid @RequestBody AdoJobCreateRequest request
    ) {
        return ApiResponse.success(commandService.createJob(projectKey, request));
    }

    @Operation(
            summary = "Job 상태 변경",
            description = "허용된 상태 전이 규칙에 따라 ADO Job 상태를 변경합니다."
    )
    @OkResponse
    @ValidationErrorResponse
    @JobNotFoundResponse
    @InvalidJobStatusTransitionResponse
    @PatchMapping(value = "/projects/{projectKey}/jobs/{jobKey}/status", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<AdoJobResponse> updateJobStatus(
            @Parameter(description = "프로젝트 키", example = "ado-platform", required = true)
            @PathVariable String projectKey,
            @Parameter(description = "Job 키", example = "job-ado-api-contract-001", required = true)
            @PathVariable String jobKey,
            @Valid @RequestBody AdoJobStatusUpdateRequest request
    ) {
        return ApiResponse.success(commandService.updateJobStatus(projectKey, jobKey, request));
    }

    @Operation(
            summary = "Job Attempt 상세 조회",
            description = "Worker가 실행한 단일 Job Attempt를 조회합니다."
    )
    @OkResponse
    @GetMapping("/job-attempts/{jobAttemptId}")
    public ApiResponse<AdoJobAttemptDetailResponse> findJobAttempt(
            @Parameter(description = "Job Attempt ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f903", required = true)
            @PathVariable UUID jobAttemptId
    ) {
        return ApiResponse.success(attemptQueryService.findJobAttempt(jobAttemptId));
    }

    @Operation(
            summary = "Job Attempt 로그 조회",
            description = "Job Attempt의 system/stdout/stderr 로그 페이지를 조회합니다."
    )
    @OkResponse
    @GetMapping("/job-attempts/{jobAttemptId}/logs")
    public ApiResponse<AdoJobLogPageResponse> findJobAttemptLogs(
            @Parameter(description = "Job Attempt ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f903", required = true)
            @PathVariable UUID jobAttemptId,
            @Parameter(description = "로그 스트림", example = "system")
            @RequestParam(defaultValue = "system") String stream,
            @Parameter(description = "이전 응답의 nextCursor")
            @RequestParam(required = false) String cursor
    ) {
        return ApiResponse.success(attemptQueryService.findLogs(jobAttemptId, stream, cursor));
    }

    @Operation(
            summary = "Artifact 단건 조회",
            description = "프로젝트 키와 Artifact 키로 Artifact 메타데이터를 조회합니다."
    )
    @OkResponse
    @GetMapping("/projects/{projectKey}/artifacts/{artifactKey}")
    public ApiResponse<AdoArtifactResponse> findArtifact(
            @Parameter(description = "프로젝트 키", example = "ado-platform", required = true)
            @PathVariable String projectKey,
            @Parameter(description = "Artifact 키", example = "ctx-ado-api-contract-001", required = true)
            @PathVariable String artifactKey
    ) {
        return ApiResponse.success(artifactQueryService.findArtifact(projectKey, artifactKey));
    }
}
