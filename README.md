# Primer Latido
## Primer Latido

Aplicación web simple para acompañar el embarazo. Proporciona:

- Calculadora de fecha probable de parto (suma 280 días a la FUM).
- Registro de síntomas y estado de ánimo (tabla dinámica con agregar/eliminar).
- Agenda de citas médicas (tabla dinámica con agregar/eliminar).
- Login simple (usuario: `admin`, contraseña: `1234`).

## Estructura del proyecto

- `login.html` — Página de inicio de sesión.
- `index.html` — Página principal con calculadora, registro de síntomas y agenda de citas.
- `style.css` — Estilos globales (paleta pastel, tipografías, responsive).
- `login.js` — Lógica del formulario de login.
- `main.js` — Lógica de la calculadora, síntomas y citas.
- `README.md` — Esta documentación.

## Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)

## Cómo ejecutar (modo desarrollo)

1. Abre el archivo `login.html` en tu navegador (doble clic o arrastrar al navegador).
2. Ingresa las credenciales: usuario `admin`, contraseña `1234`.
3. Serás redirigido a `index.html` donde puedes usar las funciones.

Notas:
- No requiere servidor; funciona con archivos estáticos.
- Si prefieres servirlo desde un servidor local (recomendado para producción o evitar restricciones de navegador), puedes usar `npx http-server` o cualquier servidor estático.

## Buenas prácticas y pruebas rápidas

- Prueba la calculadora ingresando una fecha de FUM y verificando la fecha probable de parto.
- Añade y elimina síntomas y citas para comprobar la dinámica de las tablas.

## Cómo contribuir

1. Haz fork del repositorio.
2. Crea una rama con tu feature/bugfix (ej. `feature/guardar-localstorage`).
3. Envía un pull request con descripción clara de los cambios.

## Próximos pasos sugeridos (opcional)

- Persistencia: guardar síntomas y citas en `localStorage` para mantener datos entre sesiones.
- Validaciones/UX: mensajes de confirmación al eliminar, validación de campos más detallada.
- Internacionalización (i18n) si planeas soportar más idiomas.
- Tests automatizados con herramientas de JS si el proyecto crece.

---

Proyecto creado como trabajo de práctica. Autor: [Tu Nombre].
