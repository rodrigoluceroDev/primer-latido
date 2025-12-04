/**
 * app.js - Lógica específica de la aplicación principal de Primer Latido
 * Maneja las funcionalidades específicas de la página index.html
 */

// Inicialización específica de la página principal
document.addEventListener('DOMContentLoaded', function() {
    // Solo ejecutar si estamos en la página principal
    if (!document.querySelector('.calculator-section')) {
        return;
    }
    
    console.log('Inicializando aplicación principal...');
    
    // Inicializar componentes específicos
    initCalculator();
    initSymptomsTracker();
    initAppointmentsTracker();
    initAdviceSystem();
    initPregnancyTracker();
    
    // Configurar eventos globales
    setupEventListeners();
    
    // Cargar datos iniciales
    loadInitialData();
    
    // Configurar tema
    setupTheme();
    
    console.log('Aplicación principal inicializada');
});

/**
 * Inicializa la calculadora de embarazo
 */
function initCalculator() {
    const calculatorForm = document.getElementById('dueDateCalculator');
    const resetBtn = document.getElementById('resetCalculator');
    
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateDueDate();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetCalculator();
        });
    }
    
    // Configurar slider de ciclo menstrual
    const cycleSlider = document.getElementById('cycleLength');
    if (cycleSlider) {
        cycleSlider.addEventListener('input', function() {
            document.getElementById('cycleValue').textContent = `${this.value} días`;
        });
    }
    
    // Calcular automáticamente si hay datos guardados
    const savedLastPeriod = localStorage.getItem('primerLatidoLastPeriod');
    if (savedLastPeriod && document.getElementById('lastPeriod')) {
        document.getElementById('lastPeriod').value = savedLastPeriod;
        setTimeout(calculateDueDate, 500);
    }
}

/**
 * Inicializa el sistema de síntomas
 */
function initSymptomsTracker() {
    const symptomForm = document.getElementById('symptomForm');
    const clearBtn = document.getElementById('clearSymptoms');
    const filterBtns = document.querySelectorAll('.symptoms-filters .filter-btn');
    
    if (symptomForm) {
        symptomForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addSymptom();
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllSymptoms);
    }
    
    // Configurar filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterSymptoms(this.dataset.filter);
        });
    });
    
    // Configurar selector de intensidad
    document.querySelectorAll('.intensity-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.intensity-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            document.getElementById('symptomIntensity').value = this.dataset.value;
        });
    });
}

/**
 * Inicializa el sistema de citas
 */
function initAppointmentsTracker() {
    const appointmentForm = document.getElementById('appointmentForm');
    const clearBtn = document.getElementById('clearAppointments');
    const filterBtns = document.querySelectorAll('.appointments-filters .filter-btn');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addAppointment();
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllAppointments);
    }
    
    // Configurar filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterAppointments(this.dataset.filter);
        });
    });
}

/**
 * Inicializa el sistema de consejos
 */
function initAdviceSystem() {
    const adviceTabs = document.querySelectorAll('.advice-tab');
    
    adviceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Actualizar pestañas activas
            adviceTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar contenido correspondiente
            const tabId = this.dataset.tab;
            document.querySelectorAll('.advice-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`tab${tabId}`).classList.add('active');
        });
    });
    
    // Cargar datos de consejos
    loadAdviceData();
}

/**
 * Inicializa el seguimiento del embarazo
 */
function initPregnancyTracker() {
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    
    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', function() {
            navigateWeek(-1);
        });
    }
    
    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', function() {
            navigateWeek(1);
        });
    }
    
    // Inicializar con la semana actual si está disponible
    const pregnancyData = JSON.parse(localStorage.getItem('primerLatidoPregnancyData') || '{}');
    if (pregnancyData.currentWeek) {
        displayWeekInfo(pregnancyData.currentWeek);
    }
}

/**
 * Carga datos iniciales
 */
function loadInitialData() {
    // Cargar síntomas
    const symptoms = JSON.parse(localStorage.getItem('primerLatidoSymptoms') || '[]');
    if (symptoms.length > 0) {
        symptoms.forEach(symptom => addSymptomToDOM(symptom));
        updateSymptomsStats();
    }
    
    // Cargar citas
    const appointments = JSON.parse(localStorage.getItem('primerLatidoAppointments') || '[]');
    if (appointments.length > 0) {
        appointments.forEach(appointment => addAppointmentToDOM(appointment));
        updateAppointmentsStats();
    }
    
    // Configurar fechas por defecto
    setDefaultDates();
}

/**
 * Configura los event listeners globales
 */
function setupEventListeners() {
    // Botón volver arriba
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Actualizar información cuando cambia la fecha de parto
    window.addEventListener('dueDateCalculated', function(e) {
        updatePregnancyBanner(e.detail);
        updatePregnancyTrackerDisplay(e.detail.currentWeek);
    });
    
    // Notificaciones
    window.addEventListener('showNotification', function(e) {
        showNotification(e.detail.message, e.detail.type);
    });
}

/**
 * Configura el tema de la aplicación
 */
function setupTheme() {
    const savedTheme = localStorage.getItem('primerLatidoTheme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Botón de alternar tema (si existe)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('primerLatidoTheme', newTheme);
            
            // Cambiar ícono
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        });
    }
}

/**
 * Establece fechas por defecto en los formularios
 */
function setDefaultDates() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Síntomas: fecha de hoy
    const symptomDate = document.getElementById('symptomDate');
    if (symptomDate) {
        symptomDate.value = todayStr;
        symptomDate.max = todayStr;
    }
    
    // Citas: fecha mínima hoy
    const appointmentDate = document.getElementById('appointmentDate');
    if (appointmentDate) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        appointmentDate.min = now.toISOString().slice(0, 16);
    }
    
    // Fecha de última menstruación: hace 4 semanas por defecto
    const lastPeriod = document.getElementById('lastPeriod');
    if (lastPeriod && !lastPeriod.value) {
        const defaultDate = new Date(today);
        defaultDate.setDate(defaultDate.getDate() - 28);
        lastPeriod.value = defaultDate.toISOString().split('T')[0];
    }
}

/**
 * Muestra una notificación
 */
function showNotification(message, type = 'info') {
    // Usar utilidades si están disponibles
    if (window.Utils && window.Utils.DOM) {
        window.Utils.DOM.showToast(message, type);
    } else {
        // Fallback simple
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Estilos básicos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
        `;
        
        // Estilos según tipo
        const colors = {
            success: { border: '#A3E4D7', icon: '#0A6E5A' },
            error: { border: '#F8C8C8', icon: '#D32F2F' },
            info: { border: '#C5F2E8', icon: '#00695C' }
        };
        
        const color = colors[type] || colors.info;
        notification.style.borderLeft = `4px solid ${color.border}`;
        notification.querySelector('i').style.color = color.icon;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => notification.style.transform = 'translateX(0)', 10);
        
        // Auto-eliminar
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

/**
 * Actualiza el banner de embarazo
 */
function updatePregnancyBanner(data) {
    const elements = {
        currentWeek: document.getElementById('currentWeek'),
        dueDate: document.getElementById('dueDate'),
        daysLeft: document.getElementById('daysLeft')
    };
    
    if (elements.currentWeek && data.currentWeek) {
        elements.currentWeek.textContent = `Semana ${data.currentWeek}`;
    }
    
    if (elements.dueDate && data.dueDate) {
        const date = new Date(data.dueDate);
        elements.dueDate.textContent = date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
    if (elements.daysLeft && data.daysLeft) {
        elements.daysLeft.textContent = `${data.daysLeft} días`;
    }
}

/**
 * Actualiza el display del seguimiento del embarazo
 */
function updatePregnancyTrackerDisplay(week) {
    displayWeekInfo(week);
    
    // Actualizar navegación
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    
    if (prevWeekBtn) prevWeekBtn.disabled = week <= 1;
    if (nextWeekBtn) nextWeekBtn.disabled = week >= 40;
}

/**
 * Navega entre semanas
 */
function navigateWeek(direction) {
    const currentWeekElement = document.getElementById('trackerWeek');
    if (!currentWeekElement) return;
    
    let currentWeek = parseInt(currentWeekElement.textContent) || 1;
    currentWeek += direction;
    currentWeek = Math.max(1, Math.min(40, currentWeek));
    
    displayWeekInfo(currentWeek);
}

/**
 * Muestra información de una semana específica
 */
function displayWeekInfo(week) {
    document.getElementById('trackerWeek').textContent = week;
    
    // Datos de ejemplo (en una app real, estos vendrían de una base de datos)
    const weekData = getWeekData(week);
    
    document.getElementById('weekTitle').textContent = weekData.title;
    document.getElementById('weekDescription').textContent = weekData.description;
    document.getElementById('weekSize').textContent = weekData.size;
    document.getElementById('weekWeight').textContent = weekData.weight;
    
    // Actualizar imagen (usando placeholder)
    const weekImage = document.getElementById('weekImage');
    if (weekImage) {
        weekImage.innerHTML = `<img src="https://via.placeholder.com/300x200/FFD6E7/333333?text=Semana+${week}" alt="Desarrollo semana ${week}">`;
    }
    
    // Actualizar hitos
    updateMilestones(week);
}

/**
 * Obtiene datos de una semana específica
 */
function getWeekData(week) {
    const weekData = {
        1: {
            title: "Comienza el viaje",
            description: "Aunque todavía no estés embarazada desde el punto de vista médico, esta semana se considera el inicio de tu embarazo. Tu cuerpo se está preparando para la ovulación.",
            size: "Tamaño de un punto",
            weight: "0 gramos"
        },
        8: {
            title: "Formación de características faciales",
            description: "Los ojos, nariz y boca del bebé comienzan a formarse. Los brazos y piernas se alargan y los dedos empiezan a desarrollarse.",
            size: "1.6 cm (tamaño de un frijol)",
            weight: "1 gramo"
        },
        20: {
            title: "Mitad del camino",
            description: "¡Felicidades, estás a mitad del embarazo! Tu bebé puede oír sonidos y está desarrollando sus sentidos. Puedes empezar a sentir sus movimientos.",
            size: "25 cm (desde la cabeza a los pies)",
            weight: "300 gramos"
        },
        40: {
            title: "¡Listo para nacer!",
            description: "Tu bebé está completamente desarrollado y listo para nacer. La mayoría de los bebés nacen entre las semanas 38 y 42.",
            size: "50 cm en promedio",
            weight: "3.5 kg en promedio"
        }
    };
    
    return weekData[week] || {
        title: `Semana ${week}`,
        description: "Tu bebé continúa desarrollándose. Cada semana trae nuevos cambios y preparativos para el nacimiento.",
        size: "Tamaño variable",
        weight: "Peso en desarrollo"
    };
}

/**
 * Actualiza los hitos del embarazo
 */
function updateMilestones(currentWeek) {
    const milestones = document.querySelectorAll('.milestone-status');
    
    milestones.forEach(milestone => {
        const milestoneWeek = parseInt(milestone.dataset.week);
        
        if (currentWeek >= milestoneWeek) {
            milestone.classList.add('completed');
            milestone.innerHTML = '<i class="fas fa-check-circle"></i>';
        } else {
            milestone.classList.remove('completed');
            milestone.innerHTML = '<i class="far fa-circle"></i>';
        }
    });
}

/**
 * Carga datos de consejos
 */
function loadAdviceData() {
    // En una implementación real, esto cargaría datos de un archivo JSON o API
    console.log('Datos de consejos cargados');
}

// Exportar funciones principales para uso en otros módulos
window.AppFunctions = {
    showNotification,
    updatePregnancyBanner,
    displayWeekInfo,
    navigateWeek
};