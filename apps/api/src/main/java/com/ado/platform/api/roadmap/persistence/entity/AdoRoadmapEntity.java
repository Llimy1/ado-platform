package com.ado.platform.api.roadmap.persistence.entity;

import com.ado.platform.api.common.persistence.entity.BaseTimeEntity;
import com.ado.platform.api.project.persistence.entity.AdoProjectEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "ado_roadmap")
public class AdoRoadmapEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private AdoProjectEntity project;

    @Column(name = "roadmap_key", nullable = false, length = 80)
    private String roadmapKey;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, length = 30)
    private AdoRoadmapStatus status;

    @Builder(access = AccessLevel.PRIVATE)
    private AdoRoadmapEntity(
            AdoProjectEntity project,
            String roadmapKey,
            String title,
            String description,
            AdoRoadmapStatus status
    ) {
        this.project = project;
        this.roadmapKey = roadmapKey;
        this.title = title;
        this.description = description;
        this.status = status;
    }

    public static AdoRoadmapEntity createDraft(
            AdoProjectEntity project,
            String roadmapKey,
            String title,
            String description
    ) {
        return AdoRoadmapEntity.builder()
                .project(project)
                .roadmapKey(roadmapKey)
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
