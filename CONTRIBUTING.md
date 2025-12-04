#  Guía de Contribución
Gracias por tu interés en contribuir a Primer Latido! Este proyecto está abierto a contribuciones de toda la comunidad.

# Cómo Contribuir
## 1. Reportar Bugs 
Antes de reportar un bug:

Verifica que no haya sido reportado ya en Issues

Usa el template de bug report

Incluye:

Descripción clara del problema

Pasos para reproducir

Comportamiento esperado vs actual

Capturas de pantalla si aplica

Navegador y sistema operativo

## 2. Sugerir Mejoras 
Para nuevas características:

Verifica que no haya sido sugerida antes

Explica claramente el problema que resuelve

Describe la solución propuesta

Incluye ejemplos o mockups si es posible

## 3. Pull Requests 
Pasos para enviar un PR:

1. Haz un Fork del repositorio

2. Crea una rama descriptiva:

git checkout -b feature/nueva-funcionalidad
 o
git checkout -b fix/correccion-bug

3. Realiza tus cambios siguiendo las guías de estilo

4. Prueba tus cambios localmente

5. Commit con mensajes claros:

git commit -m "feat: añade calculadora de semanas"
 o
git commit -m "fix: corrige validación de fecha"

6. Push a tu fork:

git push origin feature/nueva-funcionalidad

7. Abre un Pull Request en GitHub

# Guía de Estilo de Código

## HTML
Usa HTML5 semántico

Indentación de 2 espacios

Atributos en comillas dobles

Comenta secciones complejas

## CSS
Orden: Layout > Box Model > Typography > Visual

Usa variables CSS para colores

Nombramiento BEM para clases complejas

Comenta reglas no obvias

## JavaScript
Usa ES6+ features

Nombres descriptivos de variables/funciones

Comenta funciones complejas

Manejo de errores apropiado

Uso consistente de comillas simples

## Estructura de Commits
Usamos Conventional Commits:

feat: Nueva característica

fix: Corrección de bug

docs: Cambios en documentación

style: Formato, puntos y coma faltantes, etc.

refactor: Cambios que no corrigen bugs ni añaden features

test: Añadir o corregir tests

chore: Cambios en build, configuraciones, etc.

## Pruebas Locales
Antes de enviar un PR:

1. Prueba en múltiples navegadores

2. Verifica diseño responsive

3. Prueba todas las funcionalidades relacionadas

4. Verifica que no hay errores en consola

## Estructura del Proyecto

primer-latido/
├── index.html          # Página principal
├── login.html          # Página de login
├── README.md           # Documentación principal
├── LICENSE             # Licencia MIT
├── CONTRIBUTING.md     # Esta guía
├── .gitignore          # Archivos ignorados
├── css/                # Estilos
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── js/                 # JavaScript
│   ├── main.js
│   ├── app.js
│   ├── login.js
│   ├── util.js
│   ├── calculator.js
│   ├── symptoms.js
│   ├── appointments.js
│   └── advice.js
└── assets/             # Imágenes/recursos

### Preguntas Frecuentes
Necesito permiso para contribuir?
No, solo sigue esta guía y envía un PR.

### ¿Qué tipo de contribuciones son bienvenidas?
Corrección de bugs

Nuevas características

Mejoras de documentación

Traducciones

Mejoras de UI/UX

### ¿Cómo empiezo?
Busca issues con la etiqueta good-first-issue

Pregunta en el issue si necesitas clarificación

¡Empieza a codear!

### Contacto
Si tienes preguntas:

Abre un issue con la etiqueta question

Revisa la documentación en README.md

### Agradecimientos
¡Gracias por querer hacer de Primer Latido una mejor herramienta para todas las futuras mamás!

Esta guía está inspirada en Contributor Covenant

Última actualización: Diciembre 2025