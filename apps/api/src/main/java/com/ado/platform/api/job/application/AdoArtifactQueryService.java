package com.ado.platform.api.job.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.job.api.dto.AdoArtifactResponse;
import com.ado.platform.api.job.persistence.repository.AdoArtifactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdoArtifactQueryService {

    private final AdoArtifactRepository artifactRepository;

    public AdoArtifactResponse findArtifact(String projectKey, String artifactKey) {
        return artifactRepository.findByProjectProjectKeyAndArtifactKey(projectKey, artifactKey)
                .map(AdoJobMapper::toArtifactResponse)
                .orElseThrow(() -> new BusinessException(ErrorCode.ARTIFACT_NOT_FOUND));
    }
}
