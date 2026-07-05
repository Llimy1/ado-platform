package com.ado.platform.api.roadmap.persistence.entity;

import com.ado.platform.api.common.persistence.entity.BaseTimeEntity;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "ado_roadmap")
public class AdoRoadmapEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private AdoProjectEntity project;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AdoRoadmapStatus status;

    @Builder(access = AccessLevel.PRIVATE)
    private AdoRoadmapEntity(
            AdoProjectEntity project,
            String title,
            String description,
            AdoRoadmapStatus status
    ) {
        this.project = project;
        this.title = title;
        this.description = description;
        this.status = status;
    }

    public static AdoRoadmapEntity createDraft(
            AdoProjectEntity project,
            String title,
            String description
    ) {
        return AdoRoadmapEntity.builder()
                .project(project)
                .title(title)
                .description(description)
                .status(AdoRoadmapStatus.DRAFT)
                .build();
    }

    public void updateDetails(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public void archive() {
        this.status = AdoRoadmapStatus.ARCHIVED;
    }
}
