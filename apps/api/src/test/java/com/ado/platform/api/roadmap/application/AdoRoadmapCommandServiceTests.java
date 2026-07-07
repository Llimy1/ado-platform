package com.ado.platform.api.roadmap.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapCreateRequest;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapResponse;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapUpdateRequest;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapEntity;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapStatus;
import com.ado.platform.api.roadmap.persistence.repository.AdoRoadmapRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static com.ado.platform.api.roadmap.application.AdoRoadmapTestFixtures.project;
import static com.ado.platform.api.roadmap.application.AdoRoadmapTestFixtures.roadmap;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
public class AdoRoadmapCommandServiceTests {

    @Mock
    private AdoProjectRepository projectRepository;

    @Mock
    private AdoRoadmapRepository roadmapRepository;

    @InjectMocks
    private AdoRoadmapCommandService commandService;

    @Test
    @DisplayName("로드맵 생성")
    void createsRoadmap() {
        AdoProjectEntity project = project();
        AdoRoadmapEntity roadmap = roadmap(project, "roadmap-foundation", "Roadmap Foundation");
        AdoRoadmapCreateRequest request = new AdoRoadmapCreateRequest(
                "roadmap-foundation",
                "Roadmap Foundation",
                "Roadmap persistence and API foundation"
        );

        given(projectRepository.findByProjectKey("ado-platform")).willReturn(Optional.of(project));
        given(roadmapRepository.save(any(AdoRoadmapEntity.class))).willReturn(roadmap);

        AdoRoadmapResponse response = commandService.createRoadmap("ado-platform", request);

        assertThat(response.projectKey()).isEqualTo("ado-platform");
        assertThat(response.roadmapKey()).isEqualTo("roadmap-foundation");
        assertThat(response.status()).isEqualTo(AdoRoadmapStatus.DRAFT);
        then(projectRepository).should().findByProjectKey("ado-platform");
    }

    @Test
    @DisplayName("프로젝트 키가 없으면 로드맵 생성 실패")
    void failsWhenProjectDoesNotExist() {
        AdoRoadmapCreateRequest request = new AdoRoadmapCreateRequest(
                "roadmap-foundation",
                "Roadmap Foundation",
                "Roadmap persistence and API foundation"
        );
        given(projectRepository.findByProjectKey("missing-project")).willReturn(Optional.empty());

        Throwable thrown = catchThrowable(() -> commandService.createRoadmap("missing-project", request));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("프로젝트를 찾을 수 없습니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.PROJECT_NOT_FOUND);
    }

    @Test
    @DisplayName("로드맵 수정")
    void updatesRoadmap() {
        AdoRoadmapEntity roadmap = roadmap(project(), "roadmap-foundation", "Roadmap Foundation");
        AdoRoadmapUpdateRequest request = new AdoRoadmapUpdateRequest(
                "Roadmap Update/Archive API",
                "Roadmap update and archive API"
        );
        given(roadmapRepository.findByProjectProjectKeyAndRoadmapKey("ado-platform", "roadmap-foundation"))
                .willReturn(Optional.of(roadmap));
        given(roadmapRepository.saveAndFlush(roadmap)).willReturn(roadmap);

        AdoRoadmapResponse response = commandService.updateRoadmap("ado-platform", "roadmap-foundation", request);

        assertThat(response.title()).isEqualTo("Roadmap Update/Archive API");
        assertThat(response.description()).isEqualTo("Roadmap update and archive API");
    }

    @Test
    @DisplayName("로드맵 아카이브")
    void archivesRoadmap() {
        AdoRoadmapEntity roadmap = roadmap(project(), "roadmap-foundation", "Roadmap Foundation");
        given(roadmapRepository.findByProjectProjectKeyAndRoadmapKey("ado-platform", "roadmap-foundation"))
                .willReturn(Optional.of(roadmap));
        given(roadmapRepository.saveAndFlush(roadmap)).willReturn(roadmap);

        AdoRoadmapResponse response = commandService.archiveRoadmap("ado-platform", "roadmap-foundation");

        assertThat(response.status()).isEqualTo(AdoRoadmapStatus.ARCHIVED);
    }
}
