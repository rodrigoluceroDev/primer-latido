/**
 * util.js - Utilidades generales para Primer Latido
 * Funciones auxiliares y helpers para toda la aplicación
 */

/**
 * Utilidades de fecha y tiempo
 */
const DateUtils = {
    /**
     * Formatea una fecha a un string legible
     * @param {Date|string} date - Fecha a formatear
     * @param {string} format - Formato deseado (short, long, relative)
     * @returns {string} Fecha formateada
     */
    formatDate(date, format = 'short') {
        if (!date) return '--';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'Fecha inválida';
        
        const options = {
            short: {
                day: 'numeric',
                month: 'short'
            },
            long: {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            },
            withYear: {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            },
            time: {
                hour: '2-digit',
                minute: '2-digit'
            }
        };
        
        if (format === 'relative') {
            return this.getRelativeTime(d);
        }
        
        return d.toLocaleDateString('es-ES', options[format] || options.short);
    },
    
    /**
     * Obtiene el tiempo relativo (hace X días, etc.)
     */
    getRelativeTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Hoy';
        } else if (diffDays === 1) {
            return 'Ayer';
        } else if (diffDays < 7) {
            return `Hace ${diffDays} días`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
        }
    },
    
    /**
     * Calcula la diferencia en días entre dos fechas
     */
    getDaysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffMs = Math.abs(d2 - d1);
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    },
    
    /**
     * Añade días a una fecha
     */
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    
    /**
     * Calcula la semana de embarazo basada en la FUM
     */
    calculatePregnancyWeek(lastPeriod) {
        if (!lastPeriod) return null;
        
        const today = new Date();
        const lastPeriodDate = new Date(lastPeriod);
        const daysSince = this.getDaysBetween(lastPeriodDate, today);
        const weeks = Math.floor(daysSince / 7);
        const days = daysSince % 7;
        
        return {
            weeks: weeks + 1, // +1 porque la semana 1 empieza el día 0
            days: days,
            totalDays: daysSince
        };
    },
    
    /**
     * Calcula la fecha probable de parto
     */
    calculateDueDate(lastPeriod, cycleLength = 28) {
        if (!lastPeriod) return null;
        
        const lastPeriodDate = new Date(lastPeriod);
        let dueDate = new Date(lastPeriodDate);
        
        // Regla de Naegele: FPP = FUR + 7 días - 3 meses + 1 año
        dueDate.setDate(dueDate.getDate() + 7);
        dueDate.setMonth(dueDate.getMonth() - 3);
        dueDate.setFullYear(dueDate.getFullYear() + 1);
        
        // Ajustar por duración del ciclo
        const cycleAdjustment = cycleLength - 28;
        dueDate.setDate(dueDate.getDate() + cycleAdjustment);
        
        return dueDate;
    },
    
    /**
     * Obtiene el trimestre basado en la semana de embarazo
     */
    getTrimester(week) {
        if (week <= 13) return 1;
        if (week <= 27) return 2;
        return 3;
    }
};

/**
 * Utilidades de almacenamiento
 */
const StorageUtils = {
    /**
     * Guarda datos en localStorage con manejo de errores
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error al guardar en localStorage (${key}):`, error);
            
            // Intentar guardar en sessionStorage como fallback
            try {
                sessionStorage.setItem(key, JSON.stringify(data));
                console.warn(`Datos guardados en sessionStorage como fallback (${key})`);
                return true;
            } catch (fallbackError) {
                console.error('Error también en sessionStorage:', fallbackError);
                return false;
            }
        }
    },
    
    /**
     * Carga datos de localStorage
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            if (data === null) return defaultValue;
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error al cargar de localStorage (${key}):`, error);
            
            // Intentar cargar de sessionStorage como fallback
            try {
                const fallbackData = sessionStorage.getItem(key);
                if (fallbackData === null) return defaultValue;
                return JSON.parse(fallbackData);
            } catch (fallbackError) {
                console.error('Error también en sessionStorage:', fallbackError);
                return defaultValue;
            }
        }
    },
    
    /**
     * Elimina datos del almacenamiento
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error al eliminar (${key}):`, error);
            return false;
        }
    },
    
    /**
     * Limpia todos los datos de la aplicación
     */
    clearAppData() {
        const keysToKeep = ['primerLatidoSettings', 'primerLatidoCurrentUser'];
        
        try {
            // Eliminar todas las claves excepto las importantes
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('primerLatido') && !keysToKeep.includes(key)) {
                    localStorage.removeItem(key);
                }
            }
            
            // Hacer lo mismo para sessionStorage
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key.startsWith('primerLatido') && !keysToKeep.includes(key)) {
                    sessionStorage.removeItem(key);
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error al limpiar datos:', error);
            return false;
        }
    },
    
    /**
     * Exporta todos los datos de la aplicación
     */
    exportData() {
        const exportData = {};
        
        try {
            // Recopilar datos de localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('primerLatido')) {
                    exportData[key] = localStorage.getItem(key);
                }
            }
            
            // Agregar metadatos
            exportData.metadata = {
                exportDate: new Date().toISOString(),
                appVersion: '1.0.0',
                dataCount: Object.keys(exportData).length - 1
            };
            
            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('Error al exportar datos:', error);
            return null;
        }
    },
    
    /**
     * Importa datos a la aplicación
     */
    importData(jsonString) {
        try {
            const importData = JSON.parse(jsonString);
            
            // Verificar que sea un archivo de exportación válido
            if (!importData.metadata || !importData.metadata.exportDate) {
                throw new Error('Formato de importación inválido');
            }
            
            // Importar datos
            let importedCount = 0;
            for (const [key, value] of Object.entries(importData)) {
                if (key !== 'metadata' && key.startsWith('primerLatido')) {
                    localStorage.setItem(key, value);
                    importedCount++;
                }
            }
            
            return {
                success: true,
                importedCount: importedCount,
                metadata: importData.metadata
            };
        } catch (error) {
            console.error('Error al importar datos:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};

/**
 * Utilidades de DOM y UI
 */
const DOMUtils = {
    /**
     * Crea un elemento HTML con atributos y contenido
     */
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Establecer atributos
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key === 'data' && typeof value === 'object') {
                for (const [dataKey, dataValue] of Object.entries(value)) {
                    element.dataset[dataKey] = dataValue;
                }
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        }
        
        // Agregar hijos
        if (typeof children === 'string') {
            element.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (child instanceof Node) {
                    element.appendChild(child);
                } else if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                }
            });
        }
        
        return element;
    },
    
    /**
     * Muestra un toast/notificación
     */
    showToast(message, type = 'info', duration = 3000) {
        // Eliminar toast anterior si existe
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Crear nuevo toast
        const toast = this.createElement('div', {
            className: `toast-notification toast-${type}`,
            style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '15px 20px',
                borderRadius: '8px',
                backgroundColor: type === 'success' ? '#A3E4D7' : 
                               type === 'error' ? '#F8C8C8' : 
                               type === 'warning' ? '#FFEAA7' : '#C5F2E8',
                color: type === 'success' ? '#0A6E5A' : 
                      type === 'error' ? '#D32F2F' : 
                      type === 'warning' ? '#856404' : '#00695C',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: '10000',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transform: 'translateX(150%)',
                transition: 'transform 0.3s ease'
            }
        }, [
            this.createElement('i', {
                className: type === 'success' ? 'fas fa-check-circle' : 
                          type === 'error' ? 'fas fa-exclamation-circle' : 
                          type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'
            }),
            this.createElement('span', {}, message)
        ]);
        
        document.body.appendChild(toast);
        
        // Animar entrada
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        // Auto-eliminar después de la duración
        setTimeout(() => {
            toast.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, duration);
        
        return toast;
    },
    
    /**
     * Muestra un modal de confirmación
     */
    showConfirm(message, title = 'Confirmar') {
        return new Promise((resolve) => {
            const modal = this.createElement('div', {
                className: 'modal-overlay',
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '1000',
                    animation: 'fadeIn 0.3s ease'
                }
            });
            
            const modalContent = this.createElement('div', {
                className: 'modal-content',
                style: {
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    width: '90%',
                    maxWidth: '400px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }
            }, [
                this.createElement('h3', {
                    style: {
                        marginTop: '0',
                        marginBottom: '15px',
                        color: '#333'
                    }
                }, title),
                
                this.createElement('p', {
                    style: {
                        marginBottom: '25px',
                        color: '#666',
                        lineHeight: '1.5'
                    }
                }, message),
                
                this.createElement('div', {
                    style: {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '10px'
                    }
                }, [
                    this.createElement('button', {
                        className: 'btn-secondary',
                        style: {
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#E9E9E9',
                            color: '#333',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                        },
                        onclick: () => {
                            document.body.removeChild(modal);
                            resolve(false);
                        }
                    }, 'Cancelar'),
                    
                    this.createElement('button', {
                        className: 'btn-primary',
                        style: {
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '6px',
                            backgroundColor: '#FFB8D9',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                        },
                        onclick: () => {
                            document.body.removeChild(modal);
                            resolve(true);
                        }
                    }, 'Aceptar')
                ])
            ]);
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Cerrar al hacer clic fuera
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    resolve(false);
                }
            });
        });
    },
    
    /**
     * Agrega animación de carga a un elemento
     */
    showLoading(element) {
        if (!element) return null;
        
        const originalContent = element.innerHTML;
        const loadingSpinner = this.createElement('div', {
            className: 'loading-spinner',
            style: {
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #FFB8D9',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }
        });
        
        element.innerHTML = '';
        element.appendChild(loadingSpinner);
        element.style.pointerEvents = 'none';
        element.disabled = true;
        
        // Guardar referencia para restaurar después
        element._originalContent = originalContent;
        element._loadingSpinner = loadingSpinner;
        
        return {
            hide: () => {
                element.innerHTML = originalContent;
                element.style.pointerEvents = '';
                element.disabled = false;
                delete element._originalContent;
                delete element._loadingSpinner;
            }
        };
    },
    
    /**
     * Restaura el contenido original después de mostrar carga
     */
    hideLoading(element) {
        if (element && element._loadingSpinner) {
            element.innerHTML = element._originalContent;
            element.style.pointerEvents = '';
            element.disabled = false;
            delete element._originalContent;
            delete element._loadingSpinner;
        }
    }
};

/**
 * Utilidades de validación
 */
const ValidationUtils = {
    /**
     * Valida un email
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Valida una contraseña
     */
    isValidPassword(password) {
        return password.length >= 6;
    },
    
    /**
     * Valida un teléfono
     */
    isValidPhone(phone) {
        const re = /^\d{10}$/;
        return re.test(phone.replace(/\D/g, ''));
    },
    
    /**
     * Valida una fecha
     */
    isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    },
    
    /**
     * Valida un número
     */
    isValidNumber(value, min = null, max = null) {
        const num = Number(value);
        if (isNaN(num)) return false;
        
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
        
        return true;
    }
};

/**
 * Utilidades de arrays y objetos
 */
const ObjectUtils = {
    /**
     * Clona un objeto de manera profunda
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (Array.isArray(obj)) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    },
    
    /**
     * Fusiona objetos
     */
    merge(target, ...sources) {
        sources.forEach(source => {
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    if (this.isObject(target[key]) && this.isObject(source[key])) {
                        this.merge(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            }
        });
        return target;
    },
    
    /**
     * Verifica si un valor es un objeto
     */
    isObject(value) {
        return value && typeof value === 'object' && !Array.isArray(value);
    },
    
    /**
     * Elimina propiedades con valores null, undefined o empty string
     */
    cleanObject(obj) {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== null && value !== undefined && value !== '') {
                cleaned[key] = value;
            }
        }
        return cleaned;
    }
};

/**
 * Utilidades de matemáticas
 */
const MathUtils = {
    /**
     * Calcula el porcentaje
     */
    percentage(value, total) {
        if (total === 0) return 0;
        return (value / total) * 100;
    },
    
    /**
     * Redondea a un número específico de decimales
     */
    round(value, decimals = 2) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    },
    
    /**
     * Genera un número aleatorio en un rango
     */
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Limita un valor a un rango
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
};

/**
 * Utilidades de texto
 */
const StringUtils = {
    /**
     * Capitaliza la primera letra
     */
    capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    /**
     * Trunca texto y agrega puntos suspensivos
     */
    truncate(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
    /**
     * Formatea un número con separadores de miles
     */
    formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    /**
     * Convierte un string a slug
     */
    toSlug(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};

// Exportar todas las utilidades
window.Utils = {
    Date: DateUtils,
    Storage: StorageUtils,
    DOM: DOMUtils,
    Validation: ValidationUtils,
    Object: ObjectUtils,
    Math: MathUtils,
    String: StringUtils
};

// Añadir estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .loading-spinner {
        animation: spin 1s linear infinite;
    }
    
    .toast-notification {
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(150%); }
        to { transform: translateX(0); }
    }
    
    .modal-overlay {
        animation: fadeIn 0.3s ease;
    }
`;

document.head.appendChild(style);

console.log('Utilidades cargadas correctamente');