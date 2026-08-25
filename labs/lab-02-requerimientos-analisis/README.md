# Lab 02 — Requerimientos y Análisis

## 1. Objetivo del lab

Refinar los requerimientos funcionales del PRD (RF-01 a RF-18) a **historias de usuario en formato INVEST** con criterios de aceptación Gherkin más granulares, construir una **matriz de trazabilidad** y dejar documentadas las decisiones tomadas frente a las preguntas abiertas del PRD. Esta es la fase de **Análisis de requerimientos** del SDLC: se pasa de "qué quiere el negocio" a "qué debe construir el equipo, con qué límites exactos".

## Roles involucrados

| Rol | Qué hace en este lab |
|---|---|
| Business Analyst | Refina historias y matriz de trazabilidad. |
| Product Owner | Valida la intención de negocio. |
| QA Lead | Define criterios de aceptación que luego se puedan probar. |

## 2. Prerequisitos

- Lab 01 completado: `epicas-priorizadas.md` y `risk-register.md` disponibles.
- Bob IDE en modo Advanced, con los modos **Ask** y **Plan** disponibles.

## 3. Paso a paso con Bob

### Paso 1 — Preparar los archivos de requisitos

Confirma que el PRD del Lab 01 existe en
`docs/fuente/PRD_Simulador_de_Credito_v2.pdf`. Crea la carpeta
`docs/requisitos/` y el archivo `docs/requisitos/historias-usuario-refinadas.md`
con esta plantilla para cada historia:

````markdown
## [ID] — [Título]
**Épica:** [Nombre]
**RF relacionado:** [RF-XX]
**Como** [rol]
**Quiero** [acción]
**Para** [beneficio]

### Criterios de aceptación
```gherkin
Dado que ...
Cuando ...
Entonces ...
```
````

También crea `docs/requisitos/matriz-trazabilidad.csv` con:

```csv
RF,Epica,Historia,Criterio de aceptacion,Estado
RF-01,,,,Pendiente
```

### Paso 2 — Crear el modo `requirements-analyst`

Selecciona el modo **Plan**. En el chat de Bob, copia y envía este mensaje. Debe
actualizar la configuración del proyecto sin eliminar el modo `product-planner`
creado en el Lab 01:

```markdown
Actualiza .bob/custom_modes.yaml y conserva los modos existentes. Agrega este
modo dentro de customModes:

- slug: requirements-analyst
  name: Requirements analyst
  description: Refina requisitos y conserva la trazabilidad hasta las pruebas.
  roleDefinition: Eres Business Analyst senior especializado en productos de crédito.
  whenToUse: Para analizar historias, criterios, decisiones y trazabilidad de requisitos.
  customInstructions: |
    Trabaja como Business Analyst senior para un producto de crédito. Usa el PRD
    y docs/plan/ como fuentes de verdad. Conserva exactamente los identificadores
    RF-01 a RF-18 y no combines, elimines ni cambies la intención de un RF sin
    registrarlo como decisión pendiente.
    Escribe historias INVEST con un actor, acción y beneficio concretos. Cada
    criterio debe poder verificarse y usar Dado/Cuando/Entonces cuando describa
    comportamiento. Separa reglas de negocio, validaciones, excepciones y datos
    faltantes. Registra para cada supuesto su fuente, impacto y responsable de
    validación. No inventes políticas, tasas, canales de integración ni requisitos
    regulatorios. Antes de editar indica qué documentos actualizarás; al terminar,
    informa RF cubiertos, RF pendientes y decisiones que requieren confirmación.
  groups:
    - read
    - edit
    - skill
    - todo
```

Cuando Bob termine, verifica que `requirements-analyst` aparece en el selector
de modos.

### Paso 3 — Crear el Skill de trazabilidad de requisitos

Selecciona `requirements-analyst`. En el chat de Bob, copia y envía este mensaje:

```markdown
Crea el Skill del proyecto en
.bob/skills/trazabilidad-requisitos-credito/SKILL.md con este contenido:

---
name: trazabilidad-requisitos-credito
description: Mantiene RF, historias, criterios y pruebas trazables de extremo a extremo.
---

Objetivo: convertir el PRD del Simulador de Crédito en requisitos verificables.
Lee primero docs/fuente/PRD_Simulador_de_Credito_v2.pdf y los documentos de
docs/plan/. Conserva el identificador RF original en cada historia, criterio,
decisión y fila de la matriz.

Una historia debe incluir rol, necesidad, beneficio y 2 a 4 criterios
verificables. No aceptes criterios ambiguos como “debe ser fácil” o “rápido”;
solicita o registra una definición observable. Cada ambigüedad debe quedar en
supuestos-y-decisiones.md con fuente, impacto y dueño de la decisión.

Para la matriz de trazabilidad usa las columnas RF, Épica, Historia, Criterio de
aceptación y Estado. No marques un RF como completado sin evidencia. Antes de
editar, enumera los RF y archivos afectados; después, señala requisitos sin
historia, criterios sin RF y decisiones pendientes.
```

Verifica que aparece en la pestaña **Skills** y aprueba su activación si Bob lo
solicita. Actívalo a partir del Paso 5 y úsalo en los pasos restantes.

### Paso 4 — Aclarar reglas de negocio ambiguas (modo Ask)
```
Lee la sección 5 (Reglas de negocio) de @docs/fuente/PRD_Simulador_de_Credito_v2.pdf y
las preguntas abiertas en @docs/plan/risk-register.md. Identifica,
para cada campo de la tabla 5.1, cualquier caso donde el PRD sea ambiguo o
incompleto (p. ej. formato de exportación, dónde se almacena la simulación,
canal del botón de contacto).
```

### Paso 5 — Documentar las decisiones (cambia a `requirements-analyst`, mismo chat)
Sin abrir una conversación nueva, cambia con `Ctrl+.` (o el selector) a
**`requirements-analyst`**.
```
Con el Skill trazabilidad-requisitos-credito activo, usa las ambigüedades que acabas de identificar y las preguntas abiertas del
Lab 01, documenta la decisión que toma el equipo para este MVP frente a cada
una. Para el almacenamiento de simulaciones, registra la decisión de usar SQLite
local en un archivo administrado por el backend; el frontend no accede a ese
archivo. Guarda el resultado en docs/requisitos/supuestos-y-decisiones.md.
```

### Paso 6 — Refinar historias de usuario (sigue en `requirements-analyst`)
```
Con el Skill trazabilidad-requisitos-credito activo, usa @docs/fuente/PRD_Simulador_de_Credito_v2.pdf y la plantilla de historia
creada arriba, convierte cada RF-01 a RF-18 en una
historia de usuario formato INVEST: "Como [rol] quiero [acción] para [beneficio]",
con 2-4 criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces),
más específicos que los del PRD original. Agrupa por épica según
@docs/plan/epicas-priorizadas.md. Guarda el resultado en
docs/requisitos/historias-usuario-refinadas.md.
```

### Paso 7 — Matriz de trazabilidad (sigue en `requirements-analyst`)
```
Con el Skill trazabilidad-requisitos-credito activo, a partir de docs/requisitos/historias-usuario-refinadas.md, genera una matriz de
trazabilidad en CSV con columnas: RF, Épica, Historia, Criterio de aceptación,
Estado (Pendiente). Usa el formato de matriz creado arriba. Guarda el
resultado en docs/requisitos/matriz-trazabilidad.csv.
```
Esta matriz se reutiliza en el Lab 07 para verificar cobertura de pruebas.

### Paso 8 — Glosario de negocio (sigue en `requirements-analyst`)
```
Con el Skill trazabilidad-requisitos-credito activo, del PRD arma un glosario de negocio para el equipo técnico con: TEA, TEM,
cuota inicial, bono, período de gracia, cuotas dobles, seguro de desgravamen
(sin/con devolución), monto financiado. Usa lenguaje simple, un párrafo por
término. Guarda el resultado en docs/requisitos/glosario-negocio.md.
```

## 4. Al completar el lab

En `docs/requisitos/` debes tener:
- `historias-usuario-refinadas.md`
- `matriz-trazabilidad.csv`
- `glosario-negocio.md`
- `supuestos-y-decisiones.md`

Estos documentos alimentan los Labs 03 y 04, y el Lab 07 usa los criterios Gherkin como base de pruebas.
