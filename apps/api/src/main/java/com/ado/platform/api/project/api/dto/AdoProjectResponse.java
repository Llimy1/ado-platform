package com.ado.platform.api.project.api.dto;

import java.time.Instant;

public record AdoProjectResponse (
        Long id,
        String projectKey,
        String name,
        Instant createdAt,
        Instant updatedAt
) {}
