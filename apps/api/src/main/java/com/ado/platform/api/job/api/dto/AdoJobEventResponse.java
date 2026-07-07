package com.ado.platform.api.job.api.dto;

import com.ado.platform.api.job.persistence.entity.AdoJobEventLevel;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "Job Event 응답")
public record AdoJobEventResponse(
        @Schema(description = "이벤트 sequence", example = "1")
        long sequence,

        @Schema(description = "발생 시각", example = "2026-07-06T01:00:00Z")
        Instant occurredAt,

        @Schema(description = "로그 레벨", example = "info")
        AdoJobEventLevel level,

        @Schema(description = "이벤트 유형", example = "job_created")
        String eventType,

        @Schema(description = "이벤트 메시지", example = "Job was queued")
        String text
) {
}
