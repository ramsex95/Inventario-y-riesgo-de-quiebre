package com.restaurante.inventario.repository;

import com.restaurante.inventario.model.ProductStock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockRepository extends JpaRepository<ProductStock, Long> {
    List<ProductStock> findByWarehouseId(String warehouseId);
}
