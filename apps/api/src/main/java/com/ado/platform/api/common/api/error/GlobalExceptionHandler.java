package com.ado.platform.api.common.api.error;

import com.ado.platform.api.common.api.response.ApiFieldError;
import com.ado.platform.api.common.api.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

        return ResponseEntity
                .status(errorCode.status())
                .body(ApiResponse.error(
                        errorCode.name(),
                        errorCode.message(),
                        List.of()
                ));
    }
}
