package com.ado.platform.api.job.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;
import java.util.UUID;

@Schema(description = "Job Attempt 로그 페이지")
public record AdoJobLogPageResponse(
        @Schema(description = "Job Attempt ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f903")
        UUID attemptId,

        @Schema(description = "로그 스트림", example = "system")
        String stream,

        @Schema(description = "로그 항목")
        List<AdoJobEventResponse> entries,

        @Schema(description = "다음 cursor")
        String nextCursor,

        @Schema(description = "최신 sequence", example = "1")
        long newestSequence
) {
}
