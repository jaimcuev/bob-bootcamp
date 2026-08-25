# Lab 04 — UX/UI: integración Bob + Figma

## Objetivo

Mostrar en video cómo Bob usa el contexto de un diseño en Figma para generar un
frontend inicial. El entregable es el código generado en `output/frontend/`;
sirve como punto de partida visual y estructural para el Lab 06, no como una
implementación de alta fidelidad ni una integración final con el backend.

## Roles involucrados

| Rol | Qué hace en este lab |
|---|---|
| UX/UI Designer | Presenta el diseño de Figma y su sistema de componentes. |
| Frontend Developer | Revisa el código generado y prepara su traspaso al Lab 06. |
| Product Owner | Valida que el flujo visual represente el alcance del simulador. |

## Prerrequisitos

- Lab 03 completado, con requisitos y límites de API disponibles en `docs/`.
- Archivo de Figma del simulador y la integración Bob–Figma disponibles para la
  demostración.
- El entregable `output/frontend/` incluido en este lab.

## Paso a paso

### Paso 1 — Ver la demostración Bob–Figma

La persona facilitadora muestra el flujo en video:

1. Abre el diseño del simulador en Figma.
2. Conecta Bob con Figma y proporciona el contexto del diseño: pantallas,
   componentes, estilos y tokens.
3. Solicita a Bob generar el código inicial de la interfaz.
4. Muestra el resultado generado y cómo se organizó como frontend.

Este paso es una demostración: los participantes no necesitan repetir la
integración ni regenerar el código durante el lab.

### Paso 2 — Revisar el frontend entregado

Abre `output/frontend/`. El entregable contiene un proyecto inicial Vite, React
y TypeScript con la estructura y los componentes generados desde el contexto de
Figma. Revísalo para reconocer pantallas, componentes, estilos y tipos.

Si prefieres descargarlo como archivo comprimido, usa [Descargar el frontend
(ZIP)](https://github.com/jaimcuev/bob-bootcamp/raw/refs/heads/main/labs/lab-04-ux-ui/output/frontend.zip).

Trátalo como un prototipo inicial. No es el contrato de la API ni la fuente de
verdad de las fórmulas financieras. Si incluye cálculos en el navegador, tasas o
datos de fallback, son parte de la demostración y deberán sustituirse en el Lab
06 por las respuestas del backend.

### Paso 3 — Preparar el traspaso al Lab 06

Conserva `output/frontend/` como el entregable de este lab. Al iniciar el Lab
06, copia su contenido al directorio `frontend/` del proyecto
`simulador-credito-banco-acme` y revísalo antes de reemplazar archivos existentes.
El Lab 06 conservará los componentes y estilos útiles, elevará la fidelidad que
sea necesaria y conectará el formulario a `POST /api/simulaciones`.

## Comprobación antes de continuar

- El video demuestra la integración Bob–Figma y la generación de código.
- Existe `output/frontend/` con el frontend generado.
- Se entiende que la integración real, el reemplazo de cálculos locales y las
  mejoras de la interfaz se realizan en el Lab 06.
