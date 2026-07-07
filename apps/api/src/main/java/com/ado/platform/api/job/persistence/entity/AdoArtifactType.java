package com.ado.platform.api.job.persistence.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AdoArtifactType {
    CONTEXT_PACKET("context_packet"),
    REVIEW_PACKET("review_packet"),
    CANDIDATE_ARTIFACT("candidate_artifact"),
    IMPLEMENTATION_ARTIFACT("implementation_artifact"),
    GIT_DIFF_ARTIFACT("git_diff_artifact"),
    COMMAND_RUN_LOG("command_run_log"),
    REVIEW_RESULT("review_result"),
    ARBITER_DECISION("arbiter_decision"),
    VERIFICATION_SUMMARY("verification_summary");

    private final String value;

    AdoArtifactType(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AdoArtifactType fromValue(String value) {
        return Arrays.stream(values())
                .filter(type -> type.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 Artifact 유형입니다."));
    }
}
