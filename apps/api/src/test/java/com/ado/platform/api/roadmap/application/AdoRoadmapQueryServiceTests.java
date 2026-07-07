package com.ado.platform.api.roadmap.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapResponse;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapEntity;
import com.ado.platform.api.roadmap.persistence.repository.AdoRoadmapRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static com.ado.platform.api.roadmap.application.AdoRoadmapTestFixtures.project;
import static com.ado.platform.api.roadmap.application.AdoRoadmapTestFixtures.roadmap;
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
    @DisplayName("프로젝트 키로 로드맵 목록 조회")
    void findsRoadmapsByProjectKey() {
        AdoRoadmapEntity firstRoadmap = roadmap(project(), "first-roadmap", "First Roadmap");
        AdoRoadmapEntity secondRoadmap = roadmap(project(), "second-roadmap", "Second Roadmap");

        given(projectRepository.existsByProjectKey("ado-platform")).willReturn(true);
        given(roadmapRepository.findByProjectProjectKeyOrderByRoadmapKeyAsc("ado-platform"))
                .willReturn(List.of(firstRoadmap, secondRoadmap));

        List<AdoRoadmapResponse> responses = queryService.findRoadmaps("ado-platform");

        assertThat(responses)
                .extracting(AdoRoadmapResponse::roadmapKey)
                .containsExactly("first-roadmap", "second-roadmap");
        then(projectRepository).should().existsByProjectKey("ado-platform");
        then(roadmapRepository).should().findByProjectProjectKeyOrderByRoadmapKeyAsc("ado-platform");
    }

    @Test
    @DisplayName("프로젝트 키가 없으면 로드맵 목록 조회 실패")
    void failsWhenProjectDoesNotExistForList() {
        given(projectRepository.existsByProjectKey("missing-project")).willReturn(false);

        Throwable thrown = catchThrowable(() -> queryService.findRoadmaps("missing-project"));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("프로젝트를 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.PROJECT_NOT_FOUND);
        then(roadmapRepository).should(never()).findByProjectProjectKeyOrderByRoadmapKeyAsc("missing-project");
    }

    @Test
    @DisplayName("프로젝트 키와 로드맵 키로 단건 조회")
    void findsRoadmapByProjectKeyAndRoadmapKey() {
        AdoRoadmapEntity roadmap = roadmap(project(), "roadmap-foundation", "Roadmap Foundation");
        given(roadmapRepository.findByProjectProjectKeyAndRoadmapKey("ado-platform", "roadmap-foundation"))
                .willReturn(Optional.of(roadmap));

        AdoRoadmapResponse response = queryService.findRoadmap("ado-platform", "roadmap-foundation");

        assertThat(response.projectKey()).isEqualTo("ado-platform");
        assertThat(response.roadmapKey()).isEqualTo("roadmap-foundation");
        assertThat(response.title()).isEqualTo("Roadmap Foundation");
    }

    @Test
    @DisplayName("로드맵 키가 없으면 단건 조회 실패")
    void failsWhenRoadmapDoesNotExist() {
        given(roadmapRepository.findByProjectProjectKeyAndRoadmapKey("ado-platform", "missing-roadmap"))
                .willReturn(Optional.empty());

        Throwable thrown = catchThrowable(() -> queryService.findRoadmap("ado-platform", "missing-roadmap"));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("로드맵을 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.ROADMAP_NOT_FOUND);
    }
}
