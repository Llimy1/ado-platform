package com.ado.platform.api.project.persistence.repository;


import com.ado.platform.api.common.persistence.config.JpaAuditingConfig;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
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

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@DataJpaTest(properties = {
        "spring.flyway.enabled=true",
        "spring.jpa.hibernate.ddl-auto=validate"
})
@Import(JpaAuditingConfig.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class AdoProjectRepositoryTests {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18.4-alpine");

    @Autowired
    private AdoProjectRepository repository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("ADO 프로젝트를 저장하고 조회")
    void savesAndFindsAdoProject() {
        AdoProjectEntity saved = repository.saveAndFlush(
                AdoProjectEntity.create("ado-platform", "ADO Platform")
        );

        entityManager.flush();
        entityManager.clear();

        AdoProjectEntity found = repository.findById(saved.getId()).orElseThrow();

        assertThat(found.getProjectKey()).isEqualTo("ado-platform");
        assertThat(found.getName()).isEqualTo("ADO Platform");
        assertThat(found.getCreatedAt()).isNotNull();
    }
}
