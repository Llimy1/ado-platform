package com.ado.platform.api.project.api;


import com.ado.platform.api.common.api.response.ApiResponse;
import com.ado.platform.api.project.api.dto.AdoProjectCreateRequest;
import com.ado.platform.api.project.api.dto.AdoProjectResponse;
import com.ado.platform.api.project.application.AdoProjectCommandService;
import com.ado.platform.api.project.application.AdoProjectQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/v1/projects")
public class AdoProjectController {

    private final AdoProjectQueryService queryService;
    private final AdoProjectCommandService commandService;


    @GetMapping
    public ApiResponse<List<AdoProjectResponse>> findProjects() {
        return ApiResponse.success(queryService.findProjects());
    }

    @GetMapping("/{id}")
    public ApiResponse<AdoProjectResponse> findProject(@PathVariable Long id) {
        return ApiResponse.success(queryService.findProject(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdoProjectResponse> createProject(@Valid @RequestBody AdoProjectCreateRequest request) {
        return ApiResponse.success(commandService.createProject(request));
    }
}
