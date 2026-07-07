package com.ado.platform.api.job.api.docs;

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
        responseCode = "409",
        description = "허용되지 않는 Job 상태 전이",
        content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.ado.platform.api.common.api.response.ApiResponse.class),
                examples = @ExampleObject(
                        name = "InvalidJobStatusTransition",
                        value = """
                                {
                                  "success": false,
                                  "code": "INVALID_JOB_STATUS_TRANSITION",
                                  "message": "Job 상태를 변경할 수 없습니다.",
                                  "data": null,
                                  "errors": []
                                }
                                """
                )
        )
)
public @interface InvalidJobStatusTransitionResponse {
}
