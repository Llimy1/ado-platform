package com.ado.platform.api.job.persistence.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AdoJobTargetType {
    PROJECT("project"),
    ROADMAP("roadmap"),
    FEATURE_UNIT("feature_unit"),
    COMPONENT_WORK("component_work"),
    ARTIFACT("artifact"),
    REVIEW_GROUP("review_group"),
    VERIFICATION_RUN("verification_run");

    private final String value;

    AdoJobTargetType(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AdoJobTargetType fromValue(String value) {
        return Arrays.stream(values())
                .filter(type -> type.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 Job 대상 유형입니다."));
    }
}
