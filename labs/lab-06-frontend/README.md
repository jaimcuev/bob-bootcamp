# Lab 06 — Desarrollo frontend

## Objetivo

Convertir el frontend inicial generado desde Figma en el Lab 04 en una interfaz
integrada con el backend real del Lab 05, con validaciones accesibles y estados
de carga, error y resultado.

## Roles involucrados

| Rol | Qué hace en este lab |
|---|---|
| Frontend Developer | Implementa la interfaz y la integración HTTP. |
| UX/UI Designer | Valida consistencia con wireframes y Carbon. |
| QA Engineer | Revisa validaciones y accesibilidad antes de Testing/QA. |

## Antes de comenzar

1. Completa los Labs 04 y 05.
2. Ejecuta el backend y comprueba que `POST /api/simulaciones` responde.
3. En Bob, usa **Archivo → Abrir carpeta** y abre el mismo proyecto
   `simulador-credito-banco-acme` que ya contiene el backend.
4. Copia manualmente `labs/lab-04-ux-ui/output/frontend/` del bootcamp al
   directorio `frontend/` del proyecto. Si `frontend/` ya existe, revisa el diff
   antes de reemplazar cualquier archivo.
5. Confirma que existen `frontend/`,
   `docs/arquitectura/api-boundaries.md` y el contrato o implementación real de
   `POST /api/simulaciones`.

## Paso 1 — Crear y activar el modo

En **Configuración → Modos → Crear modo**, completa:

- **Identificador:** `credit-frontend-developer`
- **Nombre visible:** Credit frontend developer
- **Descripción:** Implementa la experiencia React y Carbon del simulador.
- **Rol:** Eres desarrollador frontend senior especializado en accesibilidad.
- **Instrucciones:** Pega el siguiente texto completo:

  ```text
  Integra el frontend del Simulador de Crédito con la API real sin alterar las
  reglas financieras. Lee docs/arquitectura/api-boundaries.md, el contrato real
  de POST /api/simulaciones y los componentes generados desde Figma antes de
  editar.
  Conserva Carbon, labels, roles, foco visible, navegación por teclado y mensajes
  de validación accesibles. La interfaz debe representar carga, error, validación
  y resultado; los errores 400 se muestran por campo y los errores no esperados
  se muestran sin exponer detalles técnicos.
  No calcules cuotas ni cronogramas en el navegador y no uses credenciales en el
  código. Consume la URL de API desde una variable de entorno local. Antes de
  modificar el frontend inicial, muestra el diff y los archivos afectados;
  después ejecuta pruebas y build, y verifica que los valores visibles provienen
  de la respuesta de POST /api/simulaciones.
  ```
- **Herramientas:** lectura, edición, ejecución, skills y tareas.

Guarda el modo y selecciónalo en el selector del chat antes de continuar.

## Paso 2 — Crear y activar el Skill de interfaz

En **Skills → Crear Skill**, completa:

- **Nombre:** `frontend-simulador-credito`
- **Descripción:** Implementa una interfaz Carbon accesible conectada a la API.
- **Instrucciones:** Pega este contenido completo:

  ```text
  Objetivo: conservar una experiencia Carbon accesible mientras el frontend se
  conecta a la API del Simulador de Crédito.

  Fuentes obligatorias: el frontend generado desde Figma,
  docs/arquitectura/api-boundaries.md y la respuesta real de POST
  /api/simulaciones. Antes de modificar un componente, identifica el RF, estado
  de UI y campo del contrato que afecta.

  Reglas: usa componentes Carbon y labels/roles accesibles; prueba por role,
  label o test id estable; muestra ayuda, validación y errores por campo; maneja
  carga, éxito y error de red. Período de gracia y cuotas dobles existen solo
  para Consumo. El resultado y cronograma se renderizan desde la respuesta API,
  no desde cálculos o tasas en el navegador.

  Límites y verificación: usa variables de entorno locales, no credenciales;
  conserva mocks solo para stories o pruebas; antes de editar enumera archivos;
  después ejecuta test y build e informa qué flujo manual validaste.
  ```

Guarda y activa el Skill para los pasos restantes.

## Paso 3 — Revisar la interfaz antes de editar

Selecciona **Ask**. En el chat de Bob, pega este prompt:

```text
Lee @docs/arquitectura/api-boundaries.md, el contrato o implementación de
POST /api/simulaciones y el código actual de @frontend. Enumera los componentes
generados desde Figma, los estados no cubiertos y las diferencias entre sus
cálculos o datos locales y la respuesta real esperada. No modifiques archivos.
```

Revisa esa lista. Después vuelve a seleccionar `credit-frontend-developer` y
confirma que el Skill `frontend-simulador-credito` sigue activo.

## Paso 4 — Implementar formulario y resultado

En el chat de Bob, con el modo y Skill activos, envía este prompt:

```text
Con el Skill frontend-simulador-credito activo, actualiza los componentes del
frontend generado desde Figma que capturan datos y muestran el resultado. Conserva
la estructura y estilos útiles; muestra campos de período de gracia y cuotas
dobles solo para Consumo; agrega labels, ayuda y errores accesibles. Antes de
editar, enumera los archivos que cambiarás.
```

Cuando Bob termine, ejecuta el frontend y comprueba manualmente que los campos de
gracia y cuotas dobles aparecen únicamente al elegir Consumo. Después continúa.

## Paso 5 — Integrar la API real

En el chat de Bob, sin cambiar de modo ni desactivar el Skill, envía:

```text
Conecta el formulario generado a POST /api/simulaciones. Obtén la URL del backend
desde una variable de entorno local. Reemplaza los cálculos financieros, tasas y
datos de fallback del navegador en el flujo principal por la respuesta de la API;
elimina o deja sin uso los hooks de cálculo local que ya no correspondan. Muestra
carga durante la solicitud, errores por campo cuando la API devuelva 400 y el
resumen más cronograma cuando sea exitosa. No agregues credenciales al repositorio.
```

Abre dos terminales integradas en Bob: en una ejecuta el backend y en otra el frontend.
Simula Consumo con datos válidos y confirma que cuota y cronograma coinciden con la
respuesta de red, no con el mock anterior.

## Paso 6 — Validar y preparar QA

En el chat de Bob, envía:

```text
Crea pruebas de componente para SimuladorForm. Verifica selección de producto,
campos exclusivos de Consumo, validación visible y envío exitoso. Usa roles y labels,
no clases CSS ni detalles internos.
```

Ejecuta `npm test` y `npm run build` en `frontend/`. Si alguno falla, pega su salida
en el chat y pide que Bob corrija solo el error reportado. No continúes al Lab 07
hasta que ambos comandos terminen correctamente.

## Comprobación antes de continuar

El formulario debe enviar a la API real, mostrar errores de validación y renderizar
el resultado completo. Mantén backend y frontend en el mismo proyecto raíz para que
el Lab 07 pueda ejecutar pruebas unitarias, integración y E2E.
