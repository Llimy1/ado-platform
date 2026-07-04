package com.ado.platform.api.runtime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static org.assertj.core.api.Assertions.assertThat;

public class DatasourcePropertiesValidatorTests {

    @Test
    @DisplayName("DB URL 설정이 비어 있으면 실패한다")
    void failsWhenDatasourceUrlIsBlank() {
        new ApplicationContextRunner()
                .withUserConfiguration(TestConfig.class)
                .withPropertyValues(
                        "spring.datasource.url=",
                        "spring.datasource.username=ado",
                        "spring.datasource.password=ado"
                ).run(context -> {
                    assertThat(context).hasFailed();
                    assertThat(context.getStartupFailure()).hasMessageContaining("데이터베이스 URL 설정이 비어 있습니다.");
                });
    }

    @Test
    @DisplayName("DB 사용자 이름이 비어 있으면 실패한다")
    void failsWhenDatasourceUsernameIsBlank() {
        new ApplicationContextRunner()
                .withUserConfiguration(TestConfig.class)
                .withPropertyValues(
                        "spring.datasource.url=jdbc:postgresql://localhost:5434/ado_platform",
                        "spring.datasource.username=",
                        "spring.datasource.password=ado"
                ).run(context -> {
                    assertThat(context).hasFailed();
                    assertThat(context.getStartupFailure()).hasMessageContaining("데이터베이스 사용자 이름 설정이 비어 있습니다.");
                });
    }

    @Test
    @DisplayName("DB 비밀번호가 비어 있으면 실패한다")
    void failsWhenDatasourcePasswordIsBlank() {
        new ApplicationContextRunner()
                .withUserConfiguration(TestConfig.class)
                .withPropertyValues(
                        "spring.datasource.url=jdbc:postgresql://localhost:5434/ado_platform",
                        "spring.datasource.username=ado",
                        "spring.datasource.password="
                ).run(context -> {
                    assertThat(context).hasFailed();
                    assertThat(context.getStartupFailure()).hasMessageContaining("데이터베이스 비밀번호 설정이 비어 있습니다.");
                });
    }


    @Test
    @DisplayName("DB URL이 PostgreSQL JDBC 형식이 아니면 실패한다")
    void failsWhenDatasourceUrlIsNotPostgresJdbcUrl() {
        new ApplicationContextRunner()
                .withUserConfiguration(TestConfig.class)
                .withPropertyValues(
                        "spring.datasource.url=jdbc:mysql://localhost:5434/ado_platform",
                        "spring.datasource.username=ado",
                        "spring.datasource.password=ado"
                ).run(context -> {
                    assertThat(context).hasFailed();
                    assertThat(context.getStartupFailure()).hasMessageContaining("데이터베이스 URL은 jdbc:postgresql:// 형식이어야 합니다.");
                });
    }

    @Test
    @DisplayName("DB 설정이 유효하면 성공한다")
    void succeedsWhenDatasourcePropertiesAreValid() {
        new ApplicationContextRunner()
                .withUserConfiguration(TestConfig.class)
                .withPropertyValues(
                        "spring.datasource.url=jdbc:postgresql://localhost:5434/ado_platform",
                        "spring.datasource.username=ado",
                        "spring.datasource.password=ado"
                )
                .run(context -> assertThat(context).hasNotFailed());
    }

    @Configuration
    @EnableConfigurationProperties(DataSourceProperties.class)
    static class TestConfig {

        @Bean
        DatasourcePropertiesValidator datasourcePropertiesValidator(DataSourceProperties properties) {
            return new DatasourcePropertiesValidator(properties);
        }
    }

}
