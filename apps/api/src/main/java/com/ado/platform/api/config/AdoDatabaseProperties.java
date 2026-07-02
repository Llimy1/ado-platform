package com.ado.platform.api.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "ado.database")
public record AdoDatabaseProperties (@NotBlank String url, @NotBlank String username, @NotBlank String password) {}

