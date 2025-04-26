package com.example.autoship.exceptions;

import com.example.autoship.utils.ApiResponse;
import com.example.autoship.utils.ResponseBuilder;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

import static com.example.autoship.common.MessageKeys.*;

@RestControllerAdvice
@AllArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private final ResponseBuilder responseBuilder;

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleUserNotFoundException(UsernameNotFoundException ex){
        log.warn("User with email {} not found. Throwing UserNotFoundException.", ex.getMessage());
        return responseBuilder.buildResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
    }

    @ExceptionHandler(GithubRequestException.class)
    public ResponseEntity<ApiResponse<String>> handleGithubRequestException(GithubRequestException ex) {
        return responseBuilder.buildResponse(ex.getStatus(), ex.getStatus() == 404 ?  ERROR_RESOURCE_NOT_FOUND : ERROR_HOOK_EXIST);
    }

    @ExceptionHandler(InvalidJwtException.class)
    public ResponseEntity<ApiResponse<String>> handleInvalidJwtException(InvalidJwtException ex) {
        log.warn("Invalid JWT: {}", ex.getMessage());
        return responseBuilder.buildResponse(401,ex.getMessage());
    }

    @ExceptionHandler(DeploymentNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleDeploymentNotFoundException(DeploymentNotFoundException ex) {
        log.warn(ex.getMessage());
        return responseBuilder.buildResponse(404,ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(
                error -> errors.put(error.getField(), error.getDefaultMessage())
        );
        return responseBuilder.buildResponse(HttpStatus.BAD_REQUEST.value(),"Validation Error",errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGlobalException(Exception ex) {
        log.warn(ex.getMessage());
        return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), ERROR_UNEXPECTED_ERROR);
    }
}
