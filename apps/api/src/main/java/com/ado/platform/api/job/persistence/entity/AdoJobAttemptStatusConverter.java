package com.ado.platform.api.job.persistence.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AdoJobAttemptStatusConverter implements AttributeConverter<AdoJobAttemptStatus, String> {

    @Override
    public String convertToDatabaseColumn(AdoJobAttemptStatus attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public AdoJobAttemptStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AdoJobAttemptStatus.fromValue(dbData);
    }
}
