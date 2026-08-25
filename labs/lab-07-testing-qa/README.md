# Lab 07 — Testing / QA

## 1. Objetivo del lab

Verificar que el backend del Lab 05 y el frontend del Lab 06 cumplen los criterios de aceptación definidos en el Lab 02, usando Bob para generar pruebas, revisar calidad de código (`/review`, Bob Findings, Consejos de Bob) y documentar cobertura frente a los 18 requerimientos funcionales del PRD. Las pruebas se separan por responsabilidad: **frontend React**, **backend/API** y un flujo **E2E** que comprueba la integración completa. Esta es la fase de **Pruebas** del SDLC: se valida antes de liberar, no después.

## Roles involucrados

| Rol | Qué hace en este lab |
|---|---|
| QA Engineer | Diseña el plan de pruebas, ejecuta revisión y hace triage de hallazgos. |
| Developers | Corrigen hallazgos y pruebas fallidas. |

## 2. Prerequisitos

- Labs 05 y 06 completados: repo `simulador-credito-banco-acme` con motor, API y frontend funcionando.
- Bob IDE con el panel de revisión disponible (`/review`) y acceso a Configuración de modos, reglas y Skills.

## 3. Artefactos de entrada

Antes de abrir el proyecto en Bob, copia manualmente al proyecto los documentos
`historias-usuario-refinadas.md` y `matriz-trazabilidad.csv` del Lab 02. Guárdalos
en `docs/requisitos/`; así los prompts de este lab no dependen de rutas del bootcamp.

### Insumos

Carpeta [`artefactos/`](artefactos/):
- `casos-golden.md` — casos de prueba "golden" extraídos del Anexo 2 del PRD (cronograma de ejemplo) y de la tabla de tasas (sección 5.3), para verificar el motor de cálculo contra números conocidos.
- Referencia del proyecto: `docs/requisitos/historias-usuario-refinadas.md` y `docs/requisitos/matriz-trazabilidad.csv`.

Antes del Paso 4, crea `docs/qa/plan-pruebas.md` y pega:

```markdown
# Plan de pruebas — Simulador de Crédito
| RF | Qué se prueba | Tipo de prueba | Prioridad |
|---|---|---|---|
```

## 4. Paso a paso con Bob

### Modo recomendado — `qa-revisor`

Usa `qa-revisor` para diagnóstico, priorización y revisión. Cambia a Agent para
crear, ejecutar o corregir pruebas, y vuelve a `qa-revisor` para revisar evidencia.

### Paso 1 — Crear el modo y la regla de QA
En **Configuración → Modos → Crear modo**, completa todos los campos:

- **Identificador:** `qa-revisor`
- **Nombre visible:** QA revisor
- **Descripción:** Revisa código, evidencia de pruebas y cobertura sin modificar archivos.
- **Rol del modo:** Eres QA senior de Banco ACME revisando el Simulador de Crédito.
- **Cuándo usarlo:** Para analizar calidad, pruebas y cobertura.
- **Instrucciones:** Pega el siguiente texto completo:

  ```text
  Revisa el Simulador de Crédito como QA senior sin modificar archivos. Usa las
  historias, matriz de trazabilidad, código y resultados de pruebas como evidencia.
  Cada hallazgo debe incluir severidad, RF o criterio afectado, evidencia concreta,
  riesgo para el cliente y recomendación de validación. Separa hechos comprobados,
  hipótesis y cobertura pendiente.
  Prioriza cálculos, tasas, seguros, validaciones, manejo de errores y flujos que
  muestran valores a clientes. No declares un defecto por estilo ni inventes una
  evidencia. No propongas ni apliques una corrección: indica qué prueba, archivo
  o dato permitiría confirmarlo. Antes de cerrar una revisión, lista los RF
  cubiertos, parciales y pendientes y los riesgos que bloquean la liberación.
  ```
- **Herramientas:** activa únicamente lectura, skills y subagents; desactiva edición
  y ejecución.

Guarda el modo y selecciónalo antes del Paso 3. Luego abre `AGENTS.md` en la raíz
del proyecto, agrega al final el siguiente bloque y guarda el archivo:

```markdown
## Criterios de QA
- Todo hallazgo debe incluir severidad, RF o criterio afectado, evidencia y riesgo para el cliente.
- Distingue hechos comprobados, hipótesis y cobertura pendiente.
- No cierres un cambio de cálculo, tasa, seguro o validación sin prueba automatizada y evidencia de ejecución.
- No declares listo para liberar un cambio con hallazgos críticos abiertos.
```

Conserva el bloque existente del Lab 01; solo agrega esta sección. Incluye
`AGENTS.md` en el siguiente commit.

Selecciona `qa-revisor` en Bob antes del Paso 3 y vuelve a seleccionarlo para el
Paso 10. El modo no tiene `edit` ni `execute`: un diagnóstico aprobado se corrige
después en Agent. La regla exige una tabla con severidad, RF, evidencia y riesgo
para el cliente; si no hay evidencia suficiente, debe decirlo en vez de inventar un hallazgo.


### Paso 2 — Crear el Skill de validación por capas (una sola vez por equipo)
En **Skills → Crear Skill**, completa y guarda estos tres campos:

- **Nombre:** `validacion-simulador`
- **Descripción:** Selecciona, implementa y revisa pruebas de frontend, backend/API y E2E del Simulador de Crédito.
- **Instrucciones:**

  ```text
  Objetivo: crear y revisar pruebas que aporten evidencia trazable para el
  Simulador de Crédito. Cuando el escenario trate tasas, seguros, cuotas o
  cronogramas, usa también el Skill reglas-negocio-credito.

  Fuentes obligatorias: docs/requisitos/historias-usuario-refinadas.md,
  docs/requisitos/matriz-trazabilidad.csv, docs/arquitectura/formulas-negocio.md,
  artefactos/casos-golden.md y el contrato real de POST /api/simulaciones.
  Relaciona cada prueba con un RF y criterio de aceptación; prioriza cálculos,
  validaciones y resultados visibles al cliente.

  Selecciona la capa más baja que aporte evidencia suficiente: componente para
  interacción UI, backend/API para fórmulas y contratos, y E2E para el recorrido
  crítico navegador → API → resultado. No dupliques la misma aserción en todas
  las capas. Prueba frontend por role, label o texto; backend con motor y SQLite
  reales en una base temporal aislada;
  y E2E con selectores accesibles o data-testid estable.

  Antes de editar enumera RF, capa, archivos y evidencia esperada. Al terminar,
  ejecuta typecheck, lint y la suite afectada; reporta cobertura lograda,
  cobertura pendiente y cualquier bloqueo para liberar.
  ```

El Skill complementa `reglas-negocio-credito` del Lab 05.

Úsalo antes de pedir pruebas a Bob. Debe seleccionar la capa mínima que ofrece evidencia suficiente y evitar duplicar la misma aserción en todos los niveles:

| Área | Herramientas sugeridas | Evidencia esperada |
|---|---|---|
| Frontend | Vitest + React Testing Library | Renderizado, campos condicionales, validaciones y acciones del usuario. |
| Backend | Vitest/Jest + Supertest | Fórmulas, contratos HTTP, validación y persistencia de simulaciones en SQLite temporal. |
| E2E | Playwright | El recorrido real navegador → API → resultado visible. |

> Si el proyecto creado en los Labs 05 y 06 usa otras herramientas equivalentes, conserva la separación de responsabilidades y adapta los comandos; no agregues dos runners de prueba para resolver el mismo caso.

### Paso 3 — Discutir qué priorizar (modo `qa-revisor`)
Antes de comprometerte a un plan de pruebas, discútelo: qué RF son más riesgosos, dónde conviene invertir en automatización vs. prueba manual. Es una conversación, no un documento todavía.
```
Usando @docs/requisitos/historias-usuario-refinadas.md,
para cada RF sugiéreme qué tipo de prueba conviene (unitaria, integración, E2E,
manual) y qué tan prioritario es, considerando que este es un simulador de
crédito bancario donde los cálculos son lo más sensible.
```

### Paso 4 — Guardar el plan de pruebas (cambia a Agent, mismo chat)
```
Usa docs/qa/plan-pruebas.md, conserva su tabla y agrega lo que acabamos de priorizar.
```

### Paso 5 — Pruebas de backend: motor, API y persistencia (modo Agent)
```
Usando @artefactos/casos-golden.md como casos de referencia, genera pruebas
unitarias para backend/src/services/calculoCredito.ts que verifiquen: monto
financiado, TEM desde TEA, cuota base y al menos las 3 primeras filas del
cronograma del Anexo 2 del PRD (@docs/fuente/PRD_Simulador_de_Credito_v2.pdf). Incluye
un caso que verifique que cuotas dobles y período de gracia NO aplican a
Automotriz/Comercial/Hipotecario.
```

Después agrega una prueba de integración para `POST /api/simulaciones`. Debe verificar que una solicitud válida devuelve el resumen y cronograma, que una solicitud inválida devuelve `400` con detalles por campo, y que una simulación válida se registra. Mockea solo dependencias externas inestables; el motor de cálculo debe ser el real.
Usa una base SQLite temporal por prueba o suite, comprueba el registro a través del
repositorio y elimínala al finalizar; no uses ni modifiques la base local de desarrollo.

### Paso 6 — Pruebas de componentes React (modo Agent)
Con el Skill `validacion-simulador` activo, solicita:

```
Usando @docs/ux-ui/component-inventory.md y el skill validacion-simulador,
crea frontend/src/components/SimuladorForm.test.tsx. Prueba desde la perspectiva
del usuario: selección exclusiva de producto, campos que aparecen solo para
CONSUMO, opciones de plazo válidas, mensajes de validación y envío de una
simulación válida. No pruebes detalles internos ni clases CSS.
```

Estas pruebas no levantan un navegador completo: renderizan el componente y simulan la interacción. Son rápidas y detectan regresiones de UI antes de E2E.

### Paso 7 — Verificación funcional libre (modo Agent)
Antes de automatizar, verificá que el flujo principal funciona corriendo el frontend y backend:

```bash
# terminal 1
cd backend && npm start

# terminal 2
cd frontend && npm run dev
```

Abrí el simulador en el navegador y recorré el flujo: seleccioná **Consumo**, completá los datos, calculá y verificá que aparece el resultado con cuota y cronograma. Si algo no funciona o querés ajustar un detalle visual (color, texto, espaciado):

```
El flujo de simulación falla en [describe el problema]. Corregilo.
```

Este espacio es libre — el objetivo es que el flujo principal funcione antes de automatizarlo.

### Paso 8 — Prueba E2E con Playwright (modo Agent)
Instala Playwright en el repositorio (`npm init playwright@latest`) y luego:

```
Con el skill validacion-simulador, crea una prueba Playwright para el frontend
real leyendo @frontend/src/components/SimuladorForm.tsx para identificar los
labels y roles correctos. Usa selectores accesibles (label, role o test id estable), no
selectores basados en estructura o clases CSS. El test debe cubrir estos dos recorridos:
1. Seleccionar "Consumo", completar datos válidos, calcular y confirmar que
   aparece la cuota, el cronograma y los disclaimers. La prueba debe esperar
   la respuesta real de /api/simulaciones y comprobar el resultado visible.
2. Ingresar un monto inválido, intentar simular y confirmar que no se hace
   ningún POST a /api/simulaciones.
```

### Paso 9 — Limpiar errores (modo Agent)
Antes de pasar a `/review`, corré el linter/build. Si hay errores usá cualquiera de estas menciones según el origen del problema:

```
@problems corrige todos estos problemas y explícame brevemente qué causó cada uno.
```
```
@terminal ¿por qué falló este comando? Corregilo.
```

- `@problems` → errores de lint/tipos del panel de Bob.
- `@terminal` → errores de compilación o ejecución en consola.

### Paso 10 — Code review con `/review`
1. Abre el panel de revisión con `/review`.
2. Selecciona la rama que contiene los cambios de los Labs 05 y 06 contra `main`.
3. Activa "Incluir cambios no confirmados" si aplica.
4. Haz clic en **Iniciar revisión**.
5. En el panel **Bob Findings** aparecen tanto los hallazgos del `/review` como los **Bob Tips** (subrayados morados de alta complejidad o baja mantenibilidad). Para cada hallazgo: usa **Corregir con Bob** si es válido, o **Descartar** si no aplica.
6. Si hay hallazgos relevantes, pedile a Bob que los documente:
```
Documenta los hallazgos del panel de revisión en docs/qa/bob-findings-report.md
con severidad, RF afectado y evidencia.
```

### Paso 11 — Matriz de cobertura (modo Plan o Agent)
```
Compara docs/qa/plan-pruebas.md y las pruebas creadas contra
@docs/requisitos/matriz-trazabilidad.csv. Actualiza el
estado de cada RF a "Cubierto", "Parcial" o "Pendiente" y guarda como
docs/qa/matriz-cobertura-rf.md.
```

## 5. Al completar el lab

- `docs/qa/plan-pruebas.md`, `docs/qa/bob-findings-report.md` y
  `docs/qa/matriz-cobertura-rf.md` creados.
- Pruebas de frontend, backend y E2E en verde.
