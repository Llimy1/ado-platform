package com.ado.platform.api.job.api.dto;

import com.ado.platform.api.job.persistence.entity.AdoJobStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record AdoJobStatusUpdateRequest(
        @Schema(description = "변경할 Job 상태", example = "running")
        @NotNull(message = "Job 상태는 필수입니다.")
        AdoJobStatus status
) {
}
