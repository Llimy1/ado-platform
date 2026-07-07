package com.ado.platform.api.job.persistence.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AdoArtifactClassification {
    INTERNAL("internal"),
    RESTRICTED("restricted");

    private final String value;

    AdoArtifactClassification(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AdoArtifactClassification fromValue(String value) {
        return Arrays.stream(values())
                .filter(classification -> classification.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 Artifact 분류입니다."));
    }
}
