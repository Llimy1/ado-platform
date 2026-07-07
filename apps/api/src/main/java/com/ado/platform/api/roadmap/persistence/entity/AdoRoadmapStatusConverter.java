package com.ado.platform.api.roadmap.persistence.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AdoRoadmapStatusConverter implements AttributeConverter<AdoRoadmapStatus, String> {

    @Override
    public String convertToDatabaseColumn(AdoRoadmapStatus attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public AdoRoadmapStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : AdoRoadmapStatus.fromValue(dbData);
    }
}
