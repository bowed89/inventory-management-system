package com.jesus.inventory.controller;

import com.jesus.inventory.dto.Response;
import com.jesus.inventory.security.AuthFilter;
import com.jesus.inventory.security.SecurityFilter;
import com.jesus.inventory.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = ProductController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = {AuthFilter.class, SecurityFilter.class}
        )
)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductService productService;

    @Test
    void saveProduct_rejectsMissingRequiredFields() throws Exception {
        MockMultipartFile image = new MockMultipartFile("imageFile", "logo.png", "image/png", "bytes".getBytes());

        mockMvc.perform(multipart("/api/products/add")
                        .file(image)
                        .param("price", "10.0")
                        .param("stockQuantity", "5"))
                .andExpect(status().isBadRequest());

        verify(productService, never()).saveProduct(any(), any());
    }

    @Test
    void saveProduct_acceptsValidPayload() throws Exception {
        MockMultipartFile image = new MockMultipartFile("imageFile", "logo.png", "image/png", "bytes".getBytes());
        when(productService.saveProduct(any(), any()))
                .thenReturn(Response.builder().status(200).message("ok").build());

        mockMvc.perform(multipart("/api/products/add")
                        .file(image)
                        .param("name", "Widget")
                        .param("sku", "SKU-1")
                        .param("price", "10.0")
                        .param("stockQuantity", "5")
                        .param("categoryId", "1"))
                .andExpect(status().isOk());

        verify(productService).saveProduct(any(), any());
    }
}
