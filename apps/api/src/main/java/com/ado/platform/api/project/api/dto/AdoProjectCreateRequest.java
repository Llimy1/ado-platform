package com.ado.platform.api.project.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AdoProjectCreateRequest(
        @NotBlank(message = "프로젝트 키는 필수입니다.")
        String projectKey,

        @NotBlank(message = "프로젝트 이름은 필수입니다.")
        String name
) {
}
