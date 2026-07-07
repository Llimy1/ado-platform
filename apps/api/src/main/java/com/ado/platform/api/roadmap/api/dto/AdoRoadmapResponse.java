package com.ado.platform.api.roadmap.api.dto;

import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "ADO 로드맵 응답")
public record AdoRoadmapResponse(
        @Schema(description = "로드맵 ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f901")
        UUID id,

        @Schema(description = "프로젝트 ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f900")
        UUID projectId,

        @Schema(description = "프로젝트 키", example = "ado-platform")
        String projectKey,

        @Schema(description = "로드맵 키", example = "roadmap-foundation")
        String roadmapKey,

        @Schema(description = "로드맵 제목", example = "Roadmap Foundation")
        String title,

        @Schema(description = "로드맵 설명", example = "ADO Roadmap persistence and API foundation")
        String description,

        @Schema(description = "로드맵 상태", example = "draft")
        AdoRoadmapStatus status,

        @Schema(description = "생성 일시", example = "2026-07-05T00:34:40Z")
        Instant createdAt,

        @Schema(description = "수정 일시", example = "2026-07-05T00:34:40Z")
        Instant updatedAt
) {
}
