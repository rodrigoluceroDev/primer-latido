
// Esperamos a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita recargar la página

        const usuario = document.getElementById('usuario').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validación simple
        if (usuario === 'admin' && password === '1234') {
            // Redirige a la página principal
            window.location.href = 'index.html';
        } else {
            // Muestra mensaje de error
            errorMsg.textContent = 'Usuario o contraseña incorrectos';
        }
    });
});
