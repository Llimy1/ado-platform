package com.ado.platform.api.common.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI adoOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ADO Platform API")
                        .version("v1")
                        .description("Agent Development Orchestrator API"));
    }
}
