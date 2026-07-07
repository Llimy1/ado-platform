package com.ado.platform.api.job.persistence.entity;

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
@Table(name = "ado_artifact")
public class AdoArtifactEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private AdoProjectEntity project;

    @Column(name = "artifact_key", nullable = false, length = 120)
    private String artifactKey;

    @Column(name = "artifact_type", nullable = false, length = 60)
    private AdoArtifactType artifactType;

    @Column(nullable = false, length = 30)
    private AdoArtifactStatus status;

    @Column(nullable = false, length = 30)
    private AdoArtifactClassification classification;

    @Column(name = "content_sha256", length = 64)
    private String contentSha256;

    @Column(name = "byte_size", nullable = false)
    private long byteSize;

    @Column(name = "storage_uri", length = 500)
    private String storageUri;

    @Builder(access = AccessLevel.PRIVATE)
    private AdoArtifactEntity(
            AdoProjectEntity project,
            String artifactKey,
            AdoArtifactType artifactType,
            AdoArtifactStatus status,
            AdoArtifactClassification classification,
            String contentSha256,
            long byteSize,
            String storageUri
    ) {
        this.project = project;
        this.artifactKey = artifactKey;
        this.artifactType = artifactType;
        this.status = status;
        this.classification = classification;
        this.contentSha256 = contentSha256;
        this.byteSize = byteSize;
        this.storageUri = storageUri;
    }

    public static AdoArtifactEntity create(
            AdoProjectEntity project,
            String artifactKey,
            AdoArtifactType artifactType,
            AdoArtifactClassification classification,
            String contentSha256,
            long byteSize,
            String storageUri
    ) {
        return AdoArtifactEntity.builder()
                .project(project)
                .artifactKey(artifactKey)
                .artifactType(artifactType)
                .status(AdoArtifactStatus.AVAILABLE)
                .classification(classification)
                .contentSha256(contentSha256)
                .byteSize(byteSize)
                .storageUri(storageUri)
                .build();
    }
}
