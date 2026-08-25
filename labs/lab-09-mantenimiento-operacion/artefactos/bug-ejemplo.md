# Bug de ejemplo — Tasa TEA desactualizada

**Reportado por:** Asesor comercial (canal interno)

**Descripción:** Un asesor comercial reporta que el simulador está mostrando una TEA de 12.50% para una simulación de Crédito Hipotecario, por debajo del rango mínimo publicado en el PRD (9.80%–14.90%)... espera, revisando de nuevo: el valor mostrado fue **8.50%**, por debajo incluso del mínimo del producto (9.80%), lo cual no debería ser posible.

**Impacto:** El cliente recibió una cuota estimada más baja de la real, generando una expectativa incorrecta antes de acercarse a negociar con un asesor — justo el riesgo R1 identificado desde el Lab 01 (`risk-register.md`).

**Hipótesis inicial:** El mock de `tarifario-api` no está validando que la tasa configurada esté dentro del rango `teaMinima`–`teaMaxima` del producto antes de devolverla; probablemente una actualización manual del `tarifario-seed.json` introdujo un valor fuera de rango sin pasar por ninguna validación.
