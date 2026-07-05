package com.ado.platform.api.roadmap.api.dto;

import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "ADO 로드맵 응답")
public record AdoRoadmapResponse(
        @Schema(description = "로드맵 ID", example = "1")
        Long id,

        @Schema(description = "프로젝트 ID", example = "1")
        Long projectId,

        @Schema(description = "로드맵 제목", example = "Roadmap Foundation")
        String title,

        @Schema(description = "로드맵 설명", example = "ADO Roadmap persistence and API foundation")
        String description,

        @Schema(description = "로드맵 상태", example = "DRAFT")
        AdoRoadmapStatus status,

        @Schema(description = "생성 일시", example = "2026-07-05T00:34:40Z")
        Instant createdAt,

        @Schema(description = "수정 일시", example = "2026-07-05T00:34:40Z")
        Instant updatedAt
) {
}
