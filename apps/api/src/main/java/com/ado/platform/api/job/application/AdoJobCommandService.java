package com.ado.platform.api.job.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.job.api.dto.AdoJobCreateRequest;
import com.ado.platform.api.job.api.dto.AdoJobResponse;
import com.ado.platform.api.job.api.dto.AdoJobStatusUpdateRequest;
import com.ado.platform.api.job.persistence.entity.AdoContextPacketEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobAttemptEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobEventEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobEventLevel;
import com.ado.platform.api.job.persistence.repository.AdoJobRepository;
import com.ado.platform.api.job.persistence.repository.AdoContextPacketRepository;
import com.ado.platform.api.job.persistence.repository.AdoJobAttemptRepository;
import com.ado.platform.api.job.persistence.repository.AdoJobEventRepository;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdoJobCommandService {

    private final AdoProjectRepository projectRepository;
    private final AdoJobRepository jobRepository;
    private final AdoContextPacketRepository contextPacketRepository;
    private final AdoJobAttemptRepository jobAttemptRepository;
    private final AdoJobEventRepository jobEventRepository;

    @Transactional
    public AdoJobResponse createJob(String projectKey, AdoJobCreateRequest request) {
        AdoProjectEntity project = projectRepository.findByProjectKey(projectKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROJECT_NOT_FOUND));

        AdoJobEntity existingJob = jobRepository.findByProjectProjectKeyAndIdempotencyKey(projectKey, request.idempotencyKey())
                .orElse(null);
        if (existingJob != null) {
            return AdoJobMapper.toResponse(
                    existingJob,
                    jobAttemptRepository.findFirstByJobIdOrderByAttemptNumberDesc(existingJob.getId()).orElse(null)
            );
        }

        AdoContextPacketEntity contextPacket = request.contextArtifactKey() == null || request.contextArtifactKey().isBlank()
                ? null
                : contextPacketRepository
                        .findByArtifactProjectProjectKeyAndArtifactArtifactKey(projectKey, request.contextArtifactKey())
                        .orElse(null);

        AdoJobEntity saved = jobRepository.save(
                AdoJobEntity.createQueued(
                        project,
                        contextPacket,
                        request.jobKey(),
                        request.idempotencyKey(),
                        request.jobType(),
                        request.targetType(),
                        request.targetRef(),
                        request.title(),
                        request.description(),
                        request.priority() == null ? 100 : request.priority(),
                        request.scheduledAt() == null ? Instant.now() : request.scheduledAt()
                )
        );
        AdoJobAttemptEntity attempt = jobAttemptRepository.save(
                AdoJobAttemptEntity.createQueued(saved, 1)
        );
        jobEventRepository.save(
                AdoJobEventEntity.create(
                        saved,
                        attempt,
                        1,
                        "job_created",
                        AdoJobEventLevel.INFO,
                        "Job was queued",
                        Instant.now()
                )
        );

        return AdoJobMapper.toResponse(saved, attempt);
    }

    @Transactional
    public AdoJobResponse updateJobStatus(String projectKey, String jobKey, AdoJobStatusUpdateRequest request) {
        AdoJobEntity job = jobRepository.findByProjectProjectKeyAndJobKey(projectKey, jobKey)
                .orElseThrow(() -> new BusinessException(ErrorCode.JOB_NOT_FOUND));

        job.transitionTo(request.status());

        AdoJobEntity saved = jobRepository.saveAndFlush(job);
        return AdoJobMapper.toResponse(
                saved,
                jobAttemptRepository.findFirstByJobIdOrderByAttemptNumberDesc(saved.getId()).orElse(null)
        );
    }
}
