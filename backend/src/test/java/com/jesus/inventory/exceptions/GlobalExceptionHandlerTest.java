package com.jesus.inventory.exceptions;

import com.jesus.inventory.dto.Response;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleAllExceptions_returns500WithMatchingBodyStatus() {
        ResponseEntity<Response> result = handler.handleAllExceptions(new RuntimeException("boom"));

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(result.getBody().getStatus()).isEqualTo(500);
        assertThat(result.getBody().getMessage()).isEqualTo("boom");
    }

    @Test
    void handleNotFoundExceptions_returns404WithMatchingBodyStatus() {
        ResponseEntity<Response> result = handler.handleNotFoundExceptions(new NotFoundException("Product Not Found"));

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(result.getBody().getStatus()).isEqualTo(404);
    }

    @Test
    void handleNameValueRequiredException_returns400() {
        ResponseEntity<Response> result =
                handler.handleNameValueRequiredException(new NameValueRequiredException("Supplier ID is required"));

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(result.getBody().getStatus()).isEqualTo(400);
    }

    @Test
    void handleInvalidCredentialsException_returns401() {
        ResponseEntity<Response> result =
                handler.handleInvalidCredentialsException(new InvalidCredentialsException("Bad credentials"));

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(result.getBody().getStatus()).isEqualTo(401);
    }

    @Test
    void handleInsufficientStockException_returns400() {
        ResponseEntity<Response> result =
                handler.handleInsufficientStockException(new InsufficientStockException("Not enough stock"));

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(result.getBody().getStatus()).isEqualTo(400);
    }

    @Test
    void handleMethodArgumentNotValidException_joinsFieldErrorMessages() {
        BindingResult bindingResult = mock(BindingResult.class);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(
                new FieldError("productDTO", "name", "Name is required"),
                new FieldError("productDTO", "sku", "Sku is required")
        ));
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        when(ex.getBindingResult()).thenReturn(bindingResult);

        ResponseEntity<Response> result = handler.handleMethodArgumentNotValidException(ex);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(result.getBody().getMessage()).contains("Name is required").contains("Sku is required");
    }
}
