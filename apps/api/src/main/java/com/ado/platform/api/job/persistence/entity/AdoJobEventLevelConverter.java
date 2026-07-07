package com.ado.platform.api.job.persistence.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AdoJobEventLevelConverter implements AttributeConverter<AdoJobEventLevel, String> {

    @Override
    public String convertToDatabaseColumn(AdoJobEventLevel attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public AdoJobEventLevel convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AdoJobEventLevel.fromValue(dbData);
    }
}
