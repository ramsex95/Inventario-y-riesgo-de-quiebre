package com.restaurante.inventario.controller;

import com.restaurante.inventario.model.ProductStock;
import com.restaurante.inventario.repository.StockRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final StockRepository repository;
    private final RabbitTemplate rabbitTemplate;

    public InventoryController(StockRepository repository, RabbitTemplate rabbitTemplate) {
        this.repository = repository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @GetMapping("/stocks")
    public List<ProductStock> getAllStocks() {
        return repository.findAll();
    }

    @PostMapping("/seed")
    public Map<String, String> seedInitialData() {
        repository.deleteAll();
        repository.save(new ProductStock("TOMATE-ROJO", "BODEGA-NORTE", 3, 15));
        repository.save(new ProductStock("TOMATE-ROJO", "BODEGA-SUR", 60, 10));
        repository.save(new ProductStock("CARNE-LOMO", "BODEGA-NORTE", 1, 20));
        repository.save(new ProductStock("ACEITE-VEGETAL", "BODEGA-CENTRO", 45, 10));
        return Map.of("status", "SUCCESS", "message", "Inventario inicial sembrado");
    }

    @GetMapping("/alerts")
    public List<Map<String, Object>> evaluateRisk() {
        List<ProductStock> stocks = repository.findAll();
        List<Map<String, Object>> alerts = new ArrayList<>();

        for (ProductStock s : stocks) {
            if (s.getCurrentStock() <= s.getMinThreshold()) {
                Map<String, Object> alert = new HashMap<>();
                alert.put("id", s.getId());
                alert.put("sku", s.getSku());
                alert.put("warehouse", s.getWarehouseId());
                alert.put("currentStock", s.getCurrentStock());
                alert.put("threshold", s.getMinThreshold());
                alert.put("action", s.getCurrentStock() <= 2 ? "COMPRA_URGENTE" : "TRANSFERENCIA_SUGERIDA");
                alerts.add(alert);
            }
        }
        return alerts;
    }

    @PostMapping("/approve")
    public Map<String, String> approveAction(@RequestBody Map<String, String> payload) {
        rabbitTemplate.convertAndSend("", "stock_orders", payload.toString());
        return Map.of(
            "status", "APPROVED",
            "message", "Orden aprobada y enviada a la cola de compras legacy"
        );
    }
}
