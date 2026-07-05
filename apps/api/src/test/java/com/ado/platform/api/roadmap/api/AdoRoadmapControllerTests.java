package com.ado.platform.api.roadmap.api;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.common.api.error.GlobalExceptionHandler;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapCreateRequest;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapResponse;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdoRoadmapController.class)
@Import(GlobalExceptionHandler.class)
public class AdoRoadmapControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdoRoadmapQueryService queryService;

    @MockitoBean
    private AdoRoadmapCommandService commandService;

    @Test
    @DisplayName("프로젝트 로드맵 목록 조회")
    void findRoadmaps() throws Exception {
        given(queryService.findRoadmaps(1L)).willReturn(List.of(response()));

        mockMvc.perform(get("/v1/projects/1/roadmaps"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.message").value("요청이 성공했습니다."))
                .andExpect(jsonPath("$.data[0].id").value(10))
                .andExpect(jsonPath("$.data[0].projectId").value(1))
                .andExpect(jsonPath("$.data[0].title").value("Roadmap Foundation"))
                .andExpect(jsonPath("$.data[0].description").value("Roadmap persistence and API foundation"))
                .andExpect(jsonPath("$.data[0].status").value("DRAFT"))
                .andExpect(jsonPath("$.data[0].createdAt").value("2026-07-05T00:34:40Z"))
                .andExpect(jsonPath("$.data[0].updatedAt").value("2026-07-05T00:34:40Z"))
                .andExpect(jsonPath("$.errors").isEmpty());

        then(queryService).should().findRoadmaps(1L);
    }

    @Test
    @DisplayName("로드맵 단건 조회")
    void findRoadmap() throws Exception {
        given(queryService.findRoadmap(10L)).willReturn(response());

        mockMvc.perform(get("/v1/roadmaps/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.message").value("요청이 성공했습니다."))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.projectId").value(1))
                .andExpect(jsonPath("$.data.title").value("Roadmap Foundation"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"))
                .andExpect(jsonPath("$.errors").isEmpty());

        then(queryService).should().findRoadmap(10L);
    }

    @Test
    @DisplayName("로드맵 생성")
    void createRoadmap() throws Exception {
        given(commandService.createRoadmap(any(Long.class), any(AdoRoadmapCreateRequest.class)))
                .willReturn(response());

        mockMvc.perform(post("/v1/projects/1/roadmaps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Roadmap Foundation",
                                  "description": "Roadmap persistence and API foundation"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.message").value("요청이 성공했습니다."))
                .andExpect(jsonPath("$.data.id").value(10))
                .andExpect(jsonPath("$.data.projectId").value(1))
                .andExpect(jsonPath("$.data.title").value("Roadmap Foundation"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"))
                .andExpect(jsonPath("$.errors").isEmpty());

        then(commandService).should().createRoadmap(
                org.mockito.ArgumentMatchers.eq(1L),
                argThat(request -> request != null
                        && request.title().equals("Roadmap Foundation")
                        && request.description().equals("Roadmap persistence and API foundation"))
        );
    }

    @Test
    @DisplayName("로드맵 생성 실패 - 제목 공백")
    void failsWhenTitleIsBlank() throws Exception {
        mockMvc.perform(post("/v1/projects/1/roadmaps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "",
                                  "description": "Roadmap persistence and API foundation"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.message").value("요청 값이 올바르지 않습니다."))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errors[0].field").value("title"))
                .andExpect(jsonPath("$.errors[0].message").value("로드맵 제목은 필수입니다."));

        verifyNoInteractions(commandService);
    }

    @Test
    @DisplayName("로드맵 목록 조회 실패 - 프로젝트 없음")
    void failsWhenProjectDoesNotExistForList() throws Exception {
        given(queryService.findRoadmaps(999L)).willThrow(new BusinessException(ErrorCode.PROJECT_NOT_FOUND));

        mockMvc.perform(get("/v1/projects/999/roadmaps"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("PROJECT_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("프로젝트를 찾을 수 없습니다."))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errors").isEmpty());

        then(queryService).should().findRoadmaps(999L);
    }

    @Test
    @DisplayName("로드맵 생성 실패 - 프로젝트 없음")
    void failsWhenProjectDoesNotExistForCreate() throws Exception {
        given(commandService.createRoadmap(any(Long.class), any(AdoRoadmapCreateRequest.class)))
                .willThrow(new BusinessException(ErrorCode.PROJECT_NOT_FOUND));

        mockMvc.perform(post("/v1/projects/999/roadmaps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Roadmap Foundation",
                                  "description": "Roadmap persistence and API foundation"
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("PROJECT_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("프로젝트를 찾을 수 없습니다."))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errors").isEmpty());
    }

    @Test
    @DisplayName("로드맵 단건 조회 실패 - 로드맵 없음")
    void failsWhenRoadmapDoesNotExist() throws Exception {
        given(queryService.findRoadmap(999L)).willThrow(new BusinessException(ErrorCode.ROADMAP_NOT_FOUND));

        mockMvc.perform(get("/v1/roadmaps/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("ROADMAP_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("로드맵을 찾을 수 없습니다."))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errors").isEmpty());

        then(queryService).should().findRoadmap(999L);
    }

    private AdoRoadmapResponse response() {
        return new AdoRoadmapResponse(
                10L,
                1L,
                "Roadmap Foundation",
                "Roadmap persistence and API foundation",
                AdoRoadmapStatus.DRAFT,
                Instant.parse("2026-07-05T00:34:40Z"),
                Instant.parse("2026-07-05T00:34:40Z")
        );
    }
}
