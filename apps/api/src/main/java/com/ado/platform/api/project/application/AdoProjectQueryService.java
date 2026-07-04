package com.ado.platform.api.project.application;


import com.ado.platform.api.project.api.dto.AdoProjectResponse;
import com.ado.platform.api.project.exception.ProjectNotFoundException;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdoProjectQueryService {

    private final AdoProjectRepository repository;

    public List<AdoProjectResponse> findProjects() {
        return repository.findAll().stream()
                .map(project -> new AdoProjectResponse(
                        project.getId(),
                        project.getProjectKey(),
                        project.getName(),
                        project.getCreatedAt(),
                        project.getUpdatedAt()
                )).toList();
    }

    public AdoProjectResponse findProject(Long id) {
        AdoProjectEntity project = repository.findById(id)
                .orElseThrow(ProjectNotFoundException::new);

        return toResponse(project);
    }

    private AdoProjectResponse toResponse(AdoProjectEntity project) {
        return new AdoProjectResponse(
                project.getId(),
                project.getProjectKey(),
                project.getName(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}
