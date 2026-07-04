package com.ado.platform.api.project.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record AdoProjectCreateRequest(
        @Schema(description = "프로젝트 키", example = "ado-platform")
        @NotBlank(message = "프로젝트 키는 필수입니다.")
        String projectKey,

        @Schema(description = "프로젝트 이름", example = "ADO Platform")
        @NotBlank(message = "프로젝트 이름은 필수입니다.")
        String name
) {
}
