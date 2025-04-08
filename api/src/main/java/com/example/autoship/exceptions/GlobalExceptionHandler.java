package com.example.autoship.exceptions;

import com.example.autoship.utils.ApiResponse;
import com.example.autoship.utils.ResponseBuilder;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
        return responseBuilder.buildResponse(ex.getStatus(), ex.getStatus() == 404 ?  ERROR_REPO_NOT_FOUND : ERROR_HOOK_EXIST);
    }

    @ExceptionHandler(InvalidJwtException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidJwtException(InvalidJwtException ex) {
        log.warn("Invalid JWT: {}", ex.getMessage());
        return responseBuilder.buildResponse(401,ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGlobalException(Exception ex) {
        return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
    }
}
