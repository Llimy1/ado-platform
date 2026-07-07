package com.ado.platform.api.project.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "ADO 프로젝트 응답")
public record AdoProjectResponse (
        @Schema(description = "프로젝트 ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f900")
        UUID id,

        @Schema(description = "프로젝트 키", example = "ado-platform")
        String projectKey,

        @Schema(description = "프로젝트 이름", example = "ADO Platform")
        String name,

        @Schema(description = "생성 일시", example = "2026-07-04T04:28:01.091776Z")
        Instant createdAt,

        @Schema(description = "수정 일시", example = "2026-07-04T04:28:01.091776Z")
        Instant updatedAt
) {}
