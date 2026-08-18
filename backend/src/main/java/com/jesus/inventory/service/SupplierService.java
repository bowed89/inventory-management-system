package com.jesus.inventory.service;


import com.jesus.inventory.dto.ApiResponse;
import com.jesus.inventory.dto.SupplierDTO;

import java.util.List;

public interface SupplierService {
    ApiResponse<Void> addSupplier(SupplierDTO supplierDTO);
    ApiResponse<Void> updateSupplier(Long id, SupplierDTO supplierDTO);
    ApiResponse<List<SupplierDTO>> getAllSuppliers();
    ApiResponse<SupplierDTO> getSupplierById(Long id);
    ApiResponse<Void> deleteSupplier(Long id);

}
