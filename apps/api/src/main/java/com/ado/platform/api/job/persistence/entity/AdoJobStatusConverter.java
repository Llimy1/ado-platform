package com.ado.platform.api.job.persistence.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AdoJobStatusConverter implements AttributeConverter<AdoJobStatus, String> {

    @Override
    public String convertToDatabaseColumn(AdoJobStatus attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public AdoJobStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AdoJobStatus.fromValue(dbData);
    }
}
