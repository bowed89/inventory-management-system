package com.jesus.inventory.service.impl;

import com.jesus.inventory.dto.ApiResponse;
import com.jesus.inventory.dto.SupplierDTO;
import com.jesus.inventory.entity.Supplier;
import com.jesus.inventory.exceptions.NotFoundException;
import com.jesus.inventory.repository.SupplierRepository;
import com.jesus.inventory.service.SupplierService;
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
public class SupplierServiceImpl implements SupplierService {
    private final SupplierRepository supplierRepository;
    private final ModelMapper modelMapper;

    @Override
    public ApiResponse<Void> addSupplier(SupplierDTO supplierDTO) {
        Supplier supplierToSave = modelMapper.map(supplierDTO, Supplier.class);
        supplierRepository.save(supplierToSave);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Supplier created successfully")
                .build();
    }

    @Override
    public ApiResponse<Void> updateSupplier(Long id, SupplierDTO supplierDTO) {
        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

        if(supplierDTO.getName() != null) existingSupplier.setName(supplierDTO.getName());
        if(supplierDTO.getAddress() != null) existingSupplier.setAddress(supplierDTO.getAddress());

        supplierRepository.save(existingSupplier);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Supplier Updated Successfully")
                .build();
    }


    @Override
    public ApiResponse<List<SupplierDTO>> getAllSuppliers() {
        List<Supplier> suppliers = supplierRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<SupplierDTO> supplierDTOS = modelMapper.map(suppliers, new TypeToken<List<SupplierDTO>>() {}.getType());

        return ApiResponse.<List<SupplierDTO>>builder()
                .status(200)
                .message("Success")
                .data(supplierDTOS)
                .build();
    }

    @Override
    public ApiResponse<SupplierDTO> getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

        SupplierDTO supplierDTO = modelMapper.map(supplier, SupplierDTO.class);

        return ApiResponse.<SupplierDTO>builder()
                .status(200)
                .message("Success")
                .data(supplierDTO)
                .build();
    }


    @Override
    public ApiResponse<Void> deleteSupplier(Long id) {
        supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

        supplierRepository.deleteById(id);

        return ApiResponse.<Void>builder()
                .status(200)
                .message("Supplier Deleted Successfully")
                .build();
    }
}
