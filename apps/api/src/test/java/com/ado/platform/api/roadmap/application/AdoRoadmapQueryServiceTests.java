package com.ado.platform.api.roadmap.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
public class AdoRoadmapQueryServiceTests {

    @Mock
    private AdoProjectRepository projectRepository;

    @Mock
    private AdoRoadmapRepository roadmapRepository;

    @InjectMocks
    private AdoRoadmapQueryService queryService;

    @Test
    @DisplayName("프로젝트 ID로 로드맵 목록 조회")
    void findsRoadmapsByProjectId() {
        AdoProjectEntity project = project(1L);
        AdoRoadmapEntity firstRoadmap = roadmap(10L, project, "First Roadmap");
        AdoRoadmapEntity secondRoadmap = roadmap(11L, project, "Second Roadmap");

        given(projectRepository.existsById(1L)).willReturn(true);
        given(roadmapRepository.findByProjectIdOrderByIdAsc(1L))
                .willReturn(List.of(firstRoadmap, secondRoadmap));

        List<AdoRoadmapResponse> responses = queryService.findRoadmaps(1L);

        assertThat(responses)
                .extracting(AdoRoadmapResponse::title)
                .containsExactly("First Roadmap", "Second Roadmap");
        assertThat(responses)
                .extracting(AdoRoadmapResponse::status)
                .containsExactly(AdoRoadmapStatus.DRAFT, AdoRoadmapStatus.DRAFT);

        then(projectRepository).should().existsById(1L);
        then(roadmapRepository).should().findByProjectIdOrderByIdAsc(1L);
    }

    @Test
    @DisplayName("프로젝트가 없으면 로드맵 목록 조회 실패")
    void failsWhenProjectDoesNotExist() {
        given(projectRepository.existsById(999L)).willReturn(false);

        Throwable thrown = catchThrowable(() -> queryService.findRoadmaps(999L));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("프로젝트를 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.PROJECT_NOT_FOUND);

        then(projectRepository).should().existsById(999L);
        then(roadmapRepository).should(never()).findByProjectIdOrderByIdAsc(999L);
    }

    @Test
    @DisplayName("로드맵 ID로 단건 조회")
    void findsRoadmapById() {
        AdoProjectEntity project = project(1L);
        AdoRoadmapEntity roadmap = roadmap(10L, project, "Roadmap Foundation");

        given(roadmapRepository.findById(10L)).willReturn(Optional.of(roadmap));

        AdoRoadmapResponse response = queryService.findRoadmap(10L);

        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.projectId()).isEqualTo(1L);
        assertThat(response.title()).isEqualTo("Roadmap Foundation");
        assertThat(response.status()).isEqualTo(AdoRoadmapStatus.DRAFT);

        then(roadmapRepository).should().findById(10L);
    }

    @Test
    @DisplayName("로드맵 ID가 없으면 실패")
    void failsWhenRoadmapDoesNotExist() {
        given(roadmapRepository.findById(999L)).willReturn(Optional.empty());

        Throwable thrown = catchThrowable(() -> queryService.findRoadmap(999L));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("로드맵을 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.ROADMAP_NOT_FOUND);

        then(roadmapRepository).should().findById(999L);
    }

    private AdoProjectEntity project(Long id) {
        AdoProjectEntity project = AdoProjectEntity.create("ado-platform", "ADO Platform");
        ReflectionTestUtils.setField(project, "id", id);
        return project;
    }

    private AdoRoadmapEntity roadmap(Long id, AdoProjectEntity project, String title) {
        AdoRoadmapEntity roadmap = AdoRoadmapEntity.createDraft(project, title, title + " description");
        ReflectionTestUtils.setField(roadmap, "id", id);
        ReflectionTestUtils.setField(roadmap, "createdAt", Instant.parse("2026-07-05T00:34:40Z"));
        ReflectionTestUtils.setField(roadmap, "updatedAt", Instant.parse("2026-07-05T00:34:40Z"));
        return roadmap;
    }
}
