package com.restaurante.inventario.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product_stocks")
public class ProductStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sku;
    private String warehouseId;
    private Integer currentStock;
    private Integer minThreshold;

    public ProductStock() {}

    public ProductStock(String sku, String warehouseId, Integer currentStock, Integer minThreshold) {
        this.sku = sku;
        this.warehouseId = warehouseId;
        this.currentStock = currentStock;
        this.minThreshold = minThreshold;
    }

    public Long getId() { return id; }
    public String getSku() { return sku; }
    public String getWarehouseId() { return warehouseId; }
    public Integer getCurrentStock() { return currentStock; }
    public Integer getMinThreshold() { return minThreshold; }
    public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }
}
