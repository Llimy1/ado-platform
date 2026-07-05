package com.ado.platform.api.roadmap.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapCreateRequest;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapResponse;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapEntity;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapStatus;
import com.ado.platform.api.roadmap.persistence.repository.AdoRoadmapRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
public class AdoRoadmapCommandServiceTests {

    @Mock
    private AdoProjectRepository projectRepository;

    @Mock
    private AdoRoadmapRepository roadmapRepository;

    @InjectMocks
    private AdoRoadmapCommandService commandService;

    @Test
    @DisplayName("프로젝트에 로드맵을 생성")
    void createsRoadmap() {
        AdoRoadmapCreateRequest request = new AdoRoadmapCreateRequest(
                "Roadmap Foundation",
                "Roadmap persistence and API foundation"
        );
        AdoProjectEntity project = AdoProjectEntity.create("ado-platform", "ADO Platform");
        ReflectionTestUtils.setField(project, "id", 1L);
        AdoRoadmapEntity roadmap = AdoRoadmapEntity.createDraft(
                project,
                "Roadmap Foundation",
                "Roadmap persistence and API foundation"
        );
        ReflectionTestUtils.setField(roadmap, "id", 10L);
        ReflectionTestUtils.setField(roadmap, "createdAt", Instant.parse("2026-07-05T00:34:40Z"));
        ReflectionTestUtils.setField(roadmap, "updatedAt", Instant.parse("2026-07-05T00:34:40Z"));

        given(projectRepository.findById(1L)).willReturn(Optional.of(project));
        given(roadmapRepository.save(any(AdoRoadmapEntity.class))).willReturn(roadmap);

        AdoRoadmapResponse response = commandService.createRoadmap(1L, request);

        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.projectId()).isEqualTo(1L);
        assertThat(response.title()).isEqualTo("Roadmap Foundation");
        assertThat(response.description()).isEqualTo("Roadmap persistence and API foundation");
        assertThat(response.status()).isEqualTo(AdoRoadmapStatus.DRAFT);
        assertThat(response.createdAt()).isEqualTo(Instant.parse("2026-07-05T00:34:40Z"));
        assertThat(response.updatedAt()).isEqualTo(Instant.parse("2026-07-05T00:34:40Z"));

        then(projectRepository).should().findById(1L);
        then(roadmapRepository).should().save(any(AdoRoadmapEntity.class));
    }

    @Test
    @DisplayName("프로젝트가 없으면 로드맵을 저장하지 않고 실패")
    void failsWhenProjectDoesNotExist() {
        AdoRoadmapCreateRequest request = new AdoRoadmapCreateRequest(
                "Roadmap Foundation",
                "Roadmap persistence and API foundation"
        );

        given(projectRepository.findById(999L)).willReturn(Optional.empty());

        Throwable thrown = catchThrowable(() -> commandService.createRoadmap(999L, request));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("프로젝트를 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.PROJECT_NOT_FOUND);

        then(projectRepository).should().findById(999L);
        then(roadmapRepository).should(never()).save(any());
    }
}
