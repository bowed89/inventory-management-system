package com.jesus.inventory.service.impl;

import com.jesus.inventory.dto.ApiResponse;
import com.jesus.inventory.dto.ProductDTO;
import com.jesus.inventory.entity.Category;
import com.jesus.inventory.entity.Product;
import com.jesus.inventory.exceptions.NotFoundException;
import com.jesus.inventory.repository.CategoryRepository;
import com.jesus.inventory.repository.ProductRepository;
import com.jesus.inventory.service.ImageStorageService;
import com.jesus.inventory.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final CategoryRepository categoryRepository;
    private final ImageStorageService imageStorageService;

    @Override
    public ApiResponse<Void> saveProduct(ProductDTO productDTO, MultipartFile imageFile) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(()-> new NotFoundException("Category Not Found"));

        Product productToSave = Product.builder()
                .name(productDTO.getName())
                .sku(productDTO.getSku())
                .price(productDTO.getPrice())
                .stockQuantity(productDTO.getStockQuantity())
                .description(productDTO.getDescription())
                .category(category)
                .build();

        if(imageFile != null) {
            String imagePath = imageStorageService.store(imageFile);
            productToSave.setImageUrl(imagePath);
        }

        productRepository.save(productToSave);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Product Saved Successfully")
                .build();

    }

    @Override
    public ApiResponse<Void> updateProduct(ProductDTO productDTO, MultipartFile imageFile) {
        Product extistingProduct = productRepository.findById(productDTO.getProductId())
                .orElseThrow(()-> new NotFoundException("Product Not Found"));

        // check if img is associated with the update request
        if(imageFile != null && !imageFile.isEmpty()) {
            String imagePath = imageStorageService.store(imageFile);
            extistingProduct.setImageUrl(imagePath);
        }
        // check if category will be changed for the product
        if(productDTO.getCategoryId() != null && productDTO.getCategoryId() > 0) {

            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(()-> new NotFoundException("Category Not Found"));

            extistingProduct.setCategory(category);

        }

        // check and update fields
        if(productDTO.getName() != null && !productDTO.getName().isBlank()) {
            extistingProduct.setName(productDTO.getName());
        }

        if(productDTO.getSku() != null && !productDTO.getSku().isBlank()) {
            extistingProduct.setSku(productDTO.getSku());
        }

        if(productDTO.getDescription() != null && !productDTO.getDescription().isBlank()) {
            extistingProduct.setDescription(productDTO.getDescription());
        }

        if(productDTO.getPrice() != null && productDTO.getPrice().compareTo(BigDecimal.ZERO) >= 0) {
            extistingProduct.setPrice(productDTO.getPrice());
        }

        if(productDTO.getStockQuantity() != null && productDTO.getStockQuantity() >= 0) {
            extistingProduct.setStockQuantity(productDTO.getStockQuantity());
        }

        productRepository.save(extistingProduct);


        return ApiResponse.<Void>builder()
                .status(200)
                .message("Product Updated Successfully")
                .build();
    }

    @Override
    public ApiResponse<List<ProductDTO>> getAllProducts() {
        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<ProductDTO> productDTOS = modelMapper.map(products, new TypeToken<List<ProductDTO>>() {}.getType());

        return ApiResponse.<List<ProductDTO>>builder()
                .status(200)
                .message("Success")
                .data(productDTOS)
                .build();
    }

    @Override
    public ApiResponse<ProductDTO> getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Product Not Found"));

        return ApiResponse.<ProductDTO>builder()
                .status(200)
                .message("Success")
                .data(modelMapper.map(product, ProductDTO.class))
                .build();
    }

    @Override
    public ApiResponse<Void> deleteProduct(Long id) {
        productRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Product Not Found"));

        productRepository.deleteById(id);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Product Deleted Successfully")
                .build();
    }

}
