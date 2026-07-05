package com.ado.platform.api.roadmap.api.docs;

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
        description = "로드맵 없음",
        content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.ado.platform.api.common.api.response.ApiResponse.class),
                examples = @ExampleObject(
                        name = "RoadmapNotFound",
                        value = """
                                {
                                  "success": false,
                                  "code": "ROADMAP_NOT_FOUND",
                                  "message": "로드맵을 찾을 수 없습니다.",
                                  "data": null,
                                  "errors": []
                                }
                                """
                )
        )
)
public @interface RoadmapNotFoundResponse {
}
