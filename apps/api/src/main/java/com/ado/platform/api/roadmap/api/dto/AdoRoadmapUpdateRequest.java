package com.ado.platform.api.roadmap.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record AdoRoadmapUpdateRequest(
        @Schema(description = "로드맵 제목", example = "Roadmap Update/Archive API")
        @NotBlank(message = "로드맵 제목은 필수입니다.")
        String title,

        @Schema(description = "로드맵 설명", example = "로드맵 수정 및 아카이브 API")
        String description
) {
}
