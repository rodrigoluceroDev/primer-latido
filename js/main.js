/**
 * main.js - Punto de entrada principal de la aplicación Primer Latido
 * Gestiona la inicialización, navegación y estado global de la app
 */

// Estado global de la aplicación
const AppState = {
    currentUser: null,
    pregnancyData: {
        dueDate: null,
        currentWeek: null,
        trimester: null,
        daysLeft: null
    },
    settings: {
        theme: 'light',
        notifications: true,
        language: 'es'
    },
    isInitialized: false
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar estado
    initAppState();
    
    // Inicializar componentes según la página
    if (window.location.pathname.includes('login.html')) {
        // La inicialización del login se maneja en login.js
        console.log('Página de login detectada');
    } else {
        // Página principal
        initMainPage();
    }
    
    // Inicializar listeners globales
    initGlobalListeners();
    
    // Marcar como inicializada
    AppState.isInitialized = true;
    
    console.log('Primer Latido inicializado correctamente');
});

/**
 * Inicializa el estado de la aplicación
 */
function initAppState() {
    // Cargar usuario actual
    const savedUser = localStorage.getItem('primerLatidoCurrentUser');
    if (savedUser) {
        try {
            AppState.currentUser = JSON.parse(savedUser);
        } catch (e) {
            console.error('Error al cargar usuario:', e);
            AppState.currentUser = null;
        }
    }
    
    // Cargar configuración
    const savedSettings = localStorage.getItem('primerLatidoSettings');
    if (savedSettings) {
        try {
            AppState.settings = { ...AppState.settings, ...JSON.parse(savedSettings) };
        } catch (e) {
            console.error('Error al cargar configuración:', e);
        }
    }
    
    // Cargar datos del embarazo
    const savedPregnancyData = localStorage.getItem('primerLatidoPregnancyData');
    if (savedPregnancyData) {
        try {
            AppState.pregnancyData = JSON.parse(savedPregnancyData);
        } catch (e) {
            console.error('Error al cargar datos del embarazo:', e);
        }
    }
}

/**
 * Inicializa la página principal
 */
function initMainPage() {
    // Verificar autenticación si es necesario
    checkAuthentication();
    
    // Inicializar componentes UI
    initUIComponents();

    // Inicializar módulos específicos si existen
    if (typeof initDueDateCalculator === 'function') initDueDateCalculator();
    if (window.symptomsManager && typeof window.symptomsManager.init === 'function') window.symptomsManager.init();
    if (window.appointmentsManager && typeof window.appointmentsManager.init === 'function') window.appointmentsManager.init();
    
    // Cargar datos iniciales
    loadInitialData();
    
    // Configurar navegación
    initNavigation();
    
    // Configurar tema
    applyTheme();
    
    // Actualizar información del usuario
    updateUserUI();
}

/**
 * Verifica la autenticación del usuario
 */
function checkAuthentication() {
    // Si no hay usuario, podrías redirigir al login o permitir modo invitado
    if (!AppState.currentUser) {
        console.log('Modo invitado activado');
        // Opcional: mostrar banner de invitado
        showGuestBanner();
    }
}

/**
 * Inicializa componentes de la interfaz
 */
function initUIComponents() {
    // Inicializar tooltips
    initTooltips();
    
    // Inicializar modales
    initModals();
    
    // Inicializar dropdowns
    initDropdowns();
    
    // Inicializar formularios dinámicos
    initDynamicForms();
}

/**
 * Carga datos iniciales de la aplicación
 */
function loadInitialData() {
    // Cargar síntomas si existe la sección
    if (document.getElementById('symptomsList')) {
        loadSymptoms();
    }
    
    // Cargar citas si existe la sección
    if (document.getElementById('appointmentsList')) {
        loadAppointments();
    }
    
    // Cargar consejos
    loadAdviceData();
    
    // Actualizar información del embarazo
    updatePregnancyInfo();
}

/**
 * Inicializa la navegación
 */
function initNavigation() {
    const navToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Navegación suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Cerrar menú móvil si está abierto
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (navToggle) {
                        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                // Desplazamiento suave
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Actualizar URL sin recargar
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Configurar botón de logout si existe
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * Inicializa tooltips
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                delete this._tooltip;
            }
        });
    });
}

/**
 * Inicializa modales
 */
function initModals() {
    // Cerrar modales con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Cerrar modales haciendo clic fuera
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

/**
 * Inicializa dropdowns
 */
function initDropdowns() {
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.dropdown');
            dropdown.classList.toggle('active');
        });
    });
    
    // Cerrar dropdowns al hacer clic fuera
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

/**
 * Inicializa formularios dinámicos
 */
function initDynamicForms() {
    // Validación en tiempo real
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Máscaras para inputs
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    });
}

/**
 * Actualiza la UI con información del usuario
 */
function updateUserUI() {
    const userMenu = document.getElementById('userMenu');

    // Si no hay elemento en el DOM lo dejamos
    if (!userMenu) return;

    if (!AppState.currentUser) {
        // Mostrar link de iniciar sesión por defecto
        userMenu.innerHTML = `<a href="./login.html" class="nav-link"><i class="fas fa-user"></i> Iniciar Sesión</a>`;
        return;
    }

    // Mostrar el primer nombre y botón de logout
    const firstName = (AppState.currentUser.name || AppState.currentUser.email || 'Usuario').split(' ')[0];
    userMenu.innerHTML = `
        <div class="nav-user">
            <a href="#" class="nav-link user-link"><i class="fas fa-user-circle"></i> <span class="user-name">${firstName}</span></a>
            <div class="user-actions">
                <button id="logoutBtn" class="nav-link"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</button>
            </div>
        </div>
    `;

    // Agregar listener al logout creado dinámicamente
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * Actualiza información del embarazo en la UI
 */
function updatePregnancyInfo() {
    if (!AppState.pregnancyData.dueDate) return;
    
    // Actualizar banner principal
    updatePregnancyBanner();
    
    // Actualizar calculadora
    updateCalculatorDisplay();
}

/**
 * Carga síntomas desde localStorage
 */
function loadSymptoms() {
    const symptoms = JSON.parse(localStorage.getItem('primerLatidoSymptoms') || '[]');
    
    // Delegate to symptoms.js if available
    if (window.symptomsManager && typeof window.symptomsManager.loadSymptoms === 'function') {
        window.symptomsManager.loadSymptoms(symptoms);
    } else {
        // Fallback: cargar directamente
        const symptomsList = document.getElementById('symptomsList');
        if (symptomsList) {
            symptomsList.innerHTML = symptoms.length ? '' : `
                <div class="empty-state">
                    <i class="fas fa-heartbeat"></i>
                    <p>No hay síntomas registrados aún. ¡Agrega tu primer síntoma!</p>
                </div>
            `;
        }
    }
}

/**
 * Carga citas desde localStorage
 */
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('primerLatidoAppointments') || '[]');
    
    // Delegate to appointments.js if available
    if (window.appointmentsManager && typeof window.appointmentsManager.loadAppointments === 'function') {
        window.appointmentsManager.loadAppointments(appointments);
    } else {
        // Fallback: cargar directamente
        const appointmentsList = document.getElementById('appointmentsList');
        if (appointmentsList) {
            appointmentsList.innerHTML = appointments.length ? '' : `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <p>No hay citas programadas. ¡Agrega tu primera cita médica!</p>
                </div>
            `;
        }
    }
}

/**
 * Carga datos de consejos
 */
function loadAdviceData() {
    // Datos de consejos por trimestre
    const adviceData = {
        1: [
            {
                icon: 'apple-alt',
                title: 'Ácido Fólico',
                description: 'Importante para prevenir defectos del tubo neural. Consume 400-800 mcg diarios.'
            },
            {
                icon: 'bed',
                title: 'Descanso',
                description: 'La fatiga es común. Descansa cuando puedas y duerme 8 horas diarias.'
            }
        ],
        2: [
            {
                icon: 'running',
                title: 'Ejercicio',
                description: 'Caminar, nadar o yoga prenatal son excelentes opciones.'
            },
            {
                icon: 'heart',
                title: 'Movimientos',
                description: 'Empiezas a sentir los movimientos del bebé. Lleva un registro.'
            }
        ],
        3: [
            {
                icon: 'hospital',
                title: 'Preparación',
                description: 'Prepara tu maleta para el hospital y el cuarto del bebé.'
            },
            {
                icon: 'hands-helping',
                title: 'Soporte',
                description: 'Organiza quién te ayudará después del parto.'
            }
        ]
    };
    
    // Actualizar UI con consejos
    const adviceContainer = document.querySelector('.advice-grid');
    if (adviceContainer) {
        // Esto se completará cuando se seleccione un trimestre
    }
}

/**
 * Aplica el tema seleccionado
 */
function applyTheme() {
    if (AppState.settings.theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

/**
 * Muestra banner para usuarios invitados
 */
function showGuestBanner() {
    // Crear banner si no existe
    if (!document.querySelector('.guest-banner')) {
        const banner = document.createElement('div');
        banner.className = 'guest-banner';
        banner.innerHTML = `
            <div class="guest-banner-content">
                <i class="fas fa-user-circle"></i>
                <div>
                    <h4>Modo Invitado</h4>
                    <p>Los datos se guardarán solo en este dispositivo. <a href="login.html">Inicia sesión</a> para sincronizar en la nube.</p>
                </div>
                <button class="close-banner">&times;</button>
            </div>
        `;
        
        document.body.prepend(banner);
        
        // Configurar cierre del banner
        banner.querySelector('.close-banner').addEventListener('click', () => {
            banner.style.transform = 'translateY(-100%)';
            setTimeout(() => banner.remove(), 300);
        });
    }
}

/**
 * Maneja el logout del usuario
 */
function handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Limpiar datos de sesión
        localStorage.removeItem('primerLatidoCurrentUser');
        localStorage.removeItem('primerLatidoSessionExpiry');
        sessionStorage.removeItem('primerLatidoSession');
        
        // Redirigir al login
        window.location.href = 'login.html';
    }
}

/**
 * Valida un campo de formulario
 */
function validateField(field) {
    const value = field.value.trim();
    const errorElement = field.nextElementSibling;
    
    // Limpiar error previo
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
    
    // Validaciones específicas por tipo
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email inválido';
        }
    } else if (field.type === 'tel' && value) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Teléfono inválido (10 dígitos)';
        }
    }
    
    // Mostrar error si es necesario
    if (!isValid) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = `
            color: #D32F2F;
            font-size: 0.85rem;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    } else {
        field.classList.remove('error');
    }
    
    return isValid;
}

/**
 * Cierra todos los modales abiertos
 */
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

/**
 * Inicializa listeners globales
 */
function initGlobalListeners() {
    // Actualizar información del embarazo cuando cambia
    window.addEventListener('pregnancyDataUpdated', function(e) {
        if (e.detail && e.detail.dueDate) {
            AppState.pregnancyData = e.detail;
            localStorage.setItem('primerLatidoPregnancyData', JSON.stringify(e.detail));
        }
    });
    
    // Actualizar UI cuando el usuario inicia sesión
    window.addEventListener('userLoggedIn', function(e) {
        AppState.currentUser = e.detail;
        updateUserUI();
    });
    
    // Guardar configuración cuando cambia
    window.addEventListener('settingsChanged', function(e) {
        if (e.detail) {
            AppState.settings = { ...AppState.settings, ...e.detail };
            localStorage.setItem('primerLatidoSettings', JSON.stringify(AppState.settings));
            applyTheme();
        }
    });
}

/**
 * Función auxiliar para hacer peticiones HTTP
 */
async function makeRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

/**
 * Actualiza el banner de embarazo
 */
function updatePregnancyBanner() {
    const elements = {
        currentWeek: document.getElementById('currentWeek'),
        dueDate: document.getElementById('dueDate'),
        daysLeft: document.getElementById('daysLeft')
    };
    
    if (elements.currentWeek && AppState.pregnancyData.currentWeek) {
        elements.currentWeek.textContent = `Semana ${AppState.pregnancyData.currentWeek}`;
    }
    
    if (elements.dueDate && AppState.pregnancyData.dueDate) {
        const date = new Date(AppState.pregnancyData.dueDate);
        elements.dueDate.textContent = date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
    if (elements.daysLeft && AppState.pregnancyData.daysLeft) {
        elements.daysLeft.textContent = `${AppState.pregnancyData.daysLeft} días`;
    }
}

/**
 * Actualiza la calculadora
 */
function updateCalculatorDisplay() {
    // Esta función sería implementada en calculator.js
    if (window.calculator && typeof window.calculator.updateDisplay === 'function') {
        window.calculator.updateDisplay(AppState.pregnancyData);
    }
}

// Exportar el estado de la aplicación para uso en otros módulos
window.AppState = AppState;
window.AppUtils = {
    makeRequest,
    validateField,
    showNotification: window.loginUtils?.showSuccess || alert
};