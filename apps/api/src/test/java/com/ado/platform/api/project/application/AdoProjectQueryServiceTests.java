package com.ado.platform.api.project.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.project.api.dto.AdoProjectResponse;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
public class AdoProjectQueryServiceTests {

    private static final UUID PROJECT_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f900");

    @Mock
    private AdoProjectRepository repository;

    @InjectMocks
    private AdoProjectQueryService queryService;

    @Test
    @DisplayName("프로젝트 키로 단건 조회")
    void findsProjectByKey() {
        AdoProjectEntity project = AdoProjectEntity.create("ado-platform", "ADO Platform");
        ReflectionTestUtils.setField(project, "id", PROJECT_ID);
        ReflectionTestUtils.setField(project, "createdAt", Instant.parse("2026-07-03T13:00:00Z"));
        ReflectionTestUtils.setField(project, "updatedAt", Instant.parse("2026-07-03T13:00:00Z"));

        given(repository.findByProjectKey("ado-platform")).willReturn(Optional.of(project));

        AdoProjectResponse response = queryService.findProject("ado-platform");

        assertThat(response.id()).isEqualTo(PROJECT_ID);
        assertThat(response.projectKey()).isEqualTo("ado-platform");
        assertThat(response.name()).isEqualTo("ADO Platform");
        assertThat(response.createdAt()).isEqualTo(Instant.parse("2026-07-03T13:00:00Z"));
        assertThat(response.updatedAt()).isEqualTo(Instant.parse("2026-07-03T13:00:00Z"));
        then(repository).should().findByProjectKey("ado-platform");
    }

    @Test
    @DisplayName("프로젝트 키가 없으면 실패")
    void failsWhenProjectDoesNotExist() {
        given(repository.findByProjectKey("missing-project")).willReturn(Optional.empty());

        Throwable thrown = catchThrowable(() -> queryService.findProject("missing-project"));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("프로젝트를 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.PROJECT_NOT_FOUND);

        then(repository).should().findByProjectKey("missing-project");
    }
}
