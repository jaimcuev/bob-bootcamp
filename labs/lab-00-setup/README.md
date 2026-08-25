# Lab 00 — Setup y acuerdos de Bob

## 1. Objetivo del lab

Prepara Bob y crea una regla global que guíe el trabajo durante el SDLC. La
regla vive en `~/.bob/rules/` y se aplica a todos los proyectos.

## Roles involucrados

| Rol | Qué hace en este lab |
|---|---|
| Participante | Verifica Bob y crea la regla general de ingeniería. |
| Tech Lead | Define las convenciones generales que deberá aplicar Bob. |

## 2. Prerrequisitos

- Bob IDE instalado y con una licencia activa.
- Un workspace abierto en Bob para enviar el mensaje de creación; puede ser esta
  carpeta del bootcamp.

## 3. Paso a paso con Bob

### Paso 1 — Crear la regla global

Abre un workspace en Bob y selecciona un modo que permita editar archivos. En el
chat de Bob, copia y envía este mensaje completo:

```markdown
Crea una regla global para Bob con lo siguiente:

# Acuerdos generales
- Usa camelCase para variables y funciones, PascalCase para componentes, clases y tipos,
  y kebab-case para nombres de archivos.
- Mantén el código y los identificadores técnicos en inglés; escribe documentación funcional,
  descripciones de PR y explicaciones al negocio en español.
- Antes de editar, indica los archivos que esperas modificar y los supuestos relevantes.
- No inventes requisitos, políticas, cifras ni fórmulas: declara la duda o el supuesto.
- Antes de ejecutar una acción destructiva o que cambie dependencias, pide confirmación.
- Al terminar, resume los cambios realizados y las validaciones ejecutadas.
- Incluye o actualiza pruebas cuando cambie comportamiento observable.
```

Cuando Bob termine, confirma que se creó la regla global.

> No incluyas secretos. Las reglas específicas de cálculo, UX, QA y release se
> definen en los Skills y en los pasos de los labs correspondientes.

### Paso 2 — Comprobar la regla (modo Ask)

Abre modo **Ask** y usa este prompt para validar la función de reglas:

```
Sin modificar archivos, indica qué convenciones globales aplicarías si este proyecto
incluyera un componente de interfaz, una función de cálculo y una documentación
funcional. Si falta información, enumera los supuestos en lugar de inventarlos.
```

## 4. Al completar el lab

- Verificaste que Bob puede responder en modo Ask.
- Creaste una regla global en `~/.bob/rules/`, aplicable a todos los proyectos y
  modos.
