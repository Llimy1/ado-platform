package com.ado.platform.api.project.api.docs;

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
        responseCode = "404",
        description = "프로젝트 없음",
        content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.ado.platform.api.common.api.response.ApiResponse.class),
                examples = @ExampleObject(
                        name = "ProjectNotFound",
                        value = """
                                {
                                  "success": false,
                                  "code": "PROJECT_NOT_FOUND",
                                  "message": "프로젝트를 찾을 수 없습니다.",
                                  "data": null,
                                  "errors": []
                                }
                                """
                )
        )
)
public @interface ProjectNotFoundResponse {
}
