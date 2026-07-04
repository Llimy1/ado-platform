package com.ado.platform.api.project.persistence.entity;

import com.ado.platform.api.common.persistence.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "ado_project")
public class AdoProjectEntity extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_key", nullable = false, length = 80, unique = true)
    private String projectKey;

    @Column(nullable = false, length = 200)
    private String name;

    @Builder(access = AccessLevel.PRIVATE)
    private AdoProjectEntity(String projectKey, String name) {
        this.projectKey = projectKey;
        this.name = name;
    }

    public static AdoProjectEntity create(String projectKey, String name) {
        return AdoProjectEntity.builder()
                .projectKey(projectKey)
                .name(name)
                .build();
    }
}
