package com.ado.platform.api.common.api.error;

import com.ado.platform.api.common.api.response.ApiFieldError;
import com.ado.platform.api.common.api.response.ApiResponse;
import com.ado.platform.api.project.exception.DuplicateProjectKeyException;
import com.ado.platform.api.project.exception.ProjectNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException exception) {
        List<ApiFieldError> fieldErrors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new ApiFieldError(error.getField(), error.getDefaultMessage()))
                .toList();

        return ApiResponse.error(
                "VALIDATION_FAILED",
                "요청 값이 올바르지 않습니다.",
                fieldErrors
        );
    }

    @ExceptionHandler(DuplicateProjectKeyException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse<Void> handleDuplicateProjectKeyException(DuplicateProjectKeyException exception) {
        return ApiResponse.error(
                DuplicateProjectKeyException.CODE,
                DuplicateProjectKeyException.MESSAGE,
                List.of()
        );
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Void> handleProjectNotFoundException(ProjectNotFoundException exception) {
        return ApiResponse.error(
                ProjectNotFoundException.CODE,
                ProjectNotFoundException.MESSAGE,
                List.of()
        );
    }
}
