package com.ado.platform.api.roadmap.application;

import com.ado.platform.api.roadmap.api.dto.AdoRoadmapResponse;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapEntity;

final class AdoRoadmapMapper {

    private AdoRoadmapMapper() {
    }

    static AdoRoadmapResponse toResponse(AdoRoadmapEntity roadmap) {
        return new AdoRoadmapResponse(
                roadmap.getId(),
                roadmap.getProject().getId(),
                roadmap.getTitle(),
                roadmap.getDescription(),
                roadmap.getStatus(),
                roadmap.getCreatedAt(),
                roadmap.getUpdatedAt()
        );
    }
}
