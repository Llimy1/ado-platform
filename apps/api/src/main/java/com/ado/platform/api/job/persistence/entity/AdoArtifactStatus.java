package com.ado.platform.api.job.persistence.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AdoArtifactStatus {
    AVAILABLE("available"),
    QUARANTINED("quarantined"),
    EXPIRED("expired"),
    DELETED("deleted"),
    REDACTION_FAILED("redaction_failed");

    private final String value;

    AdoArtifactStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AdoArtifactStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(status -> status.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 Artifact 상태입니다."));
    }
}
