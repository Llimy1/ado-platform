package com.ado.platform.api.roadmap.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapCreateRequest;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapResponse;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapUpdateRequest;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapEntity;
import com.ado.platform.api.roadmap.persistence.repository.AdoRoadmapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdoRoadmapCommandService {

    private final AdoProjectRepository projectRepository;
    private final AdoRoadmapRepository roadmapRepository;

    @Transactional
    public AdoRoadmapResponse createRoadmap(String projectKey, AdoRoadmapCreateRequest request) {
        AdoProjectEntity project = projectRepository.findByProjectKey(projectKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROJECT_NOT_FOUND));

        AdoRoadmapEntity saved = roadmapRepository.save(
                AdoRoadmapEntity.createDraft(project, request.roadmapKey(), request.title(), request.description())
        );

        return AdoRoadmapMapper.toResponse(saved);
    }

    @Transactional
    public AdoRoadmapResponse updateRoadmap(String projectKey, String roadmapKey, AdoRoadmapUpdateRequest request) {
        AdoRoadmapEntity roadmap = roadmapRepository.findByProjectProjectKeyAndRoadmapKey(projectKey, roadmapKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROADMAP_NOT_FOUND));

        roadmap.updateDetails(request.title(), request.description());

        return AdoRoadmapMapper.toResponse(roadmapRepository.saveAndFlush(roadmap));
    }

    @Transactional
    public AdoRoadmapResponse archiveRoadmap(String projectKey, String roadmapKey) {
        AdoRoadmapEntity roadmap = roadmapRepository.findByProjectProjectKeyAndRoadmapKey(projectKey, roadmapKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROADMAP_NOT_FOUND));

        roadmap.archive();

        return AdoRoadmapMapper.toResponse(roadmapRepository.saveAndFlush(roadmap));
    }
}
