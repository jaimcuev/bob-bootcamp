# Lab 09 — Mantenimiento y Operación

## 1. Objetivo del lab

Cerrar el ciclo del SDLC con la fase de **Mantenimiento**: triage de un incidente real (tasa desactualizada, el riesgo ya identificado en la sección 10.1 del PRD desde el Lab 01), implementación de un hotfix con Bob, postmortem, y planificación del backlog de la fase 2 (las "preguntas abiertas" del PRD que quedaron pendientes). Se cierra además con una revisión de **Bobalytics** para medir cómo usó Bob el equipo durante todo el bootcamp.

## Roles involucrados

| Rol | Qué hace en este lab |
|---|---|
| SRE / Soporte | Detecta y hace triage del incidente. |
| Developers | Implementan el hotfix y la regresión. |
| Product Owner | Prioriza backlog v2 y revisa aprendizajes. |

## 2. Prerequisitos

- Lab 08 completado: pipeline de CI funcionando, release notes y runbooks guardados en `docs/release/`, y v1.0.0 "desplegada" en staging simulado.

## 3. Artefactos de entrada

### Insumos

- `bug-ejemplo.md` — un bug de ejemplo (tasa TEA desactualizada en el tarifario mock) para practicar el flujo completo de triage → hotfix → postmortem.

Antes del Paso 1, crea `docs/operacion/incident-report.md` y pega:

```markdown
# Incident Report — [Título]
**Fecha detección:**
**Severidad:**
**Reportado por:**
## Qué pasó
## Impacto
## Causa raíz
## Cómo se detectó
## Resolución
## Acciones preventivas
```

Para el Paso 6, crea `docs/operacion/bobalytics-review.md` con:

```markdown
# Revisión de Bobalytics — [Período]
## Tasa de adopción
## Bob factor
## Gasto en Bobcoins
## Aprendizajes del equipo
## Acciones a tomar
```

## 4. Paso a paso con Bob

### Modo recomendado — `incident-commander`

`incident-commander` delimita impacto, coordina el hotfix y documenta el
postmortem. Úsalo en los pasos 2–5; el Paso 1 se hace en Ask para un triage sin cambios.

### Paso 0 — Verificar y activar el modo

En **Configuración → Modos → Crear modo**, completa todos los campos:

- **Identificador:** `incident-commander`
- **Nombre visible:** Incident commander
- **Descripción:** Hace triage, coordina hotfixes y documenta el aprendizaje operativo.
- **Rol del modo:** Eres Incident Commander técnico para sistemas de crédito de Banco ACME.
- **Cuándo usarlo:** Para investigar incidentes y cerrar el postmortem.
- **Instrucciones:** Pega el siguiente texto completo:

  ```text
  Coordina incidentes del Simulador de Crédito con precisión y trazabilidad.
  Separa hechos comprobados, hipótesis y evidencia; delimita usuarios, datos,
  productos y período afectados antes de proponer un fix. Prioriza seguridad,
  exactitud de importes y comunicación responsable.
  Para cambios de tasas, seguros o fórmulas exige prueba de regresión, revisión
  de código y aprobación de Riesgos y Compliance. No declares resuelto un
  incidente por una hipótesis, no ocultes impacto y no ejecutes cambios amplios
  sin mapa de dependencias. Antes de editar, muestra archivos, pruebas y riesgos;
  después deja evidencia del fix, validación, rollback y acciones preventivas.
  El postmortem no busca culpables: documenta línea de tiempo, causa raíz,
  impacto, corrección y acciones con responsable.
  ```
- **Herramientas:** activa lectura, edición, ejecución, skills, tareas y subagents.

Guarda el modo y selecciónalo antes de iniciar el Paso 2.

### Paso 0.1 — Crear el Skill de respuesta a incidentes

En **Skills → Crear Skill**, completa y guarda estos campos:

- **Nombre:** `respuesta-incidente-tarifario`
- **Descripción:** Investiga y corrige incidentes de tarifario con evidencia, regresión y rollback.
- **Instrucciones:**

  ```text
  Objetivo: responder a incidentes que afecten tasas, seguros, reglas de cálculo
  o resultados mostrados por el Simulador de Crédito.

  Fuentes de verdad: el reporte de incidente, docs/arquitectura/formulas-negocio.md,
  docs/contracts/tarifario-api.yaml, backend-seed/tarifario-seed.json, pruebas y
  historial Git. Distingue hecho, hipótesis y dato pendiente en todo diagnóstico.

  Procedimiento: identifica alcance e impacto; crea un mapa de consumidores del
  tarifario; formula una hipótesis comprobable; aplica el cambio mínimo; añade
  regresión; ejecuta pruebas unitarias, integración y el pipeline aplicable; y
  define un rollback por revert. Tasas fuera de rango deben rechazarse de forma
  explícita. Ningún cambio de fórmula o tarifario se considera cerrado sin revisión
  de Riesgos y Compliance.

  Salida: antes de editar enumera archivos, consumidores, evidencia y riesgos.
  Después, registra causa raíz, validación, impacto residual, rollback y acciones
  preventivas con responsable. No atribuyas culpa a personas ni inventes evidencia.
  ```

Activa `respuesta-incidente-tarifario` antes del Paso 1 y mantenlo activo durante
los pasos 2–5.

### Paso 1 — Triage del incidente (modo Ask)
```
Con el Skill respuesta-incidente-tarifario activo, lee @artefactos/bug-ejemplo.md. Con base en el código del motor de cálculo y el
cliente del tarifario, dame un diagnóstico probable de la causa raíz y el nivel
de severidad (dado que afecta una cifra mostrada a clientes de un banco).
```

### Paso 2 — Crear y usar una persona para mapear el impacto (cambia a `incident-commander`)
Los subagents solo se pueden lanzar en modos que los permitan; Ask no puede iniciarlos. Cambia de Ask a `incident-commander` con `Ctrl+.`.
En la pantalla de subagents, crea la persona `tarifario-impact-analyst` con acceso
solo a lectura y pega este contenido:

```markdown
---
name: tarifario-impact-analyst
description: Maps the impact of tariff and credit-rate changes. Read-only.
tools:
- read
---

You are a Banco ACME incident analyst. Trace every direct and indirect consumer
of tariff data, TEA, insurance rates, and validation ranges. Return a table with
File, dependency or field, impact if the range changes, and evidence. Separate
confirmed facts from assumptions. Do not edit files or propose a fix.
```

Antes de tocar código, quieres saber en cuántos lugares del repo se consume el tarifario sin llenar tu conversación principal con los resultados de una búsqueda exhaustiva. Esta persona especializa al subagent de exploración y conserva un límite de solo lectura.
```
Usa la persona tarifario-impact-analyst en un subagent de exploración para mapear
todos los archivos del repo que consumen tarifarioClient o que leen tasas TEA/de
seguro directamente. Devuelve la tabla definida por la persona y un resumen de
qué se rompería si cambio la validación de rangos.
```
Aprueba el subagent cuando Bob lo solicite.

### Paso 3 — Implementar el hotfix (sigue en `incident-commander`)
```
Con el Skill respuesta-incidente-tarifario activo y con ese mapa de impacto, implementa el fix para @artefactos/bug-ejemplo.md: el
mock de tarifario debe versionar las tasas y el backend debe rechazar
explícitamente una tasa fuera del rango TEA mínima/máxima del producto en vez
de aceptarla silenciosamente. Agrega una prueba de regresión para este caso.
```
Antes de abrir el PR, corre `/review` sobre el fix.

### Paso 4 — Postmortem (sigue en `incident-commander`)
```
Con el Skill respuesta-incidente-tarifario activo, redacta un postmortem del incidente: qué pasó, impacto, causa raíz, cómo se
detectó, el fix aplicado, y 2-3 acciones preventivas (p. ej. una prueba de
regresión automática de rangos de tasa en el pipeline de CI del Lab 08).
Guarda en docs/operacion/postmortem.md.
```
Si necesitas confirmar exactamente qué introdujo el bug, puedes preguntar directamente por un commit puntual: `¿qué cambió el commit @a1b2c3d que tocó el tarifario-seed.json?` La mención `@<hash>` trae el mensaje, autor, fecha y diff completo de ese commit al chat, útil para reconstruir la causa raíz sin buscar manualmente en el historial de Git.

### Paso 5 — Backlog v2 (sigue en `incident-commander`)
```
Con el Skill respuesta-incidente-tarifario activo, primero copia `risk-register.md` y `supuestos-y-decisiones.md` desde el bootcamp
a `docs/requisitos/` del proyecto. Luego, usando
@docs/requisitos/risk-register.md y @docs/requisitos/supuestos-y-decisiones.md, arma el
backlog de la fase 2: integración con solicitud real de crédito, autenticación,
evaluación crediticia, captura de contacto para envío por correo. Prioriza con
MoSCoW. Guarda en docs/operacion/backlog-v2-mejoras.md.
```

### Paso 6 — Revisión de Bobalytics
Como cierre del bootcamp, entra al portal de Bob ([bob.ibm.com](https://bob.ibm.com)) → **Admin** → **Bobalytics**, y revisa con el equipo:
- Tasa de adopción durante el bootcamp.
- Bob factor (líneas de código generadas por Bob en el repo `simulador-credito-banco-acme`).
- Gasto en Bobcoins de los 9 labs.

Documenta hallazgos y aprendizajes en `docs/operacion/bobalytics-review.md` usando
la estructura incluida al inicio de este lab.

## 5. Al completar el lab

- `docs/operacion/postmortem.md`, `backlog-v2-mejoras.md` y
  `bobalytics-review.md` creados.
- La persona `tarifario-impact-analyst` usada para el análisis de impacto.
