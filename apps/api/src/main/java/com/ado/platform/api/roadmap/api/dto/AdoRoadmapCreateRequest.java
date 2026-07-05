package com.ado.platform.api.roadmap.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record AdoRoadmapCreateRequest(
        @Schema(description = "로드맵 제목", example = "Roadmap Foundation")
        @NotBlank(message = "로드맵 제목은 필수입니다.")
        String title,

        @Schema(description = "로드맵 설명", example = "ADO Roadmap persistence and API foundation")
        String description
) {
}
