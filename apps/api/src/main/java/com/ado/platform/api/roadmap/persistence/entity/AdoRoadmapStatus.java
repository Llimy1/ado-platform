package com.ado.platform.api.roadmap.persistence.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum AdoRoadmapStatus {
    DRAFT("draft"),
    ACTIVE("active"),
    ARCHIVED("archived");

    private final String value;

    AdoRoadmapStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AdoRoadmapStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(status -> status.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 로드맵 상태입니다."));
    }
}
