package com.ado.platform.api.project.persistence.repository;

import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdoProjectRepository extends JpaRepository<AdoProjectEntity, Long> {}
