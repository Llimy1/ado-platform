package com.ado.platform.api.job.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.job.api.dto.AdoJobResponse;
import com.ado.platform.api.job.persistence.entity.AdoJobEntity;
import com.ado.platform.api.job.persistence.repository.AdoJobAttemptRepository;
import com.ado.platform.api.job.persistence.repository.AdoJobRepository;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static com.ado.platform.api.job.application.AdoJobTestFixtures.JOB_KEY;
import static com.ado.platform.api.job.application.AdoJobTestFixtures.job;
import static com.ado.platform.api.job.application.AdoJobTestFixtures.project;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
public class AdoJobQueryServiceTests {

    @Mock
    private AdoProjectRepository projectRepository;

    @Mock
    private AdoJobRepository jobRepository;

    @Mock
    private AdoJobAttemptRepository jobAttemptRepository;

    @InjectMocks
    private AdoJobQueryService queryService;

    @Test
    @DisplayName("프로젝트 키로 Job 목록 조회")
    void findsJobsByProjectKey() {
        AdoJobEntity firstJob = job(project(), "First Job");
        AdoJobEntity secondJob = job(project(), "Second Job");

        given(projectRepository.existsByProjectKey("ado-platform")).willReturn(true);
        given(jobRepository.findByProjectProjectKeyOrderByPriorityAscScheduledAtAscCreatedAtAscIdAsc("ado-platform"))
                .willReturn(List.of(firstJob, secondJob));

        List<AdoJobResponse> responses = queryService.findJobs("ado-platform");

        assertThat(responses).extracting(AdoJobResponse::title).containsExactly("First Job", "Second Job");
        then(projectRepository).should().existsByProjectKey("ado-platform");
        then(jobRepository).should().findByProjectProjectKeyOrderByPriorityAscScheduledAtAscCreatedAtAscIdAsc("ado-platform");
    }

    @Test
    @DisplayName("프로젝트 키가 없으면 Job 목록 조회 실패")
    void failsWhenProjectDoesNotExistForList() {
        given(projectRepository.existsByProjectKey("missing-project")).willReturn(false);

        Throwable thrown = catchThrowable(() -> queryService.findJobs("missing-project"));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("프로젝트를 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.PROJECT_NOT_FOUND);
        then(jobRepository).should(never()).findByProjectProjectKeyOrderByPriorityAscScheduledAtAscCreatedAtAscIdAsc("missing-project");
    }

    @Test
    @DisplayName("Job 키로 단건 조회")
    void findsJobByKey() {
        AdoJobEntity job = job(project(), "Run backend verification");
        given(jobRepository.findByProjectProjectKeyAndJobKey("ado-platform", JOB_KEY)).willReturn(Optional.of(job));

        AdoJobResponse response = queryService.findJob("ado-platform", JOB_KEY);

        assertThat(response.jobKey()).isEqualTo(JOB_KEY);
        assertThat(response.projectKey()).isEqualTo("ado-platform");
        assertThat(response.status().value()).isEqualTo("queued");
    }

    @Test
    @DisplayName("Job 키가 없으면 단건 조회 실패")
    void failsWhenJobDoesNotExist() {
        given(jobRepository.findByProjectProjectKeyAndJobKey("ado-platform", JOB_KEY)).willReturn(Optional.empty());

        Throwable thrown = catchThrowable(() -> queryService.findJob("ado-platform", JOB_KEY));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("Job을 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.JOB_NOT_FOUND);
    }
}
