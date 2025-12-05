/**
 * login.js - Gestión del sistema de autenticación para Primer Latido
 * Versión parcheada: rutas relativas y checkExistingSession seguro
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes del login
    initLoginSystem();
    
    // Si el usuario ya está logueado, redirigir al dashboard (con protección para login.html)
    checkExistingSession();
});

/**
 * Inicializa el sistema de login
 */
function initLoginSystem() {
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const registerLink = document.getElementById('registerLink');
    const socialButtons = document.querySelectorAll('.social-btn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
    
    if (registerLink) {
        registerLink.addEventListener('click', handleRegisterClick);
    }
    
    // Configurar botones de login social
    socialButtons.forEach(button => {
        button.addEventListener('click', handleSocialLogin);
    });
    
    // Configurar cierre del modal
    const closeModalBtn = document.getElementById('closeModal');
    const registerModal = document.getElementById('registerModal');
    
    if (closeModalBtn && registerModal) {
        closeModalBtn.addEventListener('click', () => {
            registerModal.style.display = 'none';
        });
        
        registerModal.addEventListener('click', (e) => {
            if (e.target === registerModal) {
                registerModal.style.display = 'none';
            }
        });
    }
}

/**
 * Maneja el envío del formulario de login
 */
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validación básica
    if (!validateEmail(email)) {
        showError('Por favor, ingresa un correo electrónico válido');
        return;
    }
    
    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Mostrar estado de carga
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    submitBtn.disabled = true;
    
    // Simular petición al servidor (en producción sería una llamada real)
    setTimeout(() => {
        // Primero intentar con usuarios guardados en localStorage
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('primerLatidoUsers') || '[]');
        } catch (err) {
            console.warn('No se pudo parsear primerLatidoUsers:', err);
            users = [];
        }

        // Usuario demo por defecto como fallback
        const mockUsers = [
            { email: 'usuario@ejemplo.com', password: '123456', name: 'Usuario Demo' }
        ];

        // Normalizar email ingresado
        const normalizedEmail = email.toLowerCase();

        // Buscar en storage primero (comparando emails en minúscula), luego en mock
        let user = users.find(u => (u.email || '').trim().toLowerCase() === normalizedEmail && String(u.password) === String(password));
        if (!user) {
            user = mockUsers.find(u => u.email === normalizedEmail && String(u.password) === String(password)) || null;
        }

        // Depuración: si no se encontró usuario, loguear información útil sin exponer contraseñas
        if (!user) {
            try {
                const emails = users.map(u => (u.email || '').trim().toLowerCase());
                console.info('Login intento fallido. Email buscado:', normalizedEmail, 'Usuarios registrados (emails):', emails);
            } catch (dbgErr) {
                console.warn('Error al generar debug info de usuarios:', dbgErr);
            }
        }

        if (user) {
            // Login exitoso
            createUserSession(user, rememberMe);
            showSuccess('¡Inicio de sesión exitoso! Redirigiendo...');

            // Redirigir al dashboard después de 1.5 segundos
            setTimeout(() => {
                // usar ruta relativa segura para GitHub Pages
                window.location.href = './';
            }, 1500);
        } else {
            // Credenciales incorrectas
            showError('Correo electrónico o contraseña incorrectos');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 800);
}

/**
 * Alterna la visibilidad de la contraseña
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    // 'this' es el botón cuando se usa addEventListener; si no existe, fallback
    const toggleIcon = this ? this.querySelector('i') : document.querySelector('#togglePassword i');
    
    if (!passwordInput) return;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        if (toggleIcon) {
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        }
    } else {
        passwordInput.type = 'password';
        if (toggleIcon) {
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }
}

/**
 * Maneja el proceso de recuperación de contraseña
 */
function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = prompt('Por favor, ingresa tu correo electrónico para restablecer tu contraseña:');
    
    if (email && validateEmail(email)) {
        // Simular envío de correo de recuperación
        showSuccess(`Se ha enviado un enlace de recuperación a ${email}`);
        
        // En producción, aquí se haría una petición al servidor
        console.log('Solicitud de recuperación para:', email);
    } else if (email) {
        showError('Por favor, ingresa un correo electrónico válido');
    }
}

/**
 * Maneja el clic en el enlace de registro
 */
function handleRegisterClick(e) {
    e.preventDefault();
    showRegisterModal();
}

/**
 * Muestra el modal de registro
 */
function showRegisterModal() {
    const modal = document.getElementById('registerModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <form id="registerForm" class="register-form" style="display:block;">
            <div class="form-group">
                <label for="registerName">Nombre completo</label>
                <input type="text" id="registerName" placeholder="Tu nombre" required>
            </div>
            <div class="form-group">
                <label for="registerEmail">Correo electrónico</label>
                <input type="email" id="registerEmail" placeholder="tucorreo@ejemplo.com" required>
            </div>
            <div class="form-group">
                <label for="registerPassword">Contraseña</label>
                <input type="password" id="registerPassword" placeholder="••••••••" required>
            </div>
            <div class="form-group">
                <label for="registerConfirmPassword">Confirmar contraseña</label>
                <input type="password" id="registerConfirmPassword" placeholder="••••••••" required>
            </div>
            <div class="form-group">
                <label for="dueDate">Fecha estimada de parto</label>
                <input type="date" id="dueDate">
            </div>
            <div class="form-group">
                <label><input type="checkbox" id="acceptTerms"> Acepto los <a href="#" target="_blank">Términos y Condiciones</a></label>
            </div>
            <div style="display:flex; gap:10px; align-items:center; margin-top:10px;">
                <button type="submit" class="login-btn" style="flex:1;">
                    <i class="fas fa-user-plus"></i> Crear cuenta
                </button>
                <button type="button" id="loginFromRegister" style="background:none;border:none;color:#FFB8D9;cursor:pointer;">Volver</button>
            </div>
        </form>
    `; // formulario inyectado dinámicamente
    
    modal.style.display = 'flex';
    
    // Configurar el formulario de registro (se carga dinámicamente)
    const registerForm = document.getElementById('registerForm');
    const loginFromRegister = document.getElementById('loginFromRegister');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
    
    if (loginFromRegister) {
        loginFromRegister.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'none';
        });
    }
}

/**
 * Maneja el envío del formulario de registro
 */
function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const nameField = document.getElementById('registerName');
    const emailField = document.getElementById('registerEmail');
    const passwordField = document.getElementById('registerPassword');
    const confirmPasswordField = document.getElementById('registerConfirmPassword');
    const dueDateField = document.getElementById('dueDate');
    const acceptTermsField = document.getElementById('acceptTerms');
    
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const normalizedEmail = email.toLowerCase();
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;
    const dueDate = dueDateField.value;
    const acceptTerms = acceptTermsField.checked;
    
    // Validaciones con enfoque específico en campos
    if (name.length < 2) {
        showError('El nombre debe tener al menos 2 caracteres');
        nameField.focus();
        nameField.classList.add('error');
        return;
    } else {
        nameField.classList.remove('error');
    }
    
    if (!validateEmail(email)) {
        showError('Por favor, ingresa un correo electrónico válido');
        emailField.focus();
        emailField.classList.add('error');
        return;
    } else {
        emailField.classList.remove('error');
    }
    
    // Verificar si el email ya existe
    const users = JSON.parse(localStorage.getItem('primerLatidoUsers') || '[]');
    const userExists = users.some(u => (u.email || '').trim().toLowerCase() === normalizedEmail);
    
    if (userExists) {
        showError('Este correo electrónico ya está registrado');
        emailField.focus();
        emailField.classList.add('error');
        return;
    }
    
    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        passwordField.focus();
        passwordField.classList.add('error');
        return;
    } else {
        passwordField.classList.remove('error');
    }
    
    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        confirmPasswordField.focus();
        confirmPasswordField.classList.add('error');
        return;
    } else {
        confirmPasswordField.classList.remove('error');
    }
    
    if (!acceptTerms) {
        showError('Debes aceptar los Términos y Condiciones');
        return;
    }
    
    // Mostrar estado de carga
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
    submitBtn.disabled = true;
    
    // Simular creación de cuenta
    setTimeout(() => {
        // Crear objeto de usuario
        const newUser = {
            id: Date.now(),
            name: name,
            email: normalizedEmail,
            password: password, // En producción, esto estaría hasheado
            dueDate: dueDate,
            createdAt: new Date().toISOString(),
            profileComplete: false
        };
        
        // Guardar usuario en localStorage
        users.push(newUser);
        localStorage.setItem('primerLatidoUsers', JSON.stringify(users));
        
        // Crear sesión automáticamente
        createUserSession(newUser, true);
        
        // Mostrar mensaje de éxito
        showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
        
        // Cerrar modal y redirigir
        setTimeout(() => {
            const registerModal = document.getElementById('registerModal');
            if (registerModal) {
                registerModal.style.display = 'none';
            }
            window.location.href = './';
        }, 1500);
    }, 800);
}

/**
 * Maneja el login con redes sociales
 */
function handleSocialLogin(e) {
    const provider = e.currentTarget.id.replace('Login', '');
    
    // Mostrar estado de carga
    const button = e.currentTarget;
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Simular autenticación social
    setTimeout(() => {
        // En producción, aquí se integraría con Firebase Auth o similar
        const socialUser = {
            id: `social_${provider}_${Date.now()}`,
            name: `Usuario ${provider}`,
            email: `usuario@${provider}.com`,
            provider: provider,
            profileComplete: false
        };
        
        createUserSession(socialUser, true);
        showSuccess(`¡Inicio de sesión con ${provider} exitoso! Redirigiendo...`);
        
        // Redirigir al dashboard
        setTimeout(() => {
            window.location.href = './';
        }, 1500);
    }, 1500);
}

/**
 * Crea una sesión de usuario
 */
function createUserSession(user, rememberMe = false) {
    const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        dueDate: user.dueDate || null,
        loggedIn: true,
        loginTime: new Date().toISOString(),
        provider: user.provider || 'email'
    };
    
    // Guardar en localStorage
    localStorage.setItem('primerLatidoCurrentUser', JSON.stringify(sessionData));
    
    // Si el usuario seleccionó "Recordarme", guardar por 30 días
    if (rememberMe) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        localStorage.setItem('primerLatidoSessionExpiry', expiryDate.toISOString());
    }
    
    // También guardar en sessionStorage para la sesión actual
    sessionStorage.setItem('primerLatidoSession', JSON.stringify(sessionData));
    
    // Disparar evento personalizado para notificar a otras partes de la app
    window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: sessionData }));
}

/**
 * Verifica si hay una sesión existente
 */
function checkExistingSession() {
    const session = localStorage.getItem('primerLatidoCurrentUser');
    const expiry = localStorage.getItem('primerLatidoSessionExpiry');
    
    if (session && expiry) {
        const expiryDate = new Date(expiry);
        // Solo redirigir si la sesión sigue vigente y NO estamos en login.html
        if (expiryDate > new Date() && !location.pathname.includes('login.html')) {
            window.location.href = './';
        } else if (expiryDate <= new Date()) {
            // Sesión expirada, limpiar
            localStorage.removeItem('primerLatidoCurrentUser');
            localStorage.removeItem('primerLatidoSessionExpiry');
        }
    }
}

/**
 * Valida un email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Muestra un mensaje de error
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.classList.add('show');
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    } else {
        alert(`Error: ${message}`);
    }
}

/**
 * Muestra un mensaje de éxito
 */
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    
    if (successDiv && successText) {
        successText.textContent = message;
        successDiv.classList.add('show');
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            successDiv.classList.remove('show');
        }, 5000);
    }
}

/**
 * Cierra la sesión del usuario
 */
function logoutUser() {
    // Limpiar datos de sesión
    localStorage.removeItem('primerLatidoCurrentUser');
    localStorage.removeItem('primerLatidoSessionExpiry');
    sessionStorage.removeItem('primerLatidoSession');
    
    // Redirigir al login usando ruta relativa
    window.location.href = 'login.html';
}

// Emitir cierre de sesión desde el menú u otros módulos
function logoutAndClearData() {
    // Limpiar datos de sesión
    localStorage.removeItem('primerLatidoCurrentUser');
    localStorage.removeItem('primerLatidoSessionExpiry');
    sessionStorage.removeItem('primerLatidoSession');

    // Limpiar datos relacionados al embarazo para que no persistan entre usuarios
    localStorage.removeItem('primerLatidoPregnancyData');
    localStorage.removeItem('primerLatidoLastWeek');
    localStorage.removeItem('primerLatidoLastTrimester');
    localStorage.removeItem('primerLatidoLastPeriod');
    localStorage.removeItem('primerLatidoAppointments');
    localStorage.removeItem('primerLatidoSymptoms');

    // Limpiar también sessionStorage
    sessionStorage.removeItem('primerLatidoPregnancyData');
    sessionStorage.removeItem('primerLatidoAppointments');
    sessionStorage.removeItem('primerLatidoSymptoms');

    // Notificar al resto de la app que se cerró la sesión
    try {
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
    } catch (e) {
        console.warn('No se pudo emitir userLoggedOut:', e);
    }

    // Redirigir al login
    window.location.href = 'login.html';
}

// Exportar funciones para uso en otros archivos
window.loginUtils = {
    validateEmail,
    showError,
    showSuccess,
    logoutUser,
    logoutAndClearData,
    createUserSession,
    checkExistingSession
};
