package com.jesus.inventory.service.impl;

import com.jesus.inventory.dto.ApiResponse;
import com.jesus.inventory.dto.CategoryDTO;
import com.jesus.inventory.entity.Category;
import com.jesus.inventory.exceptions.NotFoundException;
import com.jesus.inventory.repository.CategoryRepository;
import com.jesus.inventory.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public ApiResponse<Void> createCategory(CategoryDTO categoryDTO) {
        Category categoryToSave = modelMapper.map(categoryDTO, Category.class);
        categoryRepository.save(categoryToSave);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Category created successfully")
                .build();
    }

    @Override
    public ApiResponse<List<CategoryDTO>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<CategoryDTO> categoryDTOS = modelMapper.map(categories, new TypeToken<List<CategoryDTO>>() {}.getType());

        return ApiResponse.<List<CategoryDTO>>builder()
                .status(200)
                .message("Success")
                .data(categoryDTOS)
                .build();
    }

    @Override
    public ApiResponse<CategoryDTO> getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));

        CategoryDTO categoryDTO = modelMapper.map(category, CategoryDTO.class);

        return ApiResponse.<CategoryDTO>builder()
                .status(200)
                .message("Success")
                .data(categoryDTO)
                .build();
    }

    @Override
    public ApiResponse<Void> updateCategory(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));

        existingCategory.setName(categoryDTO.getName());
        categoryRepository.save(existingCategory);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Category Updated Successfully")
                .build();
    }

    @Override
    public ApiResponse<Void> deleteCategory(Long id) {
        categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category Not Found"));

        categoryRepository.deleteById(id);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Category Deleted Successfully")
                .build();
    }
}
