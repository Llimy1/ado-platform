package com.ado.platform.api.job.persistence.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AdoArtifactStatusConverter implements AttributeConverter<AdoArtifactStatus, String> {

    @Override
    public String convertToDatabaseColumn(AdoArtifactStatus attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public AdoArtifactStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AdoArtifactStatus.fromValue(dbData);
    }
}
