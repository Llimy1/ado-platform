package com.ado.platform.api.roadmap.persistence.repository;

import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdoRoadmapRepository extends JpaRepository<AdoRoadmapEntity, Long> {

    List<AdoRoadmapEntity> findByProjectIdOrderByIdAsc(Long projectId);
}
