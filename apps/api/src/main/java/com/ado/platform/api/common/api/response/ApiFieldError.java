package com.ado.platform.api.common.api.response;

public record ApiFieldError(
        String field,
        String message
) {
}
