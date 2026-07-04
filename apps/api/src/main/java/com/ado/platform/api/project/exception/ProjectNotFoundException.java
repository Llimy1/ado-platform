package com.ado.platform.api.project.exception;

public class ProjectNotFoundException extends RuntimeException {

    public static final String CODE = "PROJECT_NOT_FOUND";
    public static final String MESSAGE = "프로젝트를 찾을 수 없습니다.";

    public ProjectNotFoundException() {
        super(MESSAGE);
    }
}
