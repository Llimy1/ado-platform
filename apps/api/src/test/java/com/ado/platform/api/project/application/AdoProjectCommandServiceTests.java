package com.ado.platform.api.project.application;

import com.ado.platform.api.common.api.error.BusinessException;
import com.ado.platform.api.common.api.error.ErrorCode;
import com.ado.platform.api.project.api.dto.AdoProjectCreateRequest;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
public class AdoProjectCommandServiceTests {

    @Mock
    private AdoProjectRepository repository;

    @InjectMocks
    private AdoProjectCommandService commandService;

    @Test
    @DisplayName("프로젝트 키가 이미 존재하면 저장하지 않고 실패")
    void failsBeforeSaveWhenProjectKeyAlreadyExists() {
        AdoProjectCreateRequest request = new AdoProjectCreateRequest("ado-platform", "ADO Platform");

        given(repository.existsByProjectKey("ado-platform")).willReturn(true);

        Throwable thrown = catchThrowable(() -> commandService.createProject(request));

        assertThat(thrown)
                .isInstanceOf(BusinessException.class)
                .hasMessage("이미 존재하는 프로젝트 키입니다.");
        assertThat(((BusinessException) thrown).errorCode()).isEqualTo(ErrorCode.PROJECT_KEY_ALREADY_EXISTS);

        then(repository).should().existsByProjectKey("ado-platform");
        then(repository).should(never()).save(org.mockito.ArgumentMatchers.any());
    }
}
