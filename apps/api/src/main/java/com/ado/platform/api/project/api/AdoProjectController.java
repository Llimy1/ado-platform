package com.ado.platform.api.project.api;


import com.ado.platform.api.common.api.docs.CreatedResponse;
import com.ado.platform.api.common.api.docs.OkResponse;
import com.ado.platform.api.common.api.docs.ValidationErrorResponse;
import com.ado.platform.api.common.api.response.ApiResponse;
import com.ado.platform.api.project.api.docs.ProjectKeyConflictResponse;
import com.ado.platform.api.project.api.docs.ProjectNotFoundResponse;
import com.ado.platform.api.project.api.dto.AdoProjectCreateRequest;
import com.ado.platform.api.project.api.dto.AdoProjectResponse;
import com.ado.platform.api.project.application.AdoProjectCommandService;
import com.ado.platform.api.project.application.AdoProjectQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/v1/projects", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Projects", description = "ADO 프로젝트 API")
public class AdoProjectController {

    private final AdoProjectQueryService queryService;
    private final AdoProjectCommandService commandService;

    @Operation(
            summary = "프로젝트 목록 조회",
            description = "생성된 ADO 프로젝트 목록을 조회합니다."
    )
    @OkResponse
    @GetMapping
    public ApiResponse<List<AdoProjectResponse>> findProjects() {
        return ApiResponse.success(queryService.findProjects());
    }

    @Operation(
            summary = "프로젝트 단건 조회",
            description = "프로젝트 ID로 ADO 프로젝트를 조회합니다."
    )
    @OkResponse
    @ProjectNotFoundResponse
    @GetMapping("/{id}")
    public ApiResponse<AdoProjectResponse> findProject(
            @Parameter(description = "프로젝트 ID", example = "1", required = true)
            @PathVariable Long id
    ) {
        return ApiResponse.success(queryService.findProject(id));
    }

    @Operation(
            summary = "프로젝트 생성",
            description = "ADO 프로젝트를 생성합니다. projectKey는 중복될 수 없습니다."
    )
    @CreatedResponse
    @ValidationErrorResponse
    @ProjectKeyConflictResponse
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdoProjectResponse> createProject(@Valid @RequestBody AdoProjectCreateRequest request) {
        return ApiResponse.success(commandService.createProject(request));
    }
}
