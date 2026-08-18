package com.jesus.inventory.service;


import com.jesus.inventory.dto.ApiResponse;
import com.jesus.inventory.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {
    ApiResponse<Void> createCategory(CategoryDTO categoryDTO);
    ApiResponse<List<CategoryDTO>> getAllCategories();
    ApiResponse<CategoryDTO> getCategoryById(Long id);
    ApiResponse<Void> updateCategory(Long id, CategoryDTO categoryDTO);
    ApiResponse<Void> deleteCategory(Long id);

}
