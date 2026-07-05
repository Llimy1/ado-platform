package com.ado.platform.api.roadmap.api;

import com.ado.platform.api.common.api.docs.CreatedResponse;
import com.ado.platform.api.common.api.docs.OkResponse;
import com.ado.platform.api.common.api.docs.ValidationErrorResponse;
import com.ado.platform.api.common.api.response.ApiResponse;
import com.ado.platform.api.project.api.docs.ProjectNotFoundResponse;
import com.ado.platform.api.roadmap.api.docs.RoadmapNotFoundResponse;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapCreateRequest;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapResponse;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapUpdateRequest;
import com.ado.platform.api.roadmap.application.AdoRoadmapCommandService;
import com.ado.platform.api.roadmap.application.AdoRoadmapQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/v1", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Roadmaps", description = "ADO 로드맵 API")
public class AdoRoadmapController {

    private final AdoRoadmapQueryService queryService;
    private final AdoRoadmapCommandService commandService;

    @Operation(
            summary = "프로젝트 로드맵 목록 조회",
            description = "프로젝트 ID로 ADO 로드맵 목록을 조회합니다."
    )
    @OkResponse
    @ProjectNotFoundResponse
    @GetMapping("/projects/{projectId}/roadmaps")
    public ApiResponse<List<AdoRoadmapResponse>> findRoadmaps(
            @Parameter(description = "프로젝트 ID", example = "1", required = true)
            @PathVariable Long projectId
    ) {
        return ApiResponse.success(queryService.findRoadmaps(projectId));
    }

    @Operation(
            summary = "로드맵 단건 조회",
            description = "로드맵 ID로 ADO 로드맵을 조회합니다."
    )
    @OkResponse
    @RoadmapNotFoundResponse
    @GetMapping("/roadmaps/{roadmapId}")
    public ApiResponse<AdoRoadmapResponse> findRoadmap(
            @Parameter(description = "로드맵 ID", example = "1", required = true)
            @PathVariable Long roadmapId
    ) {
        return ApiResponse.success(queryService.findRoadmap(roadmapId));
    }

    @Operation(
            summary = "로드맵 생성",
            description = "프로젝트에 초안 상태의 ADO 로드맵을 생성합니다."
    )
    @CreatedResponse
    @ValidationErrorResponse
    @ProjectNotFoundResponse
    @PostMapping(value = "/projects/{projectId}/roadmaps", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdoRoadmapResponse> createRoadmap(
            @Parameter(description = "프로젝트 ID", example = "1", required = true)
            @PathVariable Long projectId,
            @Valid @RequestBody AdoRoadmapCreateRequest request
    ) {
        return ApiResponse.success(commandService.createRoadmap(projectId, request));
    }

    @Operation(
            summary = "로드맵 수정",
            description = "로드맵의 제목과 설명을 수정합니다."
    )
    @OkResponse
    @ValidationErrorResponse
    @RoadmapNotFoundResponse
    @PatchMapping(value = "/roadmaps/{roadmapId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<AdoRoadmapResponse> updateRoadmap(
            @Parameter(description = "로드맵 ID", example = "1", required = true)
            @PathVariable Long roadmapId,
            @Valid @RequestBody AdoRoadmapUpdateRequest request
    ) {
        return ApiResponse.success(commandService.updateRoadmap(roadmapId, request));
    }

    @Operation(
            summary = "로드맵 아카이브",
            description = "로드맵 상태를 ARCHIVED로 변경합니다."
    )
    @OkResponse
    @RoadmapNotFoundResponse
    @PostMapping("/roadmaps/{roadmapId}/archive")
    public ApiResponse<AdoRoadmapResponse> archiveRoadmap(
            @Parameter(description = "로드맵 ID", example = "1", required = true)
            @PathVariable Long roadmapId
    ) {
        return ApiResponse.success(commandService.archiveRoadmap(roadmapId));
    }
}
