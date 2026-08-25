# Lab 08 — Deployment / Release

## 1. Objetivo del lab

Construir un pipeline de CI en GitHub Actions y generar las release notes de la
primera versión del simulador.

## Roles involucrados

| Rol | Qué hace en este lab |
|---|---|
| DevOps / Platform Engineer | Construye el pipeline de CI/CD. |
| Tech Lead | Revisa estrategia de branching y gate de aprobación. |

## 2. Prerequisitos

- Lab 07 completado: tests en verde y `docs/qa/bob-findings-report.md` sin hallazgos críticos abiertos.
- Repositorio `simulador-credito-banco-acme` con al menos un PR mergeado a `main`.
- Bob IDE con permisos de edición y ejecución.

## 3. Artefactos de entrada

### Insumos

Antes de crear el workflow, adopta esta estrategia: `main` está protegida y siempre
desplegable; crea una rama `feature/*` o `fix/*` por cambio; haz merge mediante PR
con revisión y CI en verde; libera desde `main`, sin ramas largas de release.

Antes del Paso 4, crea `docs/release/release-notes.md` y pega:

```markdown
# Release Notes — v[X.Y.Z]
**Fecha:**
## Features
## Fixes
## Chores / internos
```

## 4. Paso a paso con Bob

### Modo recomendado — `release-engineer`

`release-engineer` exige revisión humana de cambios de infraestructura y prohíbe
escribir secretos o simular aprobaciones. Se usa durante todos los pasos del lab.

### Paso 0 — Verificar y activar el modo

En **Configuración → Modos → Crear modo**, completa todos los campos:

- **Identificador:** `release-engineer`
- **Nombre visible:** Release engineer
- **Descripción:** Prepara CI, release notes y rollback con controles de cambio.
- **Rol del modo:** Eres DevOps y Release Engineer de Banco ACME.
- **Instrucciones:** Pega el siguiente texto completo:

  ```text
  Opera como Release Engineer para el Simulador de Crédito. Trata los workflows,
  dependencias, variables de entorno y despliegues como cambios sensibles. Nunca
  escribas, reveles ni uses secretos; tampoco simules aprobaciones humanas o un
  despliegue real. Usa archivos ignorados para .env, certificados y llaves.
  Antes de editar CI, explica jobs, permisos, triggers, artefactos, gate y plan
  de rollback; pide revisión humana para cambios en .github/workflows/ o
  dependencias. El pipeline debe ejecutar verificación, pruebas y build antes del
  staging simulado. Conserva trazabilidad de commit, PR, versión y evidencia.
  Si un paso falla, diagnostica con el log y propone el cambio mínimo. Después de
  editar, valida YAML, ejecuta los comandos equivalentes localmente y documenta
  el resultado, la condición de aprobación y cómo revertir el cambio.
  ```
- **Herramientas:** activa lectura, edición, ejecución, skills y tareas.

Guarda el modo y selecciónalo antes de revisar o generar CI.

### Paso 0.1 — Crear el Skill de release seguro

En **Skills → Crear Skill**, completa y guarda lo siguiente:

- **Nombre:** `release-seguro-simulador`
- **Descripción:** Construye CI, release notes y rollback con trazabilidad y controles humanos.
- **Instrucciones:**

  ```text
  Objetivo: preparar una liberación verificable del Simulador de Crédito sin
  exponer secretos ni omitir controles.

  Fuentes de verdad: package.json de frontend y backend, resultados del Lab 07,
  .github/workflows/ si existe y docs/release/. Antes de editar, identifica los
  comandos reales de lint, typecheck, test y build de cada paquete; no inventes
  scripts ni hosting.

  Reglas: ningún secreto en código, logs, YAML o documentación; staging es
  simulado; deploy requiere Environment y aprobación humana; main permanece
  desplegable; cada cambio debe poder revertirse con un PR de revert. El workflow
  debe separar verificación, build y deploy, y detener el deploy si falla una
  verificación previa.

  Salida requerida: antes de editar enumera archivos, permisos y riesgos. Después
  de editar, explica triggers, jobs, dependencias, gate, evidencia de ejecución,
  versión liberada y pasos de rollback. Si falta una aprobación o secreto, deja
  el paso bloqueado y explica quién debe resolverlo.
  ```

Activa `release-seguro-simulador` antes de los pasos 1–5. Incluye su nombre en
cada prompt que envíes a Bob.

### Antes de empezar — Confirmar el alcance seguro
Verifica que ningún secreto aparece en el workspace o diff. Abre `AGENTS.md` y
agrega al final este bloque sin eliminar las secciones anteriores:

```markdown
## Cambios de release
- No incluyas secretos, claves, tokens ni credenciales en código, YAML, logs o documentación.
- Todo cambio en `.github/workflows/` o dependencias requiere revisión humana antes del merge.
- El despliegue a staging requiere aprobación humana y un plan de rollback probado.
- No marques una liberación como completada si lint, pruebas o build fallan.
```

Guarda el archivo e inclúyelo en el PR de release.

### Paso 1 — Generar el workflow de CI (modo `release-engineer`)

El workflow es un archivo YAML en `.github/workflows/ci.yml` que GitHub lee automáticamente y ejecuta en sus servidores cada vez que hacés push o abrís un PR. Define tres jobs en secuencia:

```
lint-and-test (backend + frontend en paralelo)
      ↓ solo si pasan
build (backend + frontend en paralelo)
      ↓ solo si pasan + aprobación manual
deploy-staging (simulado)
```

Para generarlo:
```
Con el Skill release-seguro-simulador activo, genera .github/workflows/ci.yml para este repo (frontend con Vite, backend con
Node/Express + TypeScript). El workflow debe: instalar dependencias de ambos
paquetes, correr typecheck y tests, hacer build de frontend y backend, y terminar
con un job "deploy-staging" que solo se ejecuta si los pasos anteriores pasan,
requiere aprobación manual (GitHub Environment protection rule) y simula el deploy
imprimiendo los datos del commit (sin publicar a ningún hosting real).
```

Revisá el YAML generado antes de aceptarlo — es infraestructura, no solo código de aplicación. Si el pipeline falla después del push, copiá el log de GitHub Actions y pegalo en el chat para que Bob lo corrija. También podés reproducirlo localmente antes de hacer push (ver Paso 3).

### Paso 2 — Configurar el gate de aprobación manual
El workflow usa `environment: staging` en el job `deploy-staging`. GitHub busca ese environment y, si tiene **Required reviewers** activado, pausa el job hasta que alguien apruebe manualmente — sin eso el job falla o corre sin control.

Para crearlo: GitHub → **Settings** → **Environments** → **New environment** → nombre: `staging` → activá **Required reviewers** y agregá tu usuario.

Una vez configurado, cada vez que el build pase, el job `deploy-staging` quedará en estado **"Waiting"** en la pestaña Actions hasta que lo apruebes. Esto simula el control de cambios que tendría un deploy real en Banco ACME.

### Paso 3 — Ejecutar el pipeline
Antes de hacer push, corre localmente los mismos comandos que el workflow (`npm ci && npm run lint && npm test && npm run build` en cada paquete) — es más rápido depurar en tu máquina que iterando sobre GitHub Actions. Si algo falla:
```
@terminal ¿por qué falló este comando? Ayúdame a corregirlo antes de hacer push.
```
`@terminal` trae la salida completa del último comando al chat sin que tengas que copiarla; úsalo para depurar errores de build o de instalación de dependencias.

Con el pipeline pasando en local, haz push de una rama con un cambio pequeño (p. ej. un fix del Lab 07) y abre un PR. Verifica en la pestaña **Actions** de GitHub que el pipeline corre install → lint → test → build, y que `deploy-staging` queda esperando aprobación.

### Paso 4 — Release notes
```
Con el Skill release-seguro-simulador activo, genera las release notes de la v1.0.0 del Simulador de Crédito a partir del
historial de commits y PRs mergeados hasta ahora. Agrupa por tipo (feat, fix,
chore) siguiendo conventional commits. Guarda en docs/release/release-notes.md.
```

### Paso 5 — Runbook y plan de rollback
```
Con el Skill release-seguro-simulador activo, usando el workflow en @.github/workflows/ci.yml, genera dos documentos:
1. docs/release/deployment-runbook.md: pasos para ejecutar un deploy a staging,
   incluyendo cómo verificar que el pipeline pasó, cómo aprobar el gate
   y cómo confirmar que el deploy fue exitoso.
2. docs/release/rollback-plan.md: pasos para revertir un deploy fallido,
   incluyendo cómo revertir el merge a main y re-disparar el pipeline.
```

## 5. Al completar el lab

- `.github/workflows/ci.yml` creado.
- `docs/release/release-notes.md`, `deployment-runbook.md` y `rollback-plan.md` creados.
