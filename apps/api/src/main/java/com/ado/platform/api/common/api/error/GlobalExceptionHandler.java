package com.ado.platform.api.common.api.error;

import com.ado.platform.api.common.api.response.ApiFieldError;
import com.ado.platform.api.common.api.response.ApiResponse;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String ADO_PROJECT_PROJECT_KEY_CONSTRAINT = "ado_project_project_key_key";

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException exception) {
        ErrorCode errorCode = ErrorCode.VALIDATION_FAILED;
        List<ApiFieldError> fieldErrors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new ApiFieldError(error.getField(), error.getDefaultMessage()))
                .toList();

        return ApiResponse.error(
                errorCode.name(),
                errorCode.message(),
                fieldErrors
        );
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException exception) {
        ErrorCode errorCode = exception.errorCode();

        return toErrorResponse(errorCode);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolationException(
            DataIntegrityViolationException exception
    ) {
        if (isProjectKeyUniqueConstraintViolation(exception)) {
            return toErrorResponse(ErrorCode.PROJECT_KEY_ALREADY_EXISTS);
        }

        throw exception;
    }

    private ResponseEntity<ApiResponse<Void>> toErrorResponse(ErrorCode errorCode) {
        return ResponseEntity
                .status(errorCode.status())
                .body(ApiResponse.error(
                        errorCode.name(),
                        errorCode.message(),
                        List.of()
                ));
    }

    private boolean isProjectKeyUniqueConstraintViolation(Throwable exception) {
        Throwable current = exception;

        while (current != null) {
            if (current instanceof ConstraintViolationException constraintViolation
                    && ADO_PROJECT_PROJECT_KEY_CONSTRAINT.equals(constraintViolation.getConstraintName())) {
                return true;
            }

            if (current.getMessage() != null
                    && current.getMessage().contains(ADO_PROJECT_PROJECT_KEY_CONSTRAINT)) {
                return true;
            }

            current = current.getCause();
        }

        return false;
    }
}
