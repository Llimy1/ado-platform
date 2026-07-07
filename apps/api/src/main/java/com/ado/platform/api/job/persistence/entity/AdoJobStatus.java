package com.ado.platform.api.job.persistence.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AdoJobStatus {
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

    AdoJobStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AdoJobStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(status -> status.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 Job 상태입니다."));
    }

    public boolean canTransitionTo(AdoJobStatus nextStatus) {
        if (this == nextStatus) {
            return true;
        }

        return switch (this) {
            case QUEUED -> nextStatus == LEASED || nextStatus == CANCELLED || nextStatus == POLICY_DENIED
                    || nextStatus == BLOCKED || nextStatus == HUMAN_REQUIRED;
            case LEASED -> nextStatus == RUNNING || nextStatus == CANCELLED || nextStatus == POLICY_DENIED
                    || nextStatus == BLOCKED || nextStatus == HUMAN_REQUIRED;
            case RUNNING -> nextStatus == SUCCEEDED || nextStatus == FAILED || nextStatus == TIMED_OUT
                    || nextStatus == CANCELLED || nextStatus == BLOCKED || nextStatus == HUMAN_REQUIRED;
            case SUCCEEDED, FAILED, TIMED_OUT, CANCELLED, POLICY_DENIED, BLOCKED, HUMAN_REQUIRED -> false;
        };
    }
}
