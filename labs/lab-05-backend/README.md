# Lab 05 — Desarrollo backend

## Objetivo

Construye el motor financiero, el mock de tarifario y la API `POST /api/simulaciones`.
Al cerrar este lab, el backend responde una simulación válida y sus pruebas pasan.

## Roles involucrados

| Rol | Qué hace en este lab |
|---|---|
| Backend Developer | Implementa motor, mock, API y pruebas. |
| Tech Lead | Revisa decisiones de arquitectura y cambios sensibles. |
| Riesgos / Producto | Valida cualquier cambio de tasas, seguros o fórmulas. |

## Antes de comenzar

1. Completa Labs 03 y 04.
2. Abre el mismo proyecto `simulador-credito-banco-acme` que usaste desde el Lab 01.
3. Copia manualmente `formulas-negocio.md` desde el bootcamp a `docs/arquitectura/`
   y `tarifario-seed.json` a `backend-seed/`.
4. En la terminal integrada de Bob, ejecuta solo este comando para crear carpetas:

```bash
mkdir -p docs/arquitectura backend-seed backend/data
```

Antes de ejecutarlo, escribe `pwd` y verifica que se muestra la carpeta nueva.

## Paso 1 — Crear y activar el modo

En **Configuración → Modos → + (Crear nuevo modo)**, completa:

- **Identificador:** `credit-backend-developer`
- **Nombre visible:** Credit backend developer
- **Descripción:** Implementa motor financiero y APIs del simulador.
- **Rol:** Eres desarrollador backend senior de sistemas de crédito.
- **Instrucciones:** Pega el siguiente texto completo:

  ```text
  Implementa el backend del Simulador de Crédito con precisión financiera y
  trazabilidad. Lee docs/arquitectura/formulas-negocio.md, los contratos de
  docs/contracts/ y los límites definidos en docs/arquitectura/ antes de editar.
  El motor es independiente de HTTP, archivos y UI; rutas validan solicitudes;
  clientes consumen servicios externos; y persistencia queda aislada. Usa SQLite
  local para las simulaciones, detrás de un repositorio; el archivo de base de
  datos no se versiona ni se sirve por HTTP.
  Nunca inventes, hardcodees ni dupliques tasas o seguros: usa el tarifario.
  Calcula, valida y redondea de manera consistente con formulas-negocio.md.
  Gracia y cuotas dobles aplican solo a Consumo. Cada cambio observable requiere
  pruebas de casos válidos, límites y errores. Antes de instalar dependencias o
  editar, explica comandos, archivos y riesgos; después ejecuta las pruebas y
  resume contratos, validaciones y supuestos que sigan pendientes.
  ```
- **Herramientas:** lectura, edición, ejecución, skills, tareas y subagents.

Guarda el modo y selecciónalo en el selector del chat antes de continuar.

## Paso 2 — Crear y activar el Skill financiero

En **Configuración → Skills → + (Crear nuevo Skill)**, completa:

- **Nombre:** `reglas-negocio-credito`
- **Descripción:** Mantiene consistentes las fórmulas y reglas de crédito.
- **Instrucciones:** Pega este contenido completo:

  ```text
  Objetivo: proteger las reglas de negocio del Simulador de Crédito durante la
  implementación y revisión del backend.

  Fuentes obligatorias: docs/arquitectura/formulas-negocio.md,
  docs/contracts/tarifario-api.yaml y backend-seed/tarifario-seed.json. Lee esos
  archivos antes de modificar el motor, el tarifario o POST /api/simulaciones.
  Si hay conflicto, formulas-negocio.md define el cálculo y el contrato OpenAPI
  define la integración; reporta el conflicto, no lo resuelvas inventando datos.

  Reglas de cálculo: monto financiado = valor del bien - cuota inicial - bono;
  TEM = (1 + TEA)^(1/12) - 1; cuota francesa; interés, capital, saldo y seguro
  por período según formulas-negocio.md. Gracia y cuotas dobles aplican solo a
  CONSUMO. TEA y seguro provienen del tarifario, nunca de la UI ni de constantes
  dispersas.

  Reglas de calidad: valida entradas y rangos por producto; separa motor, rutas,
  clientes y persistencia; usa SQLite mediante un repositorio y crea pruebas para
  fórmula, límites, productos no elegibles, persistencia y errores HTTP. Antes
  de editar, enumera archivos y casos de prueba;
  después ejecuta la suite y reporta redondeos, supuestos y contratos afectados.
  ```

Guarda y activa el Skill durante los pasos 3–6.

## Paso 3 — Crear el backend mínimo

En el chat de Bob, confirma que están activos el modo `credit-backend-developer`
y el Skill `reglas-negocio-credito`. Luego envía este prompt:

```text
Con el Skill reglas-negocio-credito activo, crea en backend una aplicación
Node + Express + TypeScript. Incluye src/routes, src/services, src/models y un
endpoint GET /health que devuelva 200 y {"status":"ok"}. No implementes aún el
motor ni POST /api/simulaciones. 
```

Bob propondrá comandos de instalación. Léelos antes de aprobarlos. Al terminar,
ejecuta `npm start` dentro de `backend/` y abre la URL del health check que Bob muestre.
Debes recibir `{"status":"ok"}`.

## Paso 4 — Implementar y probar el motor

En el mismo chat, sin cambiar de modo ni desactivar el Skill, envía:

```text
Con el Skill reglas-negocio-credito activo y usando @docs/arquitectura/formulas-negocio.md,
implementa backend/src/services/calculoCredito.ts. Incluye monto financiado, TEM,
cuota francesa, seguro y cronograma. Gracia y cuotas dobles aplican solo a CONSUMO.
Antes de editar, indica los archivos que modificarás. Después crea pruebas unitarias
con casos válidos, límites e intentos de usar gracia/cuotas dobles en otro producto.
```

Ejecuta la suite indicada por Bob. Si falla, pega el error en el chat y pide:
“Corrige esta prueba sin cambiar la fórmula de formulas-negocio.md”. No avances
hasta tener la suite en verde.

## Paso 5 — Mock de tarifario y API

En el chat de Bob, con el mismo modo y Skill activos, envía:

```text
Usa @docs/contracts/tarifario-api.yaml y backend-seed/tarifario-seed.json. Implementa
un mock HTTP de tarifario y un cliente HTTP para consumirlo. Después implementa
POST /api/simulaciones: valida cada campo, consulta el tarifario, ejecuta el motor,
guarda la simulación en SQLite mediante un repositorio y devuelve resumen más
cronograma. Guarda el archivo de desarrollo en backend/data/ y agrega su ruta a
.gitignore; en pruebas usa una base SQLite temporal y aislada. No importes el JSON
del tarifario dentro del motor de cálculo.
```

Prueba una solicitud válida y otra inválida. La inválida debe devolver `400` y un
detalle por campo. Revisa ambas respuestas antes de seguir.

## Paso 6 — Prueba de integración y comando

El PRD deja claro que este simulador va a crecer (más líneas de producto, más reglas). En vez de reexplicarle a Bob el mismo procedimiento cada vez, crea un comando propio en .bob/commands/nueva-linea-producto.md (ver plantilla lista para copiar en artefactos/nueva-linea-producto.md de este lab). El nombre del archivo define el comando: nueva-linea-producto.md → /nueva-linea-producto.

## Comprobación antes de continuar

Ejecuta `npm test` y `npm run build` en `backend/`. Deben pasar. Conserva el backend
arrancado: el Lab 06 conectará el frontend a `POST /api/simulaciones`.
