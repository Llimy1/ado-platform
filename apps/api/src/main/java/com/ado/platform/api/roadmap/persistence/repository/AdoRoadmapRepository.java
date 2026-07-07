package com.ado.platform.api.roadmap.persistence.repository;

import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdoRoadmapRepository extends JpaRepository<AdoRoadmapEntity, UUID> {

    List<AdoRoadmapEntity> findByProjectProjectKeyOrderByRoadmapKeyAsc(String projectKey);

    Optional<AdoRoadmapEntity> findByProjectProjectKeyAndRoadmapKey(String projectKey, String roadmapKey);
}
