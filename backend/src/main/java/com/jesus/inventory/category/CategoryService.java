package com.jesus.inventory.category;


import com.jesus.inventory.common.ApiResponse;
import com.jesus.inventory.category.CategoryDTO;

import java.util.List;

public interface CategoryService {
    ApiResponse<Void> createCategory(CategoryDTO categoryDTO);
    ApiResponse<List<CategoryDTO>> getAllCategories();
    ApiResponse<CategoryDTO> getCategoryById(Long id);
    ApiResponse<Void> updateCategory(Long id, CategoryDTO categoryDTO);
    ApiResponse<Void> deleteCategory(Long id);

}
