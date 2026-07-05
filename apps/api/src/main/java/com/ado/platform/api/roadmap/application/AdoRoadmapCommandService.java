package com.ado.platform.api.roadmap.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapCreateRequest;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapResponse;
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
    public AdoRoadmapResponse createRoadmap(Long projectId, AdoRoadmapCreateRequest request) {
        AdoProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROJECT_NOT_FOUND));

        AdoRoadmapEntity saved = roadmapRepository.save(
                AdoRoadmapEntity.createDraft(project, request.title(), request.description())
        );

        return AdoRoadmapMapper.toResponse(saved);
    }
}
