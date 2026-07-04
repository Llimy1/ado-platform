package com.ado.platform.api.project.api;


import com.ado.platform.api.common.api.error.GlobalExceptionHandler;
import com.ado.platform.api.project.api.dto.AdoProjectCreateRequest;
import com.ado.platform.api.project.api.dto.AdoProjectResponse;
import com.ado.platform.api.project.application.AdoProjectCommandService;
import com.ado.platform.api.project.application.AdoProjectQueryService;
import com.ado.platform.api.project.exception.DuplicateProjectKeyException;
import com.ado.platform.api.project.exception.ProjectNotFoundException;
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


@WebMvcTest(AdoProjectController.class)
@Import(GlobalExceptionHandler.class)
public class AdoProjectControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdoProjectQueryService queryService;

    @MockitoBean
    private AdoProjectCommandService commandService;

    @Test
    @DisplayName("프로젝트 목록 조회")
    void findProjects() throws Exception {
        given(queryService.findProjects()).willReturn(
                List.of(new AdoProjectResponse(
                        1L,
                        "ado-platform",
                        "ADO Platform",
                        Instant.parse("2026-07-03T13:00:00Z"),
                        Instant.parse("2026-07-03T13:00:00Z")
                )));

        mockMvc.perform(get("/v1/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.message").value("요청이 성공했습니다."))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].projectKey").value("ado-platform"))
                .andExpect(jsonPath("$.data[0].name").value("ADO Platform"))
                .andExpect(jsonPath("$.data[0].createdAt").value("2026-07-03T13:00:00Z"))
                .andExpect(jsonPath("$.data[0].updatedAt").value("2026-07-03T13:00:00Z"))
                .andExpect(jsonPath("$.errors").isEmpty());
    }

    @Test
    @DisplayName("프로젝트 단건 조회")
    void findProject() throws Exception {
        given(queryService.findProject(1L)).willReturn(
                new AdoProjectResponse(
                        1L,
                        "ado-platform",
                        "ADO Platform",
                        Instant.parse("2026-07-03T13:00:00Z"),
                        Instant.parse("2026-07-03T13:00:00Z")
                ));

        mockMvc.perform(get("/v1/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.message").value("요청이 성공했습니다."))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.projectKey").value("ado-platform"))
                .andExpect(jsonPath("$.data.name").value("ADO Platform"))
                .andExpect(jsonPath("$.data.createdAt").value("2026-07-03T13:00:00Z"))
                .andExpect(jsonPath("$.data.updatedAt").value("2026-07-03T13:00:00Z"))
                .andExpect(jsonPath("$.errors").isEmpty());

        then(queryService).should().findProject(1L);
    }

    @Test
    @DisplayName("프로젝트 생성")
    void createProject() throws Exception {
        given(commandService.createProject(any(AdoProjectCreateRequest.class))).willReturn(
                new AdoProjectResponse(
                        1L,
                        "ado-platform",
                        "ADO Platform",
                        Instant.parse("2026-07-03T13:00:00Z"),
                        Instant.parse("2026-07-03T13:00:00Z")
                ));

        mockMvc.perform(post("/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectKey": "ado-platform",
                                  "name": "ADO Platform"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.message").value("요청이 성공했습니다."))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.projectKey").value("ado-platform"))
                .andExpect(jsonPath("$.data.name").value("ADO Platform"))
                .andExpect(jsonPath("$.data.createdAt").value("2026-07-03T13:00:00Z"))
                .andExpect(jsonPath("$.data.updatedAt").value("2026-07-03T13:00:00Z"))
                .andExpect(jsonPath("$.errors").isEmpty());

        then(commandService).should().createProject(argThat(request ->
                request != null
                        && request.projectKey().equals("ado-platform")
                        && request.name().equals("ADO Platform")
        ));
    }

    @Test
    @DisplayName("프로젝트 생성 실패 - 프로젝트 키 중복")
    void failsWhenProjectKeyAlreadyExists() throws Exception {
        given(commandService.createProject(any(AdoProjectCreateRequest.class)))
                .willThrow(new DuplicateProjectKeyException());

        mockMvc.perform(post("/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectKey": "ado-platform",
                                  "name": "ADO Platform"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("PROJECT_KEY_ALREADY_EXISTS"))
                .andExpect(jsonPath("$.message").value("이미 존재하는 프로젝트 키입니다."))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errors").isEmpty());

        then(commandService).should().createProject(argThat(request ->
                request != null
                        && request.projectKey().equals("ado-platform")
                        && request.name().equals("ADO Platform")
        ));
    }

    @Test
    @DisplayName("프로젝트 단건 조회 실패 - 프로젝트 없음")
    void failsWhenProjectDoesNotExist() throws Exception {
        given(queryService.findProject(999L)).willThrow(new ProjectNotFoundException());

        mockMvc.perform(get("/v1/projects/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("PROJECT_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("프로젝트를 찾을 수 없습니다."))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errors").isEmpty());

        then(queryService).should().findProject(999L);
    }

    @Test
    @DisplayName("프로젝트 생성 실패 - 프로젝트 키 공백")
    void failsWhenProjectKeyIsBlank() throws Exception {
        mockMvc.perform(post("/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectKey": "",
                                  "name": "ADO Platform"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.message").value("요청 값이 올바르지 않습니다."))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errors[0].field").value("projectKey"))
                .andExpect(jsonPath("$.errors[0].message").value("프로젝트 키는 필수입니다."));

        verifyNoInteractions(commandService);
    }

    @Test
    @DisplayName("프로젝트 생성 실패 - 프로젝트 이름 공백")
    void failsWhenNameIsBlank() throws Exception {
        mockMvc.perform(post("/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectKey": "ado-platform",
                                  "name": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.message").value("요청 값이 올바르지 않습니다."))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errors[0].field").value("name"))
                .andExpect(jsonPath("$.errors[0].message").value("프로젝트 이름은 필수입니다."));

        verifyNoInteractions(commandService);
    }

}
