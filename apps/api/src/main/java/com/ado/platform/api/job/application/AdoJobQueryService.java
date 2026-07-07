package com.ado.platform.api.job.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.job.api.dto.AdoJobResponse;
import com.ado.platform.api.job.persistence.entity.AdoJobEntity;
import com.ado.platform.api.job.persistence.repository.AdoJobAttemptRepository;
import com.ado.platform.api.job.persistence.repository.AdoJobRepository;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdoJobQueryService {

    private final AdoProjectRepository projectRepository;
    private final AdoJobRepository jobRepository;
    private final AdoJobAttemptRepository jobAttemptRepository;

    public List<AdoJobResponse> findJobs(String projectKey) {
        if (!projectRepository.existsByProjectKey(projectKey)) {
            throw new BusinessException(ErrorCode.PROJECT_NOT_FOUND);
        }

        return jobRepository.findByProjectProjectKeyOrderByPriorityAscScheduledAtAscCreatedAtAscIdAsc(projectKey)
                .stream()
                .map(job -> AdoJobMapper.toResponse(
                        job,
                        jobAttemptRepository.findFirstByJobIdOrderByAttemptNumberDesc(job.getId()).orElse(null)
                ))
                .toList();
    }

    public AdoJobResponse findJob(String projectKey, String jobKey) {
        AdoJobEntity job = jobRepository.findByProjectProjectKeyAndJobKey(projectKey, jobKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.JOB_NOT_FOUND));

        return AdoJobMapper.toResponse(
                job,
                jobAttemptRepository.findFirstByJobIdOrderByAttemptNumberDesc(job.getId()).orElse(null)
        );
    }
}
