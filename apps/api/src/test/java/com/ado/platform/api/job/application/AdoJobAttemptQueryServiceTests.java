package com.ado.platform.api.job.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.job.api.dto.AdoJobAttemptDetailResponse;
import com.ado.platform.api.job.persistence.entity.AdoJobAttemptEntity;
import com.ado.platform.api.job.persistence.repository.AdoJobAttemptRepository;
import com.ado.platform.api.job.persistence.repository.AdoJobEventRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static com.ado.platform.api.job.application.AdoJobTestFixtures.JOB_ATTEMPT_ID;
import static com.ado.platform.api.job.application.AdoJobTestFixtures.JOB_KEY;
import static com.ado.platform.api.job.application.AdoJobTestFixtures.attempt;
import static com.ado.platform.api.job.application.AdoJobTestFixtures.job;
import static com.ado.platform.api.job.application.AdoJobTestFixtures.project;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
public class AdoJobAttemptQueryServiceTests {

    @Mock
    private AdoJobAttemptRepository jobAttemptRepository;

    @Mock
    private AdoJobEventRepository jobEventRepository;

    @InjectMocks
    private AdoJobAttemptQueryService queryService;

    @Test
    @DisplayName("Job Attempt 상세는 Job API href와 target href를 분리한다")
    void findsJobAttemptWithSeparatedJobAndTargetLinks() {
        AdoJobAttemptEntity attempt = attempt(job(project(), "Run backend verification"));
        given(jobAttemptRepository.findById(JOB_ATTEMPT_ID)).willReturn(Optional.of(attempt));

        AdoJobAttemptDetailResponse response = queryService.findJobAttempt(JOB_ATTEMPT_ID);

        assertThat(response.job().jobKey()).isEqualTo(JOB_KEY);
        assertThat(response.job().jobApiHref()).isEqualTo("/v1/projects/ado-platform/jobs/" + JOB_KEY);
        assertThat(response.job().target().ref()).isEqualTo("ado-platform");
        assertThat(response.job().target().apiHref()).isEqualTo("/v1/projects/ado-platform");
        assertThat(response.job().target().uiHref()).isEqualTo("/ado-projects/ado-platform");
    }

    @Test
    @DisplayName("Job Attempt ID가 없으면 조회 실패")
    void failsWhenJobAttemptDoesNotExist() {
        given(jobAttemptRepository.findById(JOB_ATTEMPT_ID)).willReturn(Optional.empty());

        Throwable thrown = catchThrowable(() -> queryService.findJobAttempt(JOB_ATTEMPT_ID));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("Job Attempt를 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.JOB_ATTEMPT_NOT_FOUND);
        then(jobAttemptRepository).should().findById(JOB_ATTEMPT_ID);
    }
}
