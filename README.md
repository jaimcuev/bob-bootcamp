# Bootcamp Bob para el SDLC — Banco ACME
### Caso de negocio: Simulador de Crédito

Este bootcamp muestra a equipos de tecnología a usar **IBM Bob** a lo largo de **todo el ciclo de vida de desarrollo de software (SDLC)** — no solo como autocompletado de código — usando un caso de negocio real: el **Simulador de Crédito** descrito en el PRD adjunto (`/prd/PRD_Simulador_de_Credito_v2.pdf`).

El PRD **no se reescribe**: es la fuente de verdad de negocio, tal como llegaría de Producto en un banco real. A partir de ahí, el mismo caso avanza laboratorio por laboratorio — Planning → Requerimientos → Diseño → Desarrollo → Testing → Deployment → Mantenimiento — hasta convertirse en una aplicación funcional real, construida con Bob, versionada en GitHub y diseñada en Figma.

## Herramientas usadas

| Herramienta | Para qué |
|---|---|
| **IBM Bob** | Asistente de IA integrado al IDE: modos Ask/Plan/Agent y modos personalizados, reglas, exclusión de archivos, personas de subagents, revisión de código (`/review`, Bob Findings, Consejos de Bob), Skills, slash commands, generación de PRs y commits, menciones de contexto y Bobalytics. |
| **GitHub** | Control de versiones, Pull Requests, Issues, GitHub Actions (CI). |
| **Figma** | Wireframes y diseño UI basado en IBM Carbon Design System. |

## Convención de carpetas y de modos de Bob

Léela antes del Lab 01 — resuelve la duda más común del bootcamp: "¿esto lo escribo yo o lo escribe Bob?"

**`artefactos/`** y **`prd/`** — insumos que ya existen antes de empezar el lab (plantillas, PRD, OpenAPI, tarifario semilla). Nunca se crean durante el lab, solo se leen o se mencionan con `@`.

**Entregables** — crea cada archivo cuando el paso del lab lo indique y guárdalo
en `simulador-credito-banco-acme`, dentro de `docs/` o del código correspondiente.

**Modo de Bob y quién guarda el archivo** — esto es lo que generó la confusión inicial, así que quedó explícito en cada paso de cada lab. La regla:

| Modo | ¿Puede guardar archivos (`Edit`)? | Cuándo se usa en este bootcamp |
|---|---|---|
| **Ask** | No | Para consultar, entender o diagnosticar **sin** intención inmediata de tocar archivos — leer el PRD, aclarar una regla de negocio, mapear un campo a un componente, diagnosticar un incidente. Bob solo responde en el chat. |
| **Plan** | Sí | Para producir un documento/artefacto directamente — Bob edita/crea el archivo cuando el prompt se lo pide. |
| **Agent** | Sí (además de `Execute`) | Para escribir código y correr comandos — se usa en los labs 04-07 donde ya existe el repo. |

El bootcamp usa **Ask deliberadamente en varios labs** para mostrar cuándo conviene explorar sin riesgo de modificar nada — no es un accidente ni algo que "falta corregir". La regla que sí es fija: **cuando un paso en Ask termina necesitando guardar un archivo, el traspaso a Plan/Agent ocurre en el paso inmediatamente siguiente, en el mismo chat** (el cambio de modo con `Ctrl+.` no pierde el historial de la conversación — Bob conserva el contexto de lo que acaban de hablar en Ask). Nunca queda un resultado de Ask "flotando" varios pasos antes de guardarse — eso fue el problema real, no el uso de Ask en sí. Cuando el paso sí pide copiar algo manualmente en vez de cambiar de modo, lo dice explícitamente ("copia la respuesta...").


| Capacidad | Dónde se practica | Resultado esperado |
|---|---|---|
| Reglas globales de Bob (`~/.bob/rules/`) | Lab 00 | Crea una regla general aplicable a todos los proyectos y modos. |
| Reglas del proyecto (`AGENTS.md`) | Labs 01, 07 y 08 | Crea o amplía el archivo versionado con los acuerdos del equipo, QA y release. |
| Exclusión de archivos | Lab 04 | Configura exclusiones en Bob para secretos, certificados y artefactos locales. |
| Modos personalizados | Labs 01–09 | Crea y activa el modo indicado en cada lab desde Configuración → Modos. |
| Skills | Labs 01–09 | Crea el Skill indicado, pega sus instrucciones completas y actívalo antes de enviar los prompts del lab. |
| Personas de agentes | Lab 09 | Crea una persona de solo lectura desde la pantalla de subagents antes de analizar el impacto. |

Estas piezas se complementan: un modo limita la tarea principal, una regla fija convenciones persistentes, una persona especializa a un subagent y las exclusiones reducen el alcance de archivos a los que Bob puede acceder. No excluyas un insumo que necesitas para completar el lab.

| Lab | Skill que crearás | Para qué lo activarás |
|---|---|---|
| 01 | `planificacion-simulador-credito` | Alcance, riesgos, épicas y roadmap trazables al PRD. |
| 02 | `trazabilidad-requisitos-credito` | Historias, criterios y matriz RF. |
| 03 | `arquitectura-simulador-credito` | Diagramas, ADR y límites de API. |
| 04 | `ux-ui-simulador-credito` | Componentes Carbon, accesibilidad y contrato de frontend. |
| 05 | `reglas-negocio-credito` | Fórmulas, tarifario, validación y pruebas del backend. |
| 06 | `frontend-simulador-credito` | Integración accesible de React con la API. |
| 07 | `validacion-simulador` | Selección de capas y evidencia de pruebas. |
| 08 | `release-seguro-simulador` | CI, release notes, gate y rollback. |
| 09 | `respuesta-incidente-tarifario` | Triage, hotfix, regresión y postmortem. |

**Proyecto de trabajo:** crea y abre `simulador-credito-banco-acme` en el Lab 01.
Guarda allí los entregables y el código.

## Prerrequisitos antes de empezar

1. Acceso a **Bob IDE** con licencia activa para el equipo.
2. Cuenta de **GitHub** con permisos para crear un repositorio en la organización de Banco ACME (o un repo personal/sandbox para el bootcamp).
3. Workspace de **Figma** compartido con el equipo.
4. Node.js 18+ instalado localmente (para los Labs 04–08).
5. Haber leído el PRD (`/prd/PRD_Simulador_de_Credito_v2.pdf`) al menos una vez antes del Lab 01.

## Glosario de roles (Banco ACME)

| Rol | Participa en |
|---|---|
| **Product Owner / Product Manager** | Lab 01, 02, 09 |
| **Scrum Master** | Lab 01 |
| **Business Analyst** | Lab 02 |
| **QA Lead / QA Engineer** | Labs 02, 07 |
| **UX/UI Designer** | Lab 04 |
| **Arquitecto de Software / Tech Lead** | Labs 03, 08 |
| **Developer Frontend/Backend** | Labs 05–07, 09 |
| **DevOps / Platform Engineer** | Lab 08 |
| **SRE / Soporte** | Lab 09 |

## Mapa de laboratorios

| # | Lab | Fase del SDLC | Rol principal | Modo(s) de Bob | Resultado clave |
|---|---|---|---|---|---|
| 00 | [Setup y acuerdos de Bob](labs/lab-00-setup/README.md) | Preparación | Todo el equipo / Tech Lead | Agent → Ask | Regla global creada y validada |
| 01 | [Planning](labs/lab-01-planning/README.md) | Planificación | Product Owner / Tech Lead | `product-planner` → Ask → `product-planner` | `roadmap.md`, `epicas-priorizadas.md` |
| 02 | [Requerimientos y Análisis](labs/lab-02-requerimientos-analisis/README.md) | Análisis de requerimientos | Business Analyst | Plan → `requirements-analyst` → Ask → `requirements-analyst` | `historias-usuario-refinadas.md`, `matriz-trazabilidad.csv` |
| 03 | [Arquitectura](labs/lab-03-arquitectura/README.md) | Diseño | Arquitecto | Plan → `software-architect` → Ask → `software-architect` | `architecture-diagram.md`, `adr-001-stack.md` |
| 04 | [UX/UI: integración Bob + Figma](labs/lab-04-ux-ui/README.md) | Diseño | UX/UI + Frontend | Demostración Bob–Figma | Frontend inicial generado en `output/frontend/` |
| 05 | [Backend](labs/lab-05-backend/README.md) | Implementación | Backend Developer | Agent + modo personalizado | Motor, API, mock y pruebas backend |
| 06 | [Frontend](labs/lab-06-frontend/README.md) | Implementación | Frontend Developer | Agent + modo personalizado | Frontend generado desde Figma mejorado e integrado al backend |
| 07 | [Testing / QA](labs/lab-07-testing-qa/README.md) | Pruebas | QA Engineer | Agent + `/review` | Plan, suites y findings |
| 08 | [Deployment / Release](labs/lab-08-deployment-release/README.md) | Despliegue | DevOps | Agent | CI, release notes y rollback |
| 09 | [Mantenimiento y Operación](labs/lab-09-mantenimiento-operacion/README.md) | Mantenimiento | SRE / PO | Ask → Agent | Postmortem y backlog v2 |

Salvo el Lab 00, cada lab consume los documentos creados en el proyecto durante el
lab anterior. El bootcamp se recorre en orden.

## Referencias externas

- [SDLC — IBM](https://www.ibm.com/mx-es/think/topics/sdlc)
- [AI in SDLC — IBM](https://www.ibm.com/think/topics/ai-in-sdlc)
- [Documentación de Bob IDE](https://bob.ibm.com/docs/ide)

## Checklist personal

- [ ] Tengo acceso a Bob IDE antes del Lab 00; GitHub y Figma antes del Lab 01.
- [ ] `AGENTS.md` no contiene secretos y está versionado en el repositorio del proyecto.
- [ ] Puedo abrir el PRD (`/prd/PRD_Simulador_de_Credito_v2.pdf`) desde el workspace.
- [ ] Completé los entregables indicados antes de continuar al siguiente lab.
- [ ] Revisé Bobalytics al terminar el Lab 09.
