package com.ado.platform.api.job.application;

import com.ado.platform.api.job.persistence.entity.AdoJobEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobAttemptEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobTargetType;
import com.ado.platform.api.job.persistence.entity.AdoJobType;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.UUID;

final class AdoJobTestFixtures {

    static final UUID PROJECT_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f900");
    static final UUID JOB_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f902");
    static final UUID JOB_ATTEMPT_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f903");
    static final String JOB_KEY = "job-ado-api-contract-001";
    static final String IDEMPOTENCY_KEY = "idem-ado-api-contract-001";

    private AdoJobTestFixtures() {
    }

    static AdoProjectEntity project() {
        AdoProjectEntity project = AdoProjectEntity.create("ado-platform", "ADO Platform");
        ReflectionTestUtils.setField(project, "id", PROJECT_ID);
        return project;
    }

    static AdoJobEntity job(AdoProjectEntity project, String title) {
        AdoJobEntity job = AdoJobEntity.createQueued(
                project,
                null,
                JOB_KEY,
                IDEMPOTENCY_KEY,
                AdoJobType.CODEX_IMPLEMENTATION,
                AdoJobTargetType.PROJECT,
                "ado-platform",
                title,
                "Run API tests",
                100,
                Instant.parse("2026-07-05T01:41:29Z")
        );
        ReflectionTestUtils.setField(job, "id", JOB_ID);
        ReflectionTestUtils.setField(job, "createdAt", Instant.parse("2026-07-05T01:41:29Z"));
        ReflectionTestUtils.setField(job, "updatedAt", Instant.parse("2026-07-05T01:41:29Z"));
        return job;
    }

    static AdoJobAttemptEntity attempt(AdoJobEntity job) {
        AdoJobAttemptEntity attempt = AdoJobAttemptEntity.createQueued(job, 1);
        ReflectionTestUtils.setField(attempt, "id", JOB_ATTEMPT_ID);
        ReflectionTestUtils.setField(attempt, "createdAt", Instant.parse("2026-07-05T01:41:29Z"));
        ReflectionTestUtils.setField(attempt, "updatedAt", Instant.parse("2026-07-05T01:41:29Z"));
        return attempt;
    }
}
