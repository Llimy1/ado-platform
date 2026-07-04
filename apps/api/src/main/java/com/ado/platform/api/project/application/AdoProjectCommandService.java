package com.ado.platform.api.project.application;

import com.ado.platform.api.project.api.dto.AdoProjectCreateRequest;
import com.ado.platform.api.project.api.dto.AdoProjectResponse;
import com.ado.platform.api.project.exception.DuplicateProjectKeyException;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdoProjectCommandService {

    private final AdoProjectRepository repository;

    @Transactional
    public AdoProjectResponse createProject(AdoProjectCreateRequest request) {
        if (repository.existsByProjectKey(request.projectKey())) {
            throw new DuplicateProjectKeyException();
        }

        AdoProjectEntity saved = repository.save(
                AdoProjectEntity.create(request.projectKey(), request.name())
        );

        return new AdoProjectResponse(
                saved.getId(),
                saved.getProjectKey(),
                saved.getName(),
                saved.getCreatedAt(),
                saved.getUpdatedAt()
        );
    }
}
