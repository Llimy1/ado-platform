package com.ado.platform.api.job.persistence.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AdoJobTypeConverter implements AttributeConverter<AdoJobType, String> {

    @Override
    public String convertToDatabaseColumn(AdoJobType attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public AdoJobType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AdoJobType.fromValue(dbData);
    }
}
