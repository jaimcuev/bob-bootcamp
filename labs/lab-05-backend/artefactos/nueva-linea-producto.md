---
description: Agrega una nueva línea de producto de crédito al simulador (tarifario, mock, validaciones y prueba de regresión)
argument-hint: <nombre-producto> <tea-minima> <tea-maxima>
---
Agrega una nueva línea de producto de crédito llamada $1 al Simulador de Crédito,
con TEA mínima $2 y TEA máxima $3. Sigue el skill `reglas-negocio-credito` para
que las fórmulas sean consistentes con el resto del simulador.

**Paso 1:**
Agrega la nueva línea a `backend/data/tarifario-seed.json` (código en mayúsculas
sin espacios, `permitePeriodoGracia: false`, `permiteCuotasDobles: false` — estas
dos opciones son exclusivas de CONSUMO según el PRD, sección 5.2/5.4).

**Paso 2:**
Agrega la misma línea al mock de `tarifario-api` (`docs/diseno/tarifario-api.yaml`
si aplica, o el handler del mock server).

**Paso 3:**
Verifica que el frontend (`SimuladorForm.tsx`) y el backend (`calculoCredito.ts`)
no necesiten cambios — si la línea nueva sigue las mismas reglas que Automotriz/
Comercial/Hipotecario, no debería requerir lógica especial adicional.

**Paso 4:**
Agrega una prueba de regresión en `calculoCredito.test.ts` que verifique que la
TEA de la nueva línea está dentro del rango configurado y que cuotas dobles/
período de gracia NO aplican a esta línea.

**Paso 5:**
Resume en el chat qué archivos se modificaron.
