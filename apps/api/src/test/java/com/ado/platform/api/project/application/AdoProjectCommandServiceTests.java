package com.ado.platform.api.project.application;

import com.ado.platform.api.project.api.dto.AdoProjectCreateRequest;
import com.ado.platform.api.project.exception.DuplicateProjectKeyException;
import com.ado.platform.api.project.persistence.repository.AdoProjectRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
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

        assertThatThrownBy(() -> commandService.createProject(request))
                .isInstanceOf(DuplicateProjectKeyException.class)
                .hasMessage("이미 존재하는 프로젝트 키입니다.");

        then(repository).should().existsByProjectKey("ado-platform");
        then(repository).should(never()).save(org.mockito.ArgumentMatchers.any());
    }
}
