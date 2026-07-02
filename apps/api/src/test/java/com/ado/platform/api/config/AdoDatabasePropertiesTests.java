package com.ado.platform.api.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import static org.assertj.core.api.Assertions.assertThat;

public class AdoDatabasePropertiesTests {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(TestConfig.class)
            .withPropertyValues(
                    "ado.database.url=jdbc:postgresql://localhost:5434/ado-platform",
                    "ado.database.username=ado",
                    "ado.database.password=ado"
            );

    @Test
    @DisplayName("DB 설정 바인드 성공")
    void bindsDatabaseProperties() {
        contextRunner.run(context -> {
            AdoDatabaseProperties properties = context.getBean(AdoDatabaseProperties.class);

            assertThat(properties.url()).isEqualTo("jdbc:postgresql://localhost:5434/ado-platform");
            assertThat(properties.username()).isEqualTo("ado");
            assertThat(properties.password()).isEqualTo("ado");
        });
    }

    @Test
    @DisplayName("DB 설정 바인드 실패")
    void failsWhenDatabasePropertiesAreBlank() {
        new ApplicationContextRunner()
                .withUserConfiguration(TestConfig.class)
                .withPropertyValues(
                        "ado.database.url=",
                        "ado.database.username=ado",
                        "ado.database.password=ado"
                ).run(context -> assertThat(context).hasFailed());
    }

    @EnableConfigurationProperties(AdoDatabaseProperties.class)
    static class TestConfig {}
}
