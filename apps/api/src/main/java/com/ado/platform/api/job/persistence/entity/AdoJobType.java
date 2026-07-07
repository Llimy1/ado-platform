package com.ado.platform.api.job.persistence.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AdoJobType {
    DOCUMENT_GENERATION("document_generation"),
    ARTIFACT_VALIDATE("artifact_validate"),
    CODEX_PLANNING("codex_planning"),
    GIT_PREPARE("git_prepare"),
    CODEX_IMPLEMENTATION("codex_implementation"),
    VERIFICATION("verification"),
    LOCAL_REVIEW_SINGLE_MODEL("local_review_single_model"),
    ARBITER_REVIEW("arbiter_review"),
    GITHUB_PR_CREATE("github_pr_create"),
    CLAUDE_IMPORT("claude_import");

    private final String value;

    AdoJobType(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AdoJobType fromValue(String value) {
        return Arrays.stream(values())
                .filter(type -> type.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 Job 유형입니다."));
    }
}
