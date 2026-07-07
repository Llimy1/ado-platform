package com.ado.platform.api.roadmap.persistence.repository;

import com.ado.platform.api.common.persistence.config.JpaAuditingConfig;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapEntity;
import com.ado.platform.api.roadmap.persistence.entity.AdoRoadmapStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@DataJpaTest(properties = {
        "spring.flyway.enabled=true",
        "spring.jpa.hibernate.ddl-auto=validate"
})
@Import(JpaAuditingConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class AdoRoadmapRepositoryTests {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18.4-alpine");

    @Autowired
    private AdoProjectRepository projectRepository;

    @Autowired
    private AdoRoadmapRepository roadmapRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("ADO 로드맵을 저장하고 조회")
    void savesAndFindsAdoRoadmap() {
        AdoProjectEntity project = projectRepository.saveAndFlush(
                AdoProjectEntity.create("ado-platform", "ADO Platform")
        );
        AdoRoadmapEntity saved = roadmapRepository.saveAndFlush(
                AdoRoadmapEntity.createDraft(project, "roadmap-foundation", "Roadmap Foundation", "Roadmap persistence foundation")
        );

        entityManager.flush();
        entityManager.clear();

        AdoRoadmapEntity found = roadmapRepository.findById(saved.getId()).orElseThrow();

        assertThat(found.getProject().getId()).isEqualTo(project.getId());
        assertThat(found.getRoadmapKey()).isEqualTo("roadmap-foundation");
        assertThat(found.getTitle()).isEqualTo("Roadmap Foundation");
        assertThat(found.getDescription()).isEqualTo("Roadmap persistence foundation");
        assertThat(found.getStatus()).isEqualTo(AdoRoadmapStatus.DRAFT);
        assertThat(found.getCreatedAt()).isNotNull();
        assertThat(found.getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("프로젝트 ID로 로드맵 목록을 조회")
    void findsRoadmapsByProjectId() {
        AdoProjectEntity firstProject = projectRepository.saveAndFlush(
                AdoProjectEntity.create("ado-platform", "ADO Platform")
        );
        AdoProjectEntity secondProject = projectRepository.saveAndFlush(
                AdoProjectEntity.create("another-project", "Another Project")
        );
        roadmapRepository.saveAndFlush(
                AdoRoadmapEntity.createDraft(firstProject, "first-roadmap", "First Roadmap", "First roadmap")
        );
        roadmapRepository.saveAndFlush(
                AdoRoadmapEntity.createDraft(firstProject, "second-roadmap", "Second Roadmap", "Second roadmap")
        );
        roadmapRepository.saveAndFlush(
                AdoRoadmapEntity.createDraft(secondProject, "other-roadmap", "Other Roadmap", "Other roadmap")
        );

        entityManager.flush();
        entityManager.clear();

        List<AdoRoadmapEntity> roadmaps = roadmapRepository.findByProjectProjectKeyOrderByRoadmapKeyAsc("ado-platform");

        assertThat(roadmaps)
                .extracting(AdoRoadmapEntity::getTitle)
                .containsExactly("First Roadmap", "Second Roadmap");
    }
}
