package com.jesus.inventory.product;


import com.jesus.inventory.common.ApiResponse;
import com.jesus.inventory.product.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ApiResponse<Void> saveProduct(ProductDTO productDTO, MultipartFile imageFile);
    ApiResponse<Void> updateProduct(ProductDTO productDTO, MultipartFile imageFile);
    ApiResponse<List<ProductDTO>> getAllProducts();
    ApiResponse<ProductDTO> getProductById(Long id);
    ApiResponse<Void> deleteProduct(Long id);


}
