package com.ado.platform.api.job.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.job.api.dto.AdoJobCreateRequest;
import com.ado.platform.api.job.api.dto.AdoJobResponse;
import com.ado.platform.api.job.api.dto.AdoJobStatusUpdateRequest;
import com.ado.platform.api.job.persistence.entity.AdoJobEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobStatus;
import com.ado.platform.api.job.persistence.entity.AdoJobTargetType;
import com.ado.platform.api.job.persistence.entity.AdoJobType;
import com.ado.platform.api.job.persistence.repository.AdoContextPacketRepository;
import com.ado.platform.api.job.persistence.repository.AdoJobAttemptRepository;
import com.ado.platform.api.job.persistence.repository.AdoJobEventRepository;
import com.ado.platform.api.job.persistence.repository.AdoJobRepository;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static com.ado.platform.api.job.application.AdoJobTestFixtures.IDEMPOTENCY_KEY;
import static com.ado.platform.api.job.application.AdoJobTestFixtures.JOB_KEY;
import static com.ado.platform.api.job.application.AdoJobTestFixtures.attempt;
import static com.ado.platform.api.job.application.AdoJobTestFixtures.job;
import static com.ado.platform.api.job.application.AdoJobTestFixtures.project;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
public class AdoJobCommandServiceTests {

    @Mock
    private AdoProjectRepository projectRepository;

    @Mock
    private AdoJobRepository jobRepository;

    @Mock
    private AdoContextPacketRepository contextPacketRepository;

    @Mock
    private AdoJobAttemptRepository jobAttemptRepository;

    @Mock
    private AdoJobEventRepository jobEventRepository;

    @InjectMocks
    private AdoJobCommandService commandService;

    @Test
    @DisplayName("Job 생성")
    void createsJob() {
        AdoProjectEntity project = project();
        AdoJobEntity job = job(project, "Run backend verification");
        AdoJobCreateRequest request = request();

        given(projectRepository.findByProjectKey("ado-platform")).willReturn(Optional.of(project));
        given(jobRepository.findByProjectProjectKeyAndIdempotencyKey("ado-platform", IDEMPOTENCY_KEY))
                .willReturn(Optional.empty());
        given(jobRepository.save(any(AdoJobEntity.class))).willReturn(job);
        given(jobAttemptRepository.save(any())).willReturn(attempt(job));

        AdoJobResponse response = commandService.createJob("ado-platform", request);

        assertThat(response.projectKey()).isEqualTo("ado-platform");
        assertThat(response.jobKey()).isEqualTo(JOB_KEY);
        assertThat(response.status()).isEqualTo(AdoJobStatus.QUEUED);
        assertThat(response.latestAttempt()).isNotNull();
        then(projectRepository).should().findByProjectKey("ado-platform");
        then(jobAttemptRepository).should().save(any());
        then(jobEventRepository).should().save(any());
    }

    @Test
    @DisplayName("프로젝트 키가 없으면 Job 생성 실패")
    void failsWhenProjectDoesNotExist() {
        AdoJobCreateRequest request = request();
        given(projectRepository.findByProjectKey("missing-project")).willReturn(Optional.empty());

        Throwable thrown = catchThrowable(() -> commandService.createJob("missing-project", request));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("프로젝트를 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.PROJECT_NOT_FOUND);
    }

    @Test
    @DisplayName("Job 상태 변경")
    void updatesJobStatus() {
        AdoJobEntity job = job(project(), "Run backend verification");
        AdoJobStatusUpdateRequest request = new AdoJobStatusUpdateRequest(AdoJobStatus.LEASED);
        given(jobRepository.findByProjectProjectKeyAndJobKey("ado-platform", JOB_KEY)).willReturn(Optional.of(job));
        given(jobRepository.saveAndFlush(job)).willReturn(job);

        AdoJobResponse response = commandService.updateJobStatus("ado-platform", JOB_KEY, request);

        assertThat(response.status()).isEqualTo(AdoJobStatus.LEASED);
        then(jobRepository).should().findByProjectProjectKeyAndJobKey("ado-platform", JOB_KEY);
    }

    @Test
    @DisplayName("허용되지 않은 Job 상태 변경은 실패")
    void failsWhenTransitionIsInvalid() {
        AdoJobEntity job = job(project(), "Run backend verification");
        job.transitionTo(AdoJobStatus.LEASED);
        job.transitionTo(AdoJobStatus.RUNNING);
        job.transitionTo(AdoJobStatus.SUCCEEDED);
        AdoJobStatusUpdateRequest request = new AdoJobStatusUpdateRequest(AdoJobStatus.RUNNING);
        given(jobRepository.findByProjectProjectKeyAndJobKey("ado-platform", JOB_KEY)).willReturn(Optional.of(job));

        Throwable thrown = catchThrowable(() -> commandService.updateJobStatus("ado-platform", JOB_KEY, request));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("Job 상태를 변경할 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.INVALID_JOB_STATUS_TRANSITION);
    }

    private AdoJobCreateRequest request() {
        return new AdoJobCreateRequest(
                JOB_KEY,
                IDEMPOTENCY_KEY,
                AdoJobType.CODEX_IMPLEMENTATION,
                AdoJobTargetType.PROJECT,
                "ado-platform",
                null,
                "Run backend verification",
                "Run API tests",
                100,
                null
        );
    }
}
