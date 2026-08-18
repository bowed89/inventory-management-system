package com.jesus.inventory.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;

    // pagination
    private Integer totalPages;
    private Long totalElement;

    private final LocalDateTime timestamp = LocalDateTime.now();

}
