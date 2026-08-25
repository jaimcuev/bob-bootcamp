# Casos de prueba "golden" — Simulador de Crédito

> Extraídos directamente del PRD (Anexo 2 y sección 5.3), para verificar el motor de cálculo contra cifras ya conocidas y aprobadas por negocio.

## Cronograma de referencia (PRD Anexo 2)

| N.º cuota | Fecha | Capital | Interés | Seguro | Cuota | Saldo |
|---|---|---|---|---|---|---|
| 1 | 15/09/2026 | S/ 750 | S/ 170 | S/ 30 | S/ 950 | S/ 9,250 |
| 2 | 15/10/2026 | S/ 765 | S/ 155 | S/ 30 | S/ 950 | S/ 8,485 |
| 3 | 15/11/2026 | S/ 780 | S/ 140 | S/ 30 | S/ 950 | S/ 7,705 |
| 12 | 15/08/2027 | … | … | … | S/ 950 | S/ 0 |

> Nota: el PRD no publica el monto financiado, la TEA ni el plazo exactos usados para generar esta tabla — al implementar el test, ajusta los inputs para que el motor reproduzca esta salida, o documenta el criterio usado si se aproxima. El objetivo es validar la **forma** del cálculo (capital creciente, interés decreciente, cuota base fija, saldo llegando a 0 en la última cuota), no solo los valores exactos.

## Tasas TEA por producto (PRD 5.3)

| Producto | TEA mínima | TEA máxima |
|---|---|---|
| Crédito al Consumo | 15.99% | 114.13% |
| Crédito Automotriz | 40.00% | 114.13% |
| Crédito Comercial | 45.00% | 114.13% |
| Crédito Hipotecario | 9.80% | 14.90% |

**Caso de prueba:** con cualquier TEA fuera de estos rangos para el producto seleccionado, el sistema debe rechazar el valor (RF-04, validación de datos).

## Tasas de seguro de desgravamen (PRD 5.3)

| Modalidad | Tasa mensual |
|---|---|
| Sin devolución | 0.40% |
| Con devolución | 0.72% |

**Caso de prueba:** cambiar de modalidad debe recalcular la cuota total sin alterar el capital ni el interés de cada período (el seguro es un componente aparte del pago total).

## Reglas de exclusividad por producto (PRD 5.2/5.4)

**Caso de prueba:** para AUTOMOTRIZ, COMERCIAL e HIPOTECARIO, los campos y la lógica de cuotas dobles y período de gracia deben estar completamente ausentes del resultado — ni mostrados en UI ni aplicados en el cálculo.
