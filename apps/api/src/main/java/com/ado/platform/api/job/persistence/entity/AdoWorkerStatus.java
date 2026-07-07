package com.ado.platform.api.job.persistence.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AdoWorkerStatus {
    STARTING("starting"),
    IDLE("idle"),
    RUNNING("running"),
    DRAINING("draining"),
    OFFLINE("offline"),
    STALE("stale");

    private final String value;

    AdoWorkerStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AdoWorkerStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(status -> status.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 Worker 상태입니다."));
    }
}
