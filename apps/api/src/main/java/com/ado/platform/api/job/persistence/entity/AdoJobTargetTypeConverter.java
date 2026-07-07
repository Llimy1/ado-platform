package com.ado.platform.api.job.persistence.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AdoJobTargetTypeConverter implements AttributeConverter<AdoJobTargetType, String> {

    @Override
    public String convertToDatabaseColumn(AdoJobTargetType attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public AdoJobTargetType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AdoJobTargetType.fromValue(dbData);
    }
}
