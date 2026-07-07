package com.ado.platform.api.job.api;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.common.api.error.GlobalExceptionHandler;
import com.ado.platform.api.job.api.dto.AdoJobAttemptDetailResponse;
import com.ado.platform.api.job.api.dto.AdoJobAttemptSummaryResponse;
import com.ado.platform.api.job.api.dto.AdoJobCreateRequest;
import com.ado.platform.api.job.api.dto.AdoJobLogPageResponse;
import com.ado.platform.api.job.api.dto.AdoJobResponse;
import com.ado.platform.api.job.api.dto.AdoJobStatusUpdateRequest;
import com.ado.platform.api.job.application.AdoArtifactQueryService;
import com.ado.platform.api.job.application.AdoJobAttemptQueryService;
import com.ado.platform.api.job.application.AdoJobCommandService;
import com.ado.platform.api.job.application.AdoJobQueryService;
import com.ado.platform.api.job.persistence.entity.AdoJobAttemptStatus;
import com.ado.platform.api.job.persistence.entity.AdoJobStatus;
import com.ado.platform.api.job.persistence.entity.AdoJobTargetType;
import com.ado.platform.api.job.persistence.entity.AdoJobType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdoJobController.class)
@Import(GlobalExceptionHandler.class)
public class AdoJobControllerTests {

    private static final UUID PROJECT_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f900");
    private static final UUID JOB_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f902");
    private static final UUID JOB_ATTEMPT_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f903");
    private static final String JOB_KEY = "job-ado-api-contract-001";
    private static final String IDEMPOTENCY_KEY = "idem-ado-api-contract-001";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdoJobQueryService queryService;

    @MockitoBean
    private AdoJobCommandService commandService;

    @MockitoBean
    private AdoJobAttemptQueryService attemptQueryService;

    @MockitoBean
    private AdoArtifactQueryService artifactQueryService;

    @Test
    @DisplayName("프로젝트 Job 목록 조회")
    void findJobs() throws Exception {
        given(queryService.findJobs("ado-platform")).willReturn(List.of(response(AdoJobStatus.QUEUED)));

        mockMvc.perform(get("/v1/projects/ado-platform/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(JOB_ID.toString()))
                .andExpect(jsonPath("$.data[0].projectKey").value("ado-platform"))
                .andExpect(jsonPath("$.data[0].jobKey").value(JOB_KEY))
                .andExpect(jsonPath("$.data[0].jobType").value("codex_implementation"))
                .andExpect(jsonPath("$.data[0].targetType").value("project"))
                .andExpect(jsonPath("$.data[0].status").value("queued"))
                .andExpect(jsonPath("$.data[0].latestAttempt.jobAttemptId").value(JOB_ATTEMPT_ID.toString()))
                .andExpect(jsonPath("$.errors").isEmpty());
    }

    @Test
    @DisplayName("Job 단건 조회")
    void findJob() throws Exception {
        given(queryService.findJob("ado-platform", JOB_KEY)).willReturn(response(AdoJobStatus.QUEUED));

        mockMvc.perform(get("/v1/projects/ado-platform/jobs/{jobKey}", JOB_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(JOB_ID.toString()))
                .andExpect(jsonPath("$.data.jobKey").value(JOB_KEY))
                .andExpect(jsonPath("$.data.status").value("queued"));
    }

    @Test
    @DisplayName("Job 생성")
    void createJob() throws Exception {
        given(commandService.createJob(any(String.class), any(AdoJobCreateRequest.class)))
                .willReturn(response(AdoJobStatus.QUEUED));

        mockMvc.perform(post("/v1/projects/ado-platform/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "jobKey": "job-ado-api-contract-001",
                                  "idempotencyKey": "idem-ado-api-contract-001",
                                  "jobType": "codex_implementation",
                                  "targetType": "project",
                                  "targetRef": "ado-platform",
                                  "title": "Run backend verification",
                                  "description": "Run API tests",
                                  "priority": 100
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("queued"));

        then(commandService).should().createJob(
                eq("ado-platform"),
                argThat(request -> request != null
                        && request.jobKey().equals(JOB_KEY)
                        && request.jobType() == AdoJobType.CODEX_IMPLEMENTATION)
        );
    }

    @Test
    @DisplayName("Job 생성 실패 - 제목 공백")
    void failsWhenTitleIsBlank() throws Exception {
        mockMvc.perform(post("/v1/projects/ado-platform/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "jobKey": "job-ado-api-contract-001",
                                  "idempotencyKey": "idem-ado-api-contract-001",
                                  "jobType": "codex_implementation",
                                  "targetType": "project",
                                  "targetRef": "ado-platform",
                                  "title": "",
                                  "description": "Run API tests"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.errors[0].field").value("title"));

        verifyNoInteractions(commandService);
    }

    @Test
    @DisplayName("Job 상태 변경")
    void updateJobStatus() throws Exception {
        given(commandService.updateJobStatus(any(String.class), any(String.class), any(AdoJobStatusUpdateRequest.class)))
                .willReturn(response(AdoJobStatus.RUNNING));

        mockMvc.perform(patch("/v1/projects/ado-platform/jobs/{jobKey}/status", JOB_KEY)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "status": "running"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("running"));

        then(commandService).should().updateJobStatus(
                eq("ado-platform"),
                eq(JOB_KEY),
                argThat(request -> request != null && request.status() == AdoJobStatus.RUNNING)
        );
    }

    @Test
    @DisplayName("Job 조회 실패 - Job 없음")
    void failsWhenJobDoesNotExist() throws Exception {
        given(queryService.findJob("ado-platform", JOB_KEY)).willThrow(new BusinessException(ErrorCode.JOB_NOT_FOUND));

        mockMvc.perform(get("/v1/projects/ado-platform/jobs/{jobKey}", JOB_KEY))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("JOB_NOT_FOUND"));
    }

    @Test
    @DisplayName("Job Attempt 단건 조회")
    void findJobAttempt() throws Exception {
        given(attemptQueryService.findJobAttempt(JOB_ATTEMPT_ID)).willReturn(attemptDetail());

        mockMvc.perform(get("/v1/job-attempts/{jobAttemptId}", JOB_ATTEMPT_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.jobAttemptId").value(JOB_ATTEMPT_ID.toString()))
                .andExpect(jsonPath("$.data.state").value("queued"))
                .andExpect(jsonPath("$.data.job.jobKey").value(JOB_KEY));
    }

    @Test
    @DisplayName("Job Attempt 로그 조회")
    void findJobAttemptLogs() throws Exception {
        given(attemptQueryService.findLogs(JOB_ATTEMPT_ID, "system", null))
                .willReturn(new AdoJobLogPageResponse(JOB_ATTEMPT_ID, "system", List.of(), null, 0));

        mockMvc.perform(get("/v1/job-attempts/{jobAttemptId}/logs", JOB_ATTEMPT_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.attemptId").value(JOB_ATTEMPT_ID.toString()))
                .andExpect(jsonPath("$.data.stream").value("system"));
    }

    private AdoJobResponse response(AdoJobStatus status) {
        return new AdoJobResponse(
                JOB_ID,
                PROJECT_ID,
                "ado-platform",
                JOB_KEY,
                IDEMPOTENCY_KEY,
                AdoJobType.CODEX_IMPLEMENTATION,
                AdoJobTargetType.PROJECT,
                "ado-platform",
                null,
                "Run backend verification",
                "Run API tests",
                status,
                100,
                Instant.parse("2026-07-05T01:41:29Z"),
                new AdoJobAttemptSummaryResponse(
                        JOB_ATTEMPT_ID,
                        1,
                        AdoJobAttemptStatus.QUEUED,
                        null,
                        null
                ),
                Instant.parse("2026-07-05T01:41:29Z"),
                Instant.parse("2026-07-05T01:41:29Z")
        );
    }

    private AdoJobAttemptDetailResponse attemptDetail() {
        return new AdoJobAttemptDetailResponse(
                JOB_ATTEMPT_ID,
                1,
                AdoJobAttemptStatus.QUEUED,
                new AdoJobAttemptDetailResponse.JobSummary(
                        JOB_KEY,
                        AdoJobType.CODEX_IMPLEMENTATION.value(),
                        "/v1/projects/ado-platform/jobs/" + JOB_KEY
                ),
                null,
                new AdoJobAttemptDetailResponse.LeaseSummary(null, null, null),
                new AdoJobAttemptDetailResponse.TimingSummary(null, null, null),
                new AdoJobAttemptDetailResponse.TerminalSummary(null, null, null, null),
                null,
                List.of(),
                List.of(),
                List.of()
        );
    }
}
