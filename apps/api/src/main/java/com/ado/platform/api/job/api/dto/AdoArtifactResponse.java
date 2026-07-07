package com.ado.platform.api.job.api.dto;

import com.ado.platform.api.job.persistence.entity.AdoArtifactClassification;
import com.ado.platform.api.job.persistence.entity.AdoArtifactStatus;
import com.ado.platform.api.job.persistence.entity.AdoArtifactType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "ADO Artifact 응답")
public record AdoArtifactResponse(
        @Schema(description = "Artifact ID", example = "018f4d0a-7b6e-7b64-9f4b-6f45a2c7f904")
        UUID id,

        @Schema(description = "Artifact key", example = "ctx-ado-api-contract-001")
        String artifactKey,

        @Schema(description = "Artifact 유형", example = "context_packet")
        AdoArtifactType artifactType,

        @Schema(description = "Artifact 상태", example = "available")
        AdoArtifactStatus status,

        @Schema(description = "Artifact 분류", example = "internal")
        AdoArtifactClassification classification,

        @Schema(description = "내용 SHA-256")
        String contentSha256,

        @Schema(description = "byte 크기", example = "1024")
        long byteSize,

        @Schema(description = "저장 위치. 브라우저에 직접 노출할 수 없는 값일 수 있습니다.")
        String storageUri,

        @Schema(description = "생성 일시", example = "2026-07-06T01:00:00Z")
        Instant createdAt
) {
}
