package com.ado.platform.api.job.persistence.entity;

import com.ado.platform.api.common.persistence.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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
@Table(name = "ado_context_packet")
public class AdoContextPacketEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @UuidGenerator
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "artifact_id", nullable = false)
    private AdoArtifactEntity artifact;

    @Column(name = "target_type", nullable = false, length = 60)
    private AdoJobTargetType targetType;

    @Column(name = "target_ref", nullable = false, length = 200)
    private String targetRef;

    @Column(name = "packet_role", nullable = false, length = 60)
    private String packetRole;

    @Column(name = "context_hash", nullable = false, length = 64)
    private String contextHash;

    @Builder(access = AccessLevel.PRIVATE)
    private AdoContextPacketEntity(
            AdoArtifactEntity artifact,
            AdoJobTargetType targetType,
            String targetRef,
            String packetRole,
            String contextHash
    ) {
        this.artifact = artifact;
        this.targetType = targetType;
        this.targetRef = targetRef;
        this.packetRole = packetRole;
        this.contextHash = contextHash;
    }

    public static AdoContextPacketEntity create(
            AdoArtifactEntity artifact,
            AdoJobTargetType targetType,
            String targetRef,
            String packetRole,
            String contextHash
    ) {
        return AdoContextPacketEntity.builder()
                .artifact(artifact)
                .targetType(targetType)
                .targetRef(targetRef)
                .packetRole(packetRole)
                .contextHash(contextHash)
                .build();
    }
}
