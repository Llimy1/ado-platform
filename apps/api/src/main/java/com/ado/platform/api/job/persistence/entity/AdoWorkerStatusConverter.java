package com.ado.platform.api.job.persistence.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AdoWorkerStatusConverter implements AttributeConverter<AdoWorkerStatus, String> {

    @Override
    public String convertToDatabaseColumn(AdoWorkerStatus attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public AdoWorkerStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AdoWorkerStatus.fromValue(dbData);
    }
}
