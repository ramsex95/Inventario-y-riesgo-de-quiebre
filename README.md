# Inventario y Riesgo de Quiebre

Sistema para monitoreo de stock en restaurantes, estimación de quiebre y generación de recomendaciones de transferencia entre bodegas o compra urgente con aprobación humana.

## Stack
- Backend: Spring Boot 3.3 (Java 21)
- Frontend: React 18 + Vite
- Base de datos: PostgreSQL 16
- Broker de eventos: RabbitMQ 3.13

## Ejecución con Docker
```bash
cp .env.example .env
docker compose up --build -d
