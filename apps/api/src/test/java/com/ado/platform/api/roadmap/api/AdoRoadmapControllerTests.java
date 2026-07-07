package com.ado.platform.api.roadmap.api;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.common.api.error.GlobalExceptionHandler;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapCreateRequest;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapResponse;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapUpdateRequest;
import com.ado.platform.api.roadmap.application.AdoRoadmapCommandService;
import com.ado.platform.api.roadmap.application.AdoRoadmapQueryService;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapStatus;
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

@WebMvcTest(AdoRoadmapController.class)
@Import(GlobalExceptionHandler.class)
public class AdoRoadmapControllerTests {

    private static final UUID PROJECT_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f900");
    private static final UUID ROADMAP_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f901");

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdoRoadmapQueryService queryService;

    @MockitoBean
    private AdoRoadmapCommandService commandService;

    @Test
    @DisplayName("프로젝트 로드맵 목록 조회")
    void findRoadmaps() throws Exception {
        given(queryService.findRoadmaps("ado-platform")).willReturn(List.of(response(AdoRoadmapStatus.DRAFT)));

        mockMvc.perform(get("/v1/projects/ado-platform/roadmaps"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.data[0].id").value(ROADMAP_ID.toString()))
                .andExpect(jsonPath("$.data[0].projectId").value(PROJECT_ID.toString()))
                .andExpect(jsonPath("$.data[0].projectKey").value("ado-platform"))
                .andExpect(jsonPath("$.data[0].roadmapKey").value("roadmap-foundation"))
                .andExpect(jsonPath("$.data[0].status").value("draft"))
                .andExpect(jsonPath("$.errors").isEmpty());

        then(queryService).should().findRoadmaps("ado-platform");
    }

    @Test
    @DisplayName("로드맵 단건 조회")
    void findRoadmap() throws Exception {
        given(queryService.findRoadmap("ado-platform", "roadmap-foundation"))
                .willReturn(response(AdoRoadmapStatus.DRAFT));

        mockMvc.perform(get("/v1/projects/ado-platform/roadmaps/roadmap-foundation"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(ROADMAP_ID.toString()))
                .andExpect(jsonPath("$.data.roadmapKey").value("roadmap-foundation"))
                .andExpect(jsonPath("$.data.status").value("draft"))
                .andExpect(jsonPath("$.errors").isEmpty());

        then(queryService).should().findRoadmap("ado-platform", "roadmap-foundation");
    }

    @Test
    @DisplayName("로드맵 생성")
    void createRoadmap() throws Exception {
        given(commandService.createRoadmap(any(String.class), any(AdoRoadmapCreateRequest.class)))
                .willReturn(response(AdoRoadmapStatus.DRAFT));

        mockMvc.perform(post("/v1/projects/ado-platform/roadmaps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "roadmapKey": "roadmap-foundation",
                                  "title": "Roadmap Foundation",
                                  "description": "Roadmap persistence and API foundation"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.roadmapKey").value("roadmap-foundation"))
                .andExpect(jsonPath("$.data.status").value("draft"));

        then(commandService).should().createRoadmap(
                eq("ado-platform"),
                argThat(request -> request != null
                        && request.roadmapKey().equals("roadmap-foundation")
                        && request.title().equals("Roadmap Foundation"))
        );
    }

    @Test
    @DisplayName("로드맵 수정")
    void updateRoadmap() throws Exception {
        given(commandService.updateRoadmap(any(String.class), any(String.class), any(AdoRoadmapUpdateRequest.class)))
                .willReturn(updatedResponse());

        mockMvc.perform(patch("/v1/projects/ado-platform/roadmaps/roadmap-foundation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Roadmap Update/Archive API",
                                  "description": "Roadmap update and archive API"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Roadmap Update/Archive API"))
                .andExpect(jsonPath("$.data.status").value("draft"));

        then(commandService).should().updateRoadmap(
                eq("ado-platform"),
                eq("roadmap-foundation"),
                argThat(request -> request != null && request.title().equals("Roadmap Update/Archive API"))
        );
    }

    @Test
    @DisplayName("로드맵 아카이브")
    void archiveRoadmap() throws Exception {
        given(commandService.archiveRoadmap("ado-platform", "roadmap-foundation"))
                .willReturn(response(AdoRoadmapStatus.ARCHIVED));

        mockMvc.perform(post("/v1/projects/ado-platform/roadmaps/roadmap-foundation/archive"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("archived"));

        then(commandService).should().archiveRoadmap("ado-platform", "roadmap-foundation");
    }

    @Test
    @DisplayName("로드맵 생성 실패 - 키 공백")
    void failsWhenRoadmapKeyIsBlank() throws Exception {
        mockMvc.perform(post("/v1/projects/ado-platform/roadmaps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "roadmapKey": "",
                                  "title": "Roadmap Foundation"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.errors[0].field").value("roadmapKey"));

        verifyNoInteractions(commandService);
    }

    @Test
    @DisplayName("로드맵 조회 실패 - 로드맵 없음")
    void failsWhenRoadmapDoesNotExist() throws Exception {
        given(queryService.findRoadmap("ado-platform", "missing-roadmap"))
                .willThrow(new BusinessException(ErrorCode.ROADMAP_NOT_FOUND));

        mockMvc.perform(get("/v1/projects/ado-platform/roadmaps/missing-roadmap"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("ROADMAP_NOT_FOUND"))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errors").isEmpty());
    }

    private AdoRoadmapResponse response(AdoRoadmapStatus status) {
        return new AdoRoadmapResponse(
                ROADMAP_ID,
                PROJECT_ID,
                "ado-platform",
                "roadmap-foundation",
                "Roadmap Foundation",
                "Roadmap persistence and API foundation",
                status,
                Instant.parse("2026-07-05T00:34:40Z"),
                Instant.parse("2026-07-05T00:34:40Z")
        );
    }

    private AdoRoadmapResponse updatedResponse() {
        return new AdoRoadmapResponse(
                ROADMAP_ID,
                PROJECT_ID,
                "ado-platform",
                "roadmap-foundation",
                "Roadmap Update/Archive API",
                "Roadmap update and archive API",
                AdoRoadmapStatus.DRAFT,
                Instant.parse("2026-07-05T00:34:40Z"),
                Instant.parse("2026-07-05T00:40:00Z")
        );
    }
}
