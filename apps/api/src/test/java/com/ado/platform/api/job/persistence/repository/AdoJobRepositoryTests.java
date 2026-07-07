package com.ado.platform.api.job.persistence.repository;

import com.ado.platform.api.common.persistence.config.JpaAuditingConfig;
import com.ado.platform.api.job.persistence.entity.AdoJobEntity;
import com.ado.platform.api.job.persistence.entity.AdoJobStatus;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
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
public class AdoJobRepositoryTests {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18.4-alpine");

    @Autowired
    private AdoProjectRepository projectRepository;

    @Autowired
    private AdoJobRepository jobRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("ADO Job을 저장하고 조회")
    void savesAndFindsAdoJob() {
        AdoProjectEntity project = projectRepository.saveAndFlush(
                AdoProjectEntity.create("ado-platform", "ADO Platform")
        );
        AdoJobEntity saved = jobRepository.saveAndFlush(
                AdoJobEntity.createPending(project, "Run backend verification", "Run API tests")
        );

        entityManager.flush();
        entityManager.clear();

        AdoJobEntity found = jobRepository.findById(saved.getId()).orElseThrow();

        assertThat(found.getProject().getId()).isEqualTo(project.getId());
        assertThat(found.getJobKey()).isNotBlank();
        assertThat(found.getIdempotencyKey()).isNotBlank();
        assertThat(found.getJobType().value()).isEqualTo("codex_implementation");
        assertThat(found.getTargetType().value()).isEqualTo("project");
        assertThat(found.getTargetRef()).isEqualTo("ado-platform");
        assertThat(found.getTitle()).isEqualTo("Run backend verification");
        assertThat(found.getDescription()).isEqualTo("Run API tests");
        assertThat(found.getStatus()).isEqualTo(AdoJobStatus.QUEUED);
        assertThat(found.getScheduledAt()).isNotNull();
        assertThat(found.getCreatedAt()).isNotNull();
        assertThat(found.getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("프로젝트 ID로 Job 목록을 조회")
    void findsJobsByProjectId() {
        AdoProjectEntity firstProject = projectRepository.saveAndFlush(
                AdoProjectEntity.create("ado-platform", "ADO Platform")
        );
        AdoProjectEntity secondProject = projectRepository.saveAndFlush(
                AdoProjectEntity.create("another-project", "Another Project")
        );
        jobRepository.saveAndFlush(
                AdoJobEntity.createPending(firstProject, "First Job", "First job")
        );
        jobRepository.saveAndFlush(
                AdoJobEntity.createPending(firstProject, "Second Job", "Second job")
        );
        jobRepository.saveAndFlush(
                AdoJobEntity.createPending(secondProject, "Other Job", "Other job")
        );

        entityManager.flush();
        entityManager.clear();

        List<AdoJobEntity> jobs = jobRepository.findByProjectProjectKeyOrderByPriorityAscScheduledAtAscCreatedAtAscIdAsc("ado-platform");

        assertThat(jobs)
                .extracting(AdoJobEntity::getTitle)
                .containsExactly("First Job", "Second Job");
    }
}
