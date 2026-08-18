package com.jesus.inventory.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductDTO {
    private Long id;

    private Long productId;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private Long supplierId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Sku is required")
    private String sku;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be a positive value")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @PositiveOrZero(message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    private String description;

    private String imageUrl;

    private LocalDateTime expiryDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
