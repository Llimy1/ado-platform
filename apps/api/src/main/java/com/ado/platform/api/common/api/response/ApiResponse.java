package com.ado.platform.api.common.api.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "ADO 공통 API 응답")
public record ApiResponse<T>(
        @Schema(description = "요청 성공 여부", example = "true")
        boolean success,

        @Schema(description = "응답 코드", example = "OK")
        String code,

        @Schema(description = "응답 메시지", example = "요청이 성공했습니다.")
        String message,

        @Schema(description = "응답 데이터")
        T data,

        @Schema(description = "필드 오류 목록")
        List<ApiFieldError> errors
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(
                true,
                "OK",
                "요청이 성공했습니다.",
                data,
                List.of()
        );
    }

    public static ApiResponse<Void> error(String code, String message, List<ApiFieldError> errors) {
        return new ApiResponse<>(
                false,
                code,
                message,
                null,
                errors
        );
    }
}
