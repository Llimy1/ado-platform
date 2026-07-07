package com.ado.platform.api.job.persistence.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AdoJobEventLevel {
    INFO("info"),
    WARN("warn"),
    ERROR("error");

    private final String value;

    AdoJobEventLevel(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AdoJobEventLevel fromValue(String value) {
        return Arrays.stream(values())
                .filter(level -> level.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 Job 이벤트 레벨입니다."));
    }
}
