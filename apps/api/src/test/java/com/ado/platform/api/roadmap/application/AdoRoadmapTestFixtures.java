package com.ado.platform.api.roadmap.application;

import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.UUID;

final class AdoRoadmapTestFixtures {

    static final UUID PROJECT_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f900");
    static final UUID ROADMAP_ID = UUID.fromString("018f4d0a-7b6e-7b64-9f4b-6f45a2c7f901");

    private AdoRoadmapTestFixtures() {
    }

    static AdoProjectEntity project() {
        AdoProjectEntity project = AdoProjectEntity.create("ado-platform", "ADO Platform");
        ReflectionTestUtils.setField(project, "id", PROJECT_ID);
        return project;
    }

    static AdoRoadmapEntity roadmap(AdoProjectEntity project, String roadmapKey, String title) {
        AdoRoadmapEntity roadmap = AdoRoadmapEntity.createDraft(
                project,
                roadmapKey,
                title,
                "Roadmap persistence and API foundation"
        );
        ReflectionTestUtils.setField(roadmap, "id", ROADMAP_ID);
        ReflectionTestUtils.setField(roadmap, "createdAt", Instant.parse("2026-07-05T00:34:40Z"));
        ReflectionTestUtils.setField(roadmap, "updatedAt", Instant.parse("2026-07-05T00:34:40Z"));
        return roadmap;
    }
}
