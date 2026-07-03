package com.ado.platform.api.runtime;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
class DatasourcePropertiesValidator {

    DatasourcePropertiesValidator(DataSourceProperties properties) {
        validateRequired("데이터베이스 URL", properties.getUrl());
        validateRequired("데이터베이스 사용자 이름", properties.getUsername());
        validateRequired("데이터베이스 비밀번호", properties.getPassword());
        validatePostgresJdbcUrl(properties.getUrl());
    }

    private void validateRequired(String label, String value) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalStateException(label + " 설정이 비어 있습니다.");
        }
    }

    private void validatePostgresJdbcUrl(String url) {
        if (!url.startsWith("jdbc:postgresql://")) {
            throw new IllegalStateException("데이터베이스 URL은 jdbc:postgresql:// 형식이어야 합니다.");
        }
    }
}
