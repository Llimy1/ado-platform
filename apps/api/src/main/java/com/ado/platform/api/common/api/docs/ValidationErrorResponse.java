package com.ado.platform.api.common.api.docs;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target(METHOD)
@Retention(RUNTIME)
@ApiResponse(
        responseCode = "400",
        description = "요청 값 검증 실패",
        content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.ado.platform.api.common.api.response.ApiResponse.class),
                examples = @ExampleObject(
                        name = "ValidationFailed",
                        value = """
                                {
                                  "success": false,
                                  "code": "VALIDATION_FAILED",
                                  "message": "요청 값이 올바르지 않습니다.",
                                  "data": null,
                                  "errors": [
                                    {
                                      "field": "projectKey",
                                      "message": "프로젝트 키는 필수입니다."
                                    }
                                  ]
                                }
                                """
                )
        )
)
public @interface ValidationErrorResponse {
}
