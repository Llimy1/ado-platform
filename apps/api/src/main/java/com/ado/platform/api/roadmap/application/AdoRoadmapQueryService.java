package com.ado.platform.api.roadmap.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import com.ado.platform.api.roadmap.api.dto.AdoRoadmapResponse;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapEntity;
import com.ado.platform.api.roadmap.persistence.repository.AdoRoadmapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdoRoadmapQueryService {

    private final AdoProjectRepository projectRepository;
    private final AdoRoadmapRepository roadmapRepository;

    public List<AdoRoadmapResponse> findRoadmaps(String projectKey) {
        if (!projectRepository.existsByProjectKey(projectKey)) {
            throw new BusinessException(ErrorCode.PROJECT_NOT_FOUND);
        }

        return roadmapRepository.findByProjectProjectKeyOrderByRoadmapKeyAsc(projectKey)
                .stream()
                .map(AdoRoadmapMapper::toResponse)
                .toList();
    }

    public AdoRoadmapResponse findRoadmap(String projectKey, String roadmapKey) {
        AdoRoadmapEntity roadmap = roadmapRepository.findByProjectProjectKeyAndRoadmapKey(projectKey, roadmapKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROADMAP_NOT_FOUND));

        return AdoRoadmapMapper.toResponse(roadmap);
    }
}
