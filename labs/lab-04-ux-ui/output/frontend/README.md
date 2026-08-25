# Simulador de Crédito — Frontend

> **Entregable del Lab 04** — generado con IBM Bob + Figma Console MCP

---

## ¿Cómo se generó este frontend?

Este frontend fue construido por **Bob** (el asistente de IBM) a partir del diseño
en Figma de Efectibank utilizando la integración **Figma Console MCP**.

El flujo fue:

1. **Diseño en Figma** — se diseñaron las pantallas del simulador siguiendo el
   IBM Carbon Design System, con los 4 pasos del wizard, componentes y tokens.
2. **Bob lee el diseño** — a través de Figma Console MCP, Bob accedió al árbol
   de nodos, estilos, variables y especificaciones de cada componente.
3. **Bob genera el código** — con las reglas de negocio del PRD (fórmulas
   financieras, tipos de producto, tasas), Bob produjo el proyecto React +
   TypeScript + Carbon que ves aquí.

El resultado demuestra cómo una IA asistida por contexto de diseño puede generar
un punto de partida de interfaz alineado con el sistema de diseño. Es un
prototipo inicial: no representa la fidelidad final ni la integración definitiva
con el backend.

---

## Propósito en el laboratorio

Este repositorio es el **entregable** del Lab 04. Representa el artefacto que
Bob entregó al finalizar la demostración de generación de código desde Figma.

Los participantes del laboratorio reciben este frontend para:

- **Explorar** cómo Bob tradujo el diseño en componentes React + Carbon.
- **Identificar** qué elementos visuales y estructurales se pueden conservar.
- **Mejorar e integrar** el proyecto en el Lab 06 con la API real del simulador.

> El frontend opera en **modo standalone** para la demostración. Sus datos de
> fallback y cálculos locales no son la fuente de verdad y se reemplazan en el
> Lab 06 por la API real.

---

## Estructura del proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── SimuladorForm.tsx       # Shell principal: header, wizard, footer
│   │   ├── Step1Producto.tsx       # Paso 1 — selección de producto
│   │   ├── Step2Condiciones.tsx    # Paso 2 — monto, plazo, TEA, fechas
│   │   ├── Step3Personalizacion.tsx # Paso 3 — seguro de desgravamen
│   │   ├── Step4Resultado.tsx      # Paso 4 — resumen y cronograma
│   │   └── CronogramaModal.tsx     # Modal con tabla de amortización
│   ├── hooks/
│   │   ├── useCreditoCalculator.ts # Fórmulas financieras (100% client-side)
│   │   └── useTarifario.ts         # Carga productos y tasas (con fallback)
│   ├── types/
│   │   └── creditTypes.ts          # Tipos del dominio (FormState, Producto…)
│   └── styles/
│       └── simulador.scss          # Estilos Carbon + variables ACME Banco
├── vite.config.ts                  # Proxy deshabilitado (modo standalone)
└── tsconfig.json
```

---

## Cómo ejecutarlo

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Levantar el servidor de desarrollo
npm run dev
```

Abre **http://localhost:5173** en el navegador. La app carga inmediatamente
sin necesidad de servidores adicionales.

---

## Cálculos locales presentes en el prototipo

El archivo `useCreditoCalculator.ts` contiene cálculos usados únicamente por el
prototipo standalone. El Lab 06 debe reemplazar su uso por la respuesta de
`POST /api/simulaciones`; no debe usarse como fuente de verdad financiera.

| Cálculo | Fórmula |
|---|---|
| Monto financiado | `M = ValorDelBien − CuotaInicial − Bono` |
| Tasa mensual (TEM) | `TEM = (1 + TEA)^(1/12) − 1` |
| Cuota base | `Cuota = M × [i(1+i)^n] / [(1+i)^n − 1]` |
| Seguro de desgravamen | `Seguro = SaldoPendiente × tasaSeguro` |
| Cuota total | `Pago = CuotaBase + Seguro` |

Las tasas de seguro son: **0.40 % mensual** (Sin Devolución) y
**0.72 % mensual** (Con Devolución).

---

## Integración en el Lab 06

Para llevar este frontend al proyecto del simulador:

1. Copia este directorio como `frontend/` en el proyecto.
2. Revisa los componentes y estilos generados antes de modificarlos.
3. Conecta el formulario a `POST /api/simulaciones` usando la URL de API desde
   una variable de entorno local.
4. Elimina o deja sin uso cálculos, tasas y fallback del navegador en el flujo
   principal; el backend será la fuente de verdad.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | Framework UI |
| TypeScript | 5 | Tipado estático |
| IBM Carbon Design System | 1.x | Componentes y tokens de diseño |
| Vite | 5 | Bundler y servidor de desarrollo |
| Sass | 1.x | Estilos con variables Carbon |
