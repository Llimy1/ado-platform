package com.ado.platform.api.common.api.docs;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target(METHOD)
@Retention(RUNTIME)
@ApiResponse(
        responseCode = "201",
        description = "생성 성공",
        useReturnTypeSchema = true,
        content = @Content(mediaType = "application/json")
)
public @interface CreatedResponse {
}
