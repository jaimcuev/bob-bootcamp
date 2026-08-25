# Lab 03 — Arquitectura

## Objetivo

Define componentes, límites entre frontend y backend, persistencia SQLite local,
servicios externos, secuencia de simulación y decisiones de stack.

## Roles involucrados

| Rol | Qué hace en este lab |
|---|---|
| Arquitecto de Software / Tech Lead | Define componentes, contratos y ADR. |
| Product Owner | Resuelve preguntas abiertas de alcance. |

## Prerrequisitos

- Lab 02 completado, con historias, decisiones y matriz de trazabilidad en
  `docs/requisitos/`.
- Bob IDE en modo Advanced.
- El proyecto `simulador-credito-banco-acme` abierto en Bob.

## Paso a paso con Bob

### Paso 1 — Preparar contratos y plantilla de ADR

Crea `docs/contracts/` y copia allí estos dos contratos:
[`tarifario-api.yaml`](artefactos/openapi/tarifario-api.yaml) y
[`contacto-asesor-api.yaml`](artefactos/openapi/contacto-asesor-api.yaml).
Conserva los nombres de archivo. Después crea `docs/arquitectura/` y
`docs/arquitectura/adr-001-stack.md` con esta plantilla:

```markdown
# ADR-[NNN] — [Título de la decisión]
**Estado:** Propuesto / Aceptado / Reemplazado
**Fecha:** [YYYY-MM-DD]
## Contexto
## Decisión
## Alternativas consideradas
| Alternativa | Por qué se descartó |
|---|---|
## Consecuencias
```

### Paso 2 — Crear el modo `software-architect`

Selecciona el modo **Plan**. En el chat de Bob, copia y envía este mensaje para
actualizar `.bob/custom_modes.yaml` sin eliminar los modos ya creados:

```markdown
Actualiza .bob/custom_modes.yaml y conserva los modos existentes. Agrega este
modo dentro de customModes:

- slug: software-architect
  name: Software architect
  description: Diseña arquitectura, contratos y decisiones técnicas trazables.
  roleDefinition: Eres arquitecto de software de Banco ACME.
  whenToUse: Para diseñar diagramas, ADR y límites de API del simulador.
  customInstructions: |
    Diseña arquitectura para el Simulador de Crédito de Banco ACME. Lee primero
    las historias en docs/requisitos/ y los contratos en docs/contracts/. Trata
    esos documentos como fuente de verdad y conserva los identificadores RF.
    Separa explícitamente frontend, API propia, motor de cálculo, persistencia y
    servicios externos. Para cada límite, identifica datos de entrada y salida,
    dueño, errores esperados y responsabilidad. Los OpenAPI de tarifario y contacto
    son servicios externos: el simulador los consume y no los reimplementa.
    Para este MVP usa SQLite local, administrado exclusivamente por el backend,
    para persistir simulaciones; aísla su acceso detrás de un repositorio y no
    expongas el archivo de base de datos al frontend. Marca cada supuesto como
    supuesto; no inventes autenticación, endpoints ni integraciones bancarias que
    no estén en los insumos. Explica las alternativas descartadas y sus consecuencias.
    Antes de crear o editar un documento, enumera los archivos destino; después
    verifica consistencia entre componentes, endpoints, RF y diagramas Mermaid.
  groups:
    - read
    - edit
    - skill
    - todo
```

Cuando Bob termine, verifica que `software-architect` aparece en el selector de
modos.

### Paso 3 — Crear el Skill de arquitectura

Selecciona `software-architect`. En el chat de Bob, copia y envía este mensaje:

```markdown
Crea el Skill del proyecto en
.bob/skills/arquitectura-simulador-credito/SKILL.md con este contenido:

---
name: arquitectura-simulador-credito
description: Mantiene decisiones de arquitectura trazables para el simulador.
---

Objetivo: diseñar una arquitectura implementable y trazable para el Simulador
de Crédito.

Fuentes de verdad: docs/requisitos/historias-usuario-refinadas.md,
docs/requisitos/supuestos-y-decisiones.md, docs/contracts/tarifario-api.yaml y
docs/contracts/contacto-asesor-api.yaml. No sustituyas ni extiendas esos
contratos sin registrar la decisión.

Para todo diagrama, ADR o límite de API: separa cliente, API del simulador,
motor de cálculo, persistencia y servicios externos; relaciona componentes con
RF; especifica datos, errores y responsabilidades en cada frontera; y etiqueta
como SUPUESTO cualquier decisión no definida por el PRD.

Restricciones: el tarifario y contacto de asesor son dependencias externas; no
propongas reimplementarlos. Para el MVP, la persistencia es SQLite local,
encapsulada detrás de un repositorio del backend; no inventes autenticación,
core bancario ni acuerdos de disponibilidad. Toda decisión de stack debe incluir
alternativas consideradas, consecuencias y un criterio de reversión.

Control de salida: antes de editar enumera archivos y RF afectados. Después
verifica que nombres de endpoints, modelos y componentes coincidan en el ADR,
diagramas y contratos; reporta preguntas abiertas por separado.
```

Verifica que aparece en la pestaña **Skills** y aprueba su activación si Bob lo
solicita. Actívalo para los pasos restantes.

### Paso 4 — Entender los insumos con Ask

Selecciona el modo **Ask**. En el chat de Bob, pega y envía este prompt:

```text
Lee @docs/requisitos/historias-usuario-refinadas.md,
@docs/contracts/tarifario-api.yaml y @docs/contracts/contacto-asesor-api.yaml.
Resume los componentes necesarios, las responsabilidades de cada uno, los datos
que cruzan cada límite y las decisiones que el PRD no define. No crees archivos.
```

Revisa la respuesta. Si Bob asume una integración o dato que no aparece en los
insumos, anótalo como pregunta abierta, no como decisión.

### Paso 5 — Generar el diagrama

Cambia el selector al modo `software-architect`. Comprueba que el Skill
`arquitectura-simulador-credito` sigue activo. En el chat de Bob, pega y envía:

```text
Con el Skill arquitectura-simulador-credito activo, usa las historias y los dos
OpenAPI que acabamos de revisar. Crea
docs/arquitectura/architecture-diagram.md con:
1. un diagrama Mermaid de componentes;
2. un diagrama Mermaid de secuencia para simular crédito;
3. una tabla que relacione cada componente con los RF que cubre, incluida la
   persistencia SQLite local;
4. el límite entre el repositorio de simulaciones y SQLite, indicando que el
   archivo solo es accesible por el backend y no se versiona.
Marca los supuestos explícitamente.
```

Abre el archivo generado y confirma que el tarifario y el contacto de asesor se 
tratan como servicios externos.

### Paso 6 — Registrar la decisión de stack

En el mismo chat de Bob, envía:

```text
Usa el archivo adr-001-stack.md y el Skill
arquitectura-simulador-credito. Complétalo. Decide React + Carbon para
frontend, Node + Express + TypeScript para backend y SQLite local para
persistencia de simulaciones. Incluye contexto, decisión, alternativas
descartadas, consecuencias y criterio de reversión. Explica que el acceso a
SQLite queda detrás de un repositorio y que el archivo no se versiona. No
inventes una integración que no esté en los insumos.
```

### Paso 7 — Delimitar las APIs

En el mismo chat de Bob, sin cambiar de modo ni desactivar el Skill, envía:

```text
Crea docs/arquitectura/api-boundaries.md. Para cada API externa
indica: propósito, endpoint usado, datos enviados/recibidos, dueño del servicio,
qué debe hacer el simulador y qué no debe reimplementar. Incluye el contrato interno
propuesto para POST /api/simulaciones.
```

### Paso 8 — Verificar consistencia antes de continuar

Debes tener tres archivos en `docs/arquitectura/`: `architecture-diagram.md`,
`adr-001-stack.md` y `api-boundaries.md`. Léelos y verifica que los nombres de
componentes, endpoints y RF sean consistentes. Luego continúa al Lab 04.
