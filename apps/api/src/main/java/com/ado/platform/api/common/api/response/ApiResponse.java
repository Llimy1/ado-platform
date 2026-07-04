package com.ado.platform.api.common.api.response;

import java.util.List;

public record ApiResponse<T>(
        boolean success,
        String code,
        String message,
        T data,
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
