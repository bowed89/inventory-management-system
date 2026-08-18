package com.jesus.inventory.supplier;


import com.jesus.inventory.common.ApiResponse;
import com.jesus.inventory.supplier.SupplierDTO;

import java.util.List;

public interface SupplierService {
    ApiResponse<Void> addSupplier(SupplierDTO supplierDTO);
    ApiResponse<Void> updateSupplier(Long id, SupplierDTO supplierDTO);
    ApiResponse<List<SupplierDTO>> getAllSuppliers();
    ApiResponse<SupplierDTO> getSupplierById(Long id);
    ApiResponse<Void> deleteSupplier(Long id);

}
