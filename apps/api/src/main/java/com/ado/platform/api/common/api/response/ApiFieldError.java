package com.ado.platform.api.common.api.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "필드 검증 오류")
public record ApiFieldError(
        @Schema(description = "오류 필드명", example = "projectKey")
        String field,

        @Schema(description = "오류 메시지", example = "프로젝트 키는 필수입니다.")
        String message
) {
}
