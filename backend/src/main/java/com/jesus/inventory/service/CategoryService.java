package com.jesus.inventory.service;


import com.jesus.inventory.dto.CategoryDTO;
import com.jesus.inventory.dto.Response;

public interface CategoryService {
    Response createCategory(CategoryDTO categoryDTO);
    Response getAllCategories();
    Response getCategoryById(Long id);
    Response updateCategory(Long id, CategoryDTO categoryDTO);
    Response deleteCategory(Long id);

}
