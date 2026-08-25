# Lab 01 — Planning

## 1. Objetivo del lab

Convertir el PRD "Simulador de Crédito v2" en un **plan de trabajo accionable**: un project charter, un roadmap por releases y un backlog de épicas priorizado. Esta es la fase de **Planificación** del SDLC ([IBM — SDLC](https://www.ibm.com/mx-es/think/topics/sdlc)): antes de tocar una línea de código o un requerimiento detallado, el equipo necesita entender el alcance, los riesgos y el orden de trabajo.

## Roles involucrados

| Rol | Qué hace en este lab |
|---|---|
| Product Owner / Product Manager | Decide prioridades de negocio y valida el roadmap. |
| Tech Lead | Traduce alcance a riesgos técnicos y estima complejidad relativa. |
| Scrum Master | Facilita la priorización y estructura el backlog inicial. |

## 2. Prerequisitos

- Haber leído el PRD completo al menos una vez.
- Acceso a Bob IDE en modo Advanced, necesario para usar Skills.
- Un proyecto nuevo `simulador-credito-banco-acme` abierto en Bob.

## 3. Paso a paso con Bob

### Paso 1 — Preparar los insumos del proyecto

En el proyecto `simulador-credito-banco-acme`, crea las carpetas `docs/fuente/`
y `docs/plan/`. Copia manualmente el PRD del bootcamp a
`docs/fuente/PRD_Simulador_de_Credito_v2.pdf`. Después crea
`docs/plan/project-charter.md` y pega esta plantilla:

```markdown
# Project Charter — [Nombre del producto]

## Objetivo del proyecto

## Alcance
### In scope
### Out of scope

## Stakeholders
| Rol | Persona/Área | Interés |
|---|---|---|

## Supuestos

## Riesgos principales
| Riesgo | Impacto | Responsable |
|---|---|---|

## Criterios de éxito del MVP
```

### Paso 2 — Crear el modo `product-planner`

En **Configuración → Modos → + (crear nuevo Modo)**, completa todos los campos:

- **Identificador:** `product-planner`
- **Nombre visible:** Product planner
- **Ubicación de guardado:** proyecto (`.bob/custom_modes.yaml`)
- **Descripción:** Convierte el PRD en alcance, riesgos, épicas y roadmap verificables.
- **Rol del modo:** Eres Product Manager de planificación para Banco ACME.
- **Cuándo usarlo:** Para planificar el desarrollo de una aplicación, previo al diseño y desarrollo.
- **Instrucciones:** Pega el siguiente texto completo:

  ```text
  Trabaja como Product Manager de Banco ACME para el Simulador de Crédito.
  Fuente de verdad: el PRD y los documentos de docs/plan/. Distingue siempre
  hechos del PRD, supuestos del equipo, riesgos y preguntas abiertas.
  Conserva los identificadores RF-01 a RF-18 y relaciona cada épica, prioridad
  y decisión con los RF que la sustentan. Para cada propuesta explica el valor
  para el cliente, el riesgo que reduce y el responsable que debe validarla.
  No inventes fechas, presupuesto, políticas bancarias, aprobaciones ni
  integraciones. Si falta un dato, registra una pregunta abierta con el área
  responsable en lugar de completarlo por inferencia. Antes de sobrescribir un
  documento, muestra los archivos que editarás y conserva las decisiones ya
  aceptadas salvo que el usuario pida cambiarlas explícitamente.
  ```
- **Herramientas:** activa lectura, edición, skills y tareas; deja ejecución de
  comandos desactivada.

Guarda el modo. Se usará para crear artefactos de planificación; los pasos de
lectura se harán en modo Ask.

### Paso 3 — Crear el Skill de planificación

Selecciona `product-planner`. En el chat de Bob, copia y envía el siguiente
mensaje para crear un Skill específico del proyecto:

```markdown
Crea el Skill del proyecto en
.bob/skills/planificacion-simulador-credito/SKILL.md. El archivo debe contener
este frontmatter YAML y estas instrucciones:

---
name: planificacion-simulador-credito
description: Convierte el PRD en alcance, riesgos, épicas y roadmap trazables.
---

Objetivo: apoyar decisiones de planificación del Simulador de Crédito sin
alterar el alcance definido por el PRD.

Fuentes de verdad, en este orden: docs/fuente/PRD_Simulador_de_Credito_v2.pdf;
docs/plan/project-charter.md; docs/plan/risk-register.md; y las épicas ya
aceptadas. Cita el RF o sección del PRD que sustenta cada decisión.

Al crear un artefacto: usa tablas cuando haya prioridades, responsables o
dependencias; separa alcance MVP, fuera de alcance y fase 2; registra riesgos
con impacto y responsable; y conserva las preguntas abiertas si el PRD no las
resuelve. No definas fechas, costos, cumplimiento regulatorio ni integraciones
como hechos si no figuran en los insumos.

Antes de editar, indica el archivo destino y los RF que cubrirás. Después de
editar, resume las decisiones tomadas, los supuestos nuevos y las preguntas que
requieren validación humana.
```

Cuando Bob termine, verifica que el archivo existe y que el Skill aparece en la
pestaña **Skills**. Aprueba su activación si Bob la solicita. Úsalo desde el
Paso 5 e incluye la frase “Con el Skill planificacion-simulador-credito activo”
al comienzo de cada prompt que cree un artefacto.

### Paso 4 — Explorar el PRD sin modificar nada (modo Ask)
Cambia a modo **Ask** (`Ctrl+.` o el selector de modo). Este modo no edita archivos, ideal para una primera lectura guiada.

Prompt sugerido:
```
Lee @docs/fuente/PRD_Simulador_de_Credito_v2.pdf y dame un resumen ejecutivo de una página:
visión del producto, problema que resuelve, stakeholders, alcance (in/out of scope)
y los riesgos y preguntas abiertas que identifica el documento.
```

> 💡 Bob puede leer PDFs directamente mediante una mención como `@archivo.pdf`; no necesitas extraer el texto manualmente.

### Paso 5 — Identificar riesgos y preguntas abiertas
Vuelve a seleccionar **`product-planner`**. Este es el modo del lab para guardar
artefactos de planificación sin habilitar ejecución de comandos.

Prompt sugerido:

```
Con el Skill planificacion-simulador-credito activo, de la sección 10 del PRD,
lista los riesgos y las preguntas abiertas.
Para cada uno, sugiere quién en Banco ACME (qué rol/área) debería resolverlo
antes de iniciar el desarrollo. Guárdalo en docs/plan/risk-register.md
```

### Paso 6 — Generar el project charter (modo `product-planner`)
Sigue en modo **`product-planner`**.

Prompt sugerido:
```
Con el Skill planificacion-simulador-credito activo, usa
@docs/fuente/PRD_Simulador_de_Credito_v2.pdf y el archivo project-charter.md que
acabaste de crear para completar el project charter del Simulador de Crédito: objetivo, alcance
(in/out of scope tal como está en el PRD), stakeholders, supuestos, riesgos
principales y criterios de éxito del MVP. Guárdalo en docs/plan/project-charter.md.
```
Revisa el resultado y ajusta manualmente donde el PO tenga contexto adicional que Bob no puede inferir del PRD (p. ej. fecha límite real, presupuesto).

### Paso 7 — Backlog de épicas priorizado (sigue en `product-planner`)
```
Con el Skill planificacion-simulador-credito activo, a partir de los requerimientos funcionales RF-01 a RF-18 del PRD, agrúpalos en
épicas (5-8 máximo). Para cada épica dame: nombre, RFs que incluye, y una
priorización MoSCoW (Must/Should/Could/Won't) justificada para un MVP de fase 1
que NO se conecta al core bancario. Guárdalo en docs/plan/epicas-priorizadas.md.
```

### Paso 8 — Roadmap por releases (sigue en `product-planner`)
```
Con el Skill planificacion-simulador-credito activo, con las épicas priorizadas, propone un roadmap de 2 releases: MVP (fase 1, sin
integración a core) y una fase 2 futura que resuelva las preguntas abiertas del
PRD (integración con solicitud real de crédito, autenticación, captura de datos
de contacto). Preséntalo como tabla en docs/plan/roadmap.md.
```

## 4. Al completar el lab

En `docs/plan/` debes tener:

- `project-charter.md`
- `risk-register.md`
- `epicas-priorizadas.md`
- `roadmap.md`

Estos 4 documentos son el insumo de entrada del **Lab 02 — Requerimientos y Análisis**.
