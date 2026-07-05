package com.ado.platform.api.common.api.error;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "요청 값이 올바르지 않습니다."),
    PROJECT_KEY_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 프로젝트 키입니다."),
    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND, "프로젝트를 찾을 수 없습니다."),
    ROADMAP_NOT_FOUND(HttpStatus.NOT_FOUND, "로드맵을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus status() {
        return status;
    }

    public String message() {
        return message;
    }
}
