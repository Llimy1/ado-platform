package com.ado.platform.api.job.persistence.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AdoJobAttemptStatus {
    QUEUED("queued"),
    LEASED("leased"),
    RUNNING("running"),
    SUCCEEDED("succeeded"),
    FAILED("failed"),
    TIMED_OUT("timed_out"),
    CANCELLED("cancelled"),
    POLICY_DENIED("policy_denied"),
    BLOCKED("blocked"),
    HUMAN_REQUIRED("human_required");

    private final String value;

    AdoJobAttemptStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AdoJobAttemptStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(status -> status.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 Job Attempt 상태입니다."));
    }
}
