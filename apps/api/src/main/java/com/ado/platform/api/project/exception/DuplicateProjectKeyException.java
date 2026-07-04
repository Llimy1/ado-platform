package com.ado.platform.api.project.exception;

public class DuplicateProjectKeyException extends RuntimeException {

    public static final String CODE = "PROJECT_KEY_ALREADY_EXISTS";
    public static final String MESSAGE = "이미 존재하는 프로젝트 키입니다.";

    public DuplicateProjectKeyException() {
        super(MESSAGE);
    }
}
