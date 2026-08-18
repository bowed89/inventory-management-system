package com.jesus.inventory.service;


import com.jesus.inventory.dto.ApiResponse;
import com.jesus.inventory.dto.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ApiResponse<Void> saveProduct(ProductDTO productDTO, MultipartFile imageFile);
    ApiResponse<Void> updateProduct(ProductDTO productDTO, MultipartFile imageFile);
    ApiResponse<List<ProductDTO>> getAllProducts();
    ApiResponse<ProductDTO> getProductById(Long id);
    ApiResponse<Void> deleteProduct(Long id);


}
