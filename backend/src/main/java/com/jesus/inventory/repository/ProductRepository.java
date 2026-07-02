package com.jesus.inventory.repository;

import com.jesus.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {


}
