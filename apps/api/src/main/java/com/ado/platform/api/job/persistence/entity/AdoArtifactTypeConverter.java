package com.ado.platform.api.job.persistence.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AdoArtifactTypeConverter implements AttributeConverter<AdoArtifactType, String> {

    @Override
    public String convertToDatabaseColumn(AdoArtifactType attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public AdoArtifactType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AdoArtifactType.fromValue(dbData);
    }
}
