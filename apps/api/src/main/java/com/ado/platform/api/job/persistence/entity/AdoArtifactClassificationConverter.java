package com.ado.platform.api.job.persistence.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AdoArtifactClassificationConverter implements AttributeConverter<AdoArtifactClassification, String> {

    @Override
    public String convertToDatabaseColumn(AdoArtifactClassification attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public AdoArtifactClassification convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AdoArtifactClassification.fromValue(dbData);
    }
}
