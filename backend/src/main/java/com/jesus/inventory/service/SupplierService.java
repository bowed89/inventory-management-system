package com.jesus.inventory.service;


import com.jesus.inventory.dto.CategoryDTO;
import com.jesus.inventory.dto.Response;
import com.jesus.inventory.dto.SupplierDTO;

public interface SupplierService {
    Response addSupplier(SupplierDTO supplierDTO);
    Response updateSupplier(Long id, SupplierDTO supplierDTO);
    Response getAllSuppliers();
    Response getSupplierById(Long id);
    Response deleteSupplier(Long id);

}
