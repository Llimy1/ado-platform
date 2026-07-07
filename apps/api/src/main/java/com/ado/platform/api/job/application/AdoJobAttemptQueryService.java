package com.ado.platform.api.job.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.job.api.dto.AdoJobAttemptDetailResponse;
import com.ado.platform.api.job.api.dto.AdoJobEventResponse;
import com.ado.platform.api.job.api.dto.AdoJobLogPageResponse;
import com.ado.platform.api.job.persistence.entity.AdoJobAttemptEntity;
import com.ado.platform.api.job.persistence.repository.AdoJobAttemptRepository;
import com.ado.platform.api.job.persistence.repository.AdoJobEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdoJobAttemptQueryService {

    private static final int LOG_PAGE_SIZE = 100;

    private final AdoJobAttemptRepository jobAttemptRepository;
    private final AdoJobEventRepository jobEventRepository;

    public AdoJobAttemptDetailResponse findJobAttempt(UUID jobAttemptId) {
        AdoJobAttemptEntity attempt = jobAttemptRepository.findById(jobAttemptId)
                .orElseThrow(() -> new BusinessException(ErrorCode.JOB_ATTEMPT_NOT_FOUND));

        return AdoJobMapper.toDetailResponse(attempt);
    }

    public AdoJobLogPageResponse findLogs(UUID jobAttemptId, String stream, String cursor) {
        if (!jobAttemptRepository.existsById(jobAttemptId)) {
            throw new BusinessException(ErrorCode.JOB_ATTEMPT_NOT_FOUND);
        }

        String normalizedStream = stream == null || stream.isBlank() ? "system" : stream;
        if (!"system".equals(normalizedStream)) {
            return new AdoJobLogPageResponse(jobAttemptId, normalizedStream, List.of(), null, 0);
        }

        long afterSequence = parseCursor(cursor);
        List<AdoJobEventResponse> entries = jobEventRepository
                .findByJobAttemptIdAndSequenceGreaterThanOrderBySequenceAsc(jobAttemptId, afterSequence)
                .stream()
                .limit(LOG_PAGE_SIZE + 1L)
                .map(AdoJobMapper::toEventResponse)
                .toList();

        boolean hasNext = entries.size() > LOG_PAGE_SIZE;
        List<AdoJobEventResponse> pageEntries = hasNext ? entries.subList(0, LOG_PAGE_SIZE) : entries;
        long newestSequence = pageEntries.stream()
                .mapToLong(AdoJobEventResponse::sequence)
                .max()
                .orElse(afterSequence);
        String nextCursor = hasNext ? String.valueOf(newestSequence) : null;

        return new AdoJobLogPageResponse(jobAttemptId, normalizedStream, pageEntries, nextCursor, newestSequence);
    }

    private long parseCursor(String cursor) {
        if (cursor == null || cursor.isBlank()) {
            return 0;
        }

        try {
            return Long.parseLong(cursor);
        } catch (NumberFormatException ignored) {
            return 0;
        }
    }
}
