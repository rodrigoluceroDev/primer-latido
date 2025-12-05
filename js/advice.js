/**
 * advice.js - Sistema de consejos y seguimiento del embarazo para Primer Latido
 * Maneja la sección de consejos por trimestre y el seguimiento semana a semana
 */

// Datos de consejos por trimestre
const ADVICE_DATA = {
    1: {
        title: "Primer Trimestre (Semanas 1-13)",
        description: "El primer trimestre es crucial para el desarrollo del bebé. Tu cuerpo está experimentando grandes cambios.",
        tips: [
            {
                icon: "apple-alt",
                title: "Ácido Fólico",
                description: "Toma 400-800 mcg diarios de ácido fólico para prevenir defectos del tubo neural.",
                importance: "alta"
            },
            {
                icon: "bed",
                title: "Descanso",
                description: "Descansa cuando sientas fatiga. Es normal sentir más cansancio durante estas semanas.",
                importance: "media"
            },
            {
                icon: "ban",
                title: "Evita",
                description: "Evita alcohol, tabaco y medicamentos no recetados por tu médico.",
                importance: "alta"
            },
            {
                icon: "stethoscope",
                title: "Primera Consulta",
                description: "Programa tu primera consulta prenatal alrededor de la semana 8.",
                importance: "alta"
            },
            {
                icon: "utensils",
                title: "Alimentación",
                description: "Come pequeñas porciones frecuentes para controlar las náuseas.",
                importance: "media"
            },
            {
                icon: "tint",
                title: "Hidratación",
                description: "Bebe al menos 8 vasos de agua al día para mantenerte hidratada.",
                importance: "media"
            }
        ],
        milestones: [
            { week: 5, title: "Latido cardíaco", description: "El corazón del bebé comienza a latir" },
            { week: 8, title: "Órganos formados", description: "Todos los órganos principales se han formado" },
            { week: 12, title: "Fin riesgo", description: "Disminuye el riesgo de aborto espontáneo" }
        ]
    },
    2: {
        title: "Segundo Trimestre (Semanas 14-27)",
        description: "Muchas mujeres dicen que este es el trimestre más cómodo. ¡Disfrútalo!",
        tips: [
            {
                icon: "running",
                title: "Ejercicio",
                description: "Realiza ejercicio moderado como caminar, nadar o yoga prenatal.",
                importance: "media"
            },
            {
                icon: "heart",
                title: "Movimientos",
                description: "Empiezas a sentir los movimientos del bebé. Lleva un registro.",
                importance: "media"
            },
            {
                icon: "weight",
                title: "Aumento de peso",
                description: "Es normal aumentar 0.5-1 kg por semana durante este trimestre.",
                importance: "media"
            },
            {
                icon: "teeth",
                title: "Salud dental",
                description: "Visita al dentista. Los cambios hormonales pueden afectar tus encías.",
                importance: "baja"
            },
            {
                icon: "baby",
                title: "Ecografía",
                description: "Entre las semanas 18-22 se realiza la ecografía morfológica.",
                importance: "alta"
            },
            {
                icon: "book",
                title: "Educación prenatal",
                description: "Considera tomar clases de preparación para el parto.",
                importance: "baja"
            }
        ],
        milestones: [
            { week: 16, title: "Sexo visible", description: "Se puede determinar el sexo del bebé" },
            { week: 20, title: "Mitad del camino", description: "¡Llegaste a la mitad del embarazo!" },
            { week: 24, title: "Viabilidad", description: "El bebé podría sobrevivir con cuidados intensivos" }
        ]
    },
    3: {
        title: "Tercer Trimestre (Semanas 28-40)",
        description: "Prepárate para el nacimiento. Tu bebé está creciendo rápidamente.",
        tips: [
            {
                icon: "hospital",
                title: "Preparativos",
                description: "Prepara tu maleta para el hospital y el cuarto del bebé.",
                importance: "alta"
            },
            {
                icon: "hands-helping",
                title: "Soporte",
                description: "Organiza quién te ayudará después del parto.",
                importance: "media"
            },
            {
                icon: "procedures",
                title: "Contracciones",
                description: "Aprende a diferenciar contracciones de Braxton Hicks de las reales.",
                importance: "alta"
            },
            {
                icon: "shopping-bag",
                title: "Compras necesarias",
                description: "Adquiere lo esencial: asiento para el auto, cuna, pañales.",
                importance: "media"
            },
            {
                icon: "clipboard-check",
                title: "Plan de parto",
                description: "Habla con tu médico sobre tus preferencias para el parto.",
                importance: "media"
            },
            {
                icon: "bell",
                title: "Señales de alarma",
                description: "Conoce las señales que requieren atención médica inmediata.",
                importance: "alta"
            }
        ],
        milestones: [
            { week: 28, title: "Tercer trimestre", description: "Comienza el último tramo del embarazo" },
            { week: 32, title: "Posición fetal", description: "El bebé se coloca cabeza abajo" },
            { week: 37, title: "A término", description: "El bebé está considerado a término" }
        ]
    }
};

// Datos de desarrollo semana a semana
const WEEKLY_DEVELOPMENT = {
    1: {
        title: "Comienza el viaje",
        description: "Aunque todavía no estés embarazada desde el punto de vista médico, esta semana se considera el inicio de tu embarazo. Tu cuerpo se está preparando para la ovulación.",
        size: "Tamaño de un punto",
        weight: "0 gramos",
        babyDevelopment: "La fecundación ocurre cuando un espermatozoide se une al óvulo.",
        momChanges: "Puedes notar síntomas similares al síndrome premenstrual.",
        tips: ["Toma ácido fólico diariamente", "Deja de fumar y evita el alcohol"]
    },
    8: {
        title: "Formación de características faciales",
        description: "Los ojos, nariz y boca del bebé comienzan a formarse. Los brazos y piernas se alargan y los dedos empiezan a desarrollarse.",
        size: "1.6 cm (tamaño de un frijol)",
        weight: "1 gramo",
        babyDevelopment: "El corazón late rápidamente. Se forman los párpados, labios y orejas.",
        momChanges: "Las náuseas matutinas pueden intensificarse. Podrías sentir fatiga extrema.",
        tips: ["Come pequeñas porciones frecuentes", "Descansa cuando lo necesites"]
    },
    12: {
        title: "Fin del primer trimestre",
        description: "¡Felicidades! Has completado el primer trimestre. El riesgo de aborto espontáneo disminuye significativamente.",
        size: "5.4 cm (tamaño de una ciruela)",
        weight: "14 gramos",
        babyDevelopment: "Los órganos vitales están formados. El bebé puede hacer movimientos con la boca.",
        momChanges: "Las náuseas pueden empezar a disminuir. Tu vientre comienza a notarse.",
        tips: ["Anuncia tu embarazo si lo deseas", "Programa pruebas de detección"]
    },
    20: {
        title: "Mitad del camino",
        description: "¡Felicidades, estás a mitad del embarazo! Tu bebé puede oír sonidos y está desarrollando sus sentidos. Puedes empezar a sentir sus movimientos.",
        size: "25 cm (desde la cabeza a los pies)",
        weight: "300 gramos",
        babyDevelopment: "El bebé traga líquido amniótico. Se forman las cejas y pestañas.",
        momChanges: "Puedes sentir patadas. Tu ombligo puede sobresalir.",
        tips: ["Habla y canta a tu bebé", "Comienza a pensar en nombres"]
    },
    28: {
        title: "Tercer trimestre",
        description: "¡Bienvenida al tercer trimestre! Tu bebé está ganando grasa y desarrollando sus pulmones.",
        size: "37.6 cm",
        weight: "1 kg",
        babyDevelopment: "Los ojos pueden abrirse y cerrarse. El cerebro se desarrolla rápidamente.",
        momChanges: "Puedes experimentar acidez estomacal y falta de aire.",
        tips: ["Prepara la habitación del bebé", "Toma clases de preparación al parto"]
    },
    40: {
        title: "¡Listo para nacer!",
        description: "Tu bebé está completamente desarrollado y listo para nacer. La mayoría de los bebés nacen entre las semanas 38 y 42.",
        size: "50 cm en promedio",
        weight: "3.5 kg en promedio",
        babyDevelopment: "Los pulmones están maduros. El bebé está en posición para nacer.",
        momChanges: "Puedes tener contracciones falsas. El cuello uterino se prepara para el parto.",
        tips: ["Ten lista tu maleta para el hospital", "Descansa y ahorra energía para el parto"]
    }
};

// Hitos importantes del embarazo
const PREGNANCY_MILESTONES = [
    { week: 5, icon: "heartbeat", title: "Primer Latido", description: "El corazón del bebé comienza a latir", completed: false },
    { week: 12, icon: "shield-alt", title: "Fin Primer Trimestre", description: "Disminuye riesgo de aborto", completed: false },
    { week: 16, icon: "venus-mars", title: "Sexo Visible", description: "Se puede determinar el sexo", completed: false },
    { week: 20, icon: "flag-checkered", title: "Mitad del Camino", description: "¡20 semanas completadas!", completed: false },
    { week: 24, icon: "hand-holding-medical", title: "Viabilidad", description: "Posible supervivencia extrauterina", completed: false },
    { week: 28, icon: "running", title: "Tercer Trimestre", description: "Última etapa del embarazo", completed: false },
    { week: 32, icon: "baby", title: "Posición Fetal", description: "Bebé se coloca cabeza abajo", completed: false },
    { week: 37, icon: "check-circle", title: "A Término", description: "Bebé completamente desarrollado", completed: false }
];

// Hitos semanales detallados (1 por semana) con títulos y descripciones breves
const WEEKLY_MILESTONES_FULL = [
    { week: 1, icon: 'seedling', title: 'Inicio del conteo gestacional', description: 'Se considera el inicio del embarazo desde el primer día del último período menstrual; el cuerpo se prepara para la ovulación.', completed: false },
    { week: 2, icon: 'dna', title: 'Ovulación y fecundación', description: 'Ocurre la ovulación y, si hay espermatozoides, puede producirse la fecundación del óvulo.', completed: false },
    { week: 3, icon: 'syringe', title: 'Implantación', description: 'El embrión se implanta en la pared uterina y comienza a formarse la placenta incipiente.', completed: false },
    { week: 4, icon: 'heartbeat', title: 'Desarrollo temprano del embrión', description: 'Se inicia la formación de estructuras básicas y el saco gestacional es visible en ecografía temprana.', completed: false },
    { week: 5, icon: 'heartbeat', title: 'Primeros latidos', description: 'El corazón embrionario comienza a latir de forma detectable en ecografías transvaginales.', completed: false },
    { week: 6, icon: 'baby', title: 'Formación de cabeza y extremidades', description: 'Se desarrollan los brotes de brazos y piernas y empiezan a formarse rasgos faciales.', completed: false },
    { week: 7, icon: 'tooth', title: 'Desarrollo facial y estructuras', description: 'Se acentúa la formación de ojos, nariz y mandíbula; empiezan a diferenciarse tejidos básicos.', completed: false },
    { week: 8, icon: 'hand-holding-medical', title: 'Organogénesis en progreso', description: 'Los órganos principales continúan formándose; es una etapa crítica para la morfogénesis.', completed: false },
    { week: 9, icon: 'walking', title: 'Movimiento embrionario', description: 'El embrión puede realizar movimientos pequeños, aunque la madre aún no los percibe.', completed: false },
    { week: 10, icon: 'microscope', title: 'Diferenciación de órganos', description: 'Los órganos siguen madurando y la estructura general del feto se consolida.', completed: false },
    { week: 11, icon: 'diagnoses', title: 'Cierre de estructuras importantes', description: 'Se cierran y consolidan estructuras del sistema nervioso y circulatorio.', completed: false },
    { week: 12, icon: 'shield-alt', title: 'Fin del periodo embrionario', description: 'Termina la fase embrionaria y comienza la fase fetal con menor riesgo relativo de malformaciones mayores.', completed: false },
    { week: 13, icon: 'smile', title: 'Transición al segundo trimestre', description: 'El feto continúa creciendo y muchas madres notan reducción de náuseas.', completed: false },
    { week: 14, icon: 'user-check', title: 'Crecimiento acelerado', description: 'Aumenta el crecimiento fetal y la placenta funciona de forma más eficiente.', completed: false },
    { week: 15, icon: 'child', title: 'Formación de uñas y pelo fino', description: 'Comienzan a formarse uñas y un vello fino (lanugo) sobre la piel.', completed: false },
    { week: 16, icon: 'venus-mars', title: 'Diferenciación sexual visible', description: 'En muchos casos el sexo del bebé puede observarse en la ecografía.', completed: false },
    { week: 17, icon: 'ear', title: 'Desarrollo sensorial', description: 'Se inician estructuras del oído y comienza la percepción de sonidos externos.', completed: false },
    { week: 18, icon: 'eyes', title: 'Movimientos más coordinados', description: 'Los movimientos fetales son más definidos; madre puede comenzar a sentirlos en algunas primeras gestantes.', completed: false },
    { week: 19, icon: 'heartbeat', title: 'Ecografía morfológica', description: 'Se realiza la ecografía estructural para evaluar anatomía fetal alrededor de esta semana.', completed: false },
    { week: 20, icon: 'flag-checkered', title: 'Mitad del embarazo', description: 'Se alcanza la mitad del embarazo; el bebé crece y madura órganos internos.', completed: false },
    { week: 21, icon: 'book-medical', title: 'Desarrollo digestivo', description: 'El sistema digestivo se desarrolla y el bebé traga líquido amniótico.', completed: false },
    { week: 22, icon: 'bone', title: 'Ossificación', description: 'Los huesos comienzan a osificarse y a endurecerse progresivamente.', completed: false },
    { week: 23, icon: 'lungs', title: 'Desarrollo pulmonar inicial', description: 'Se forman los alvéolos primitivos y comienza la producción inicial de surfactante.', completed: false },
    { week: 24, icon: 'hand-holding', title: 'Viabilidad creciente', description: 'A partir de esta semana la probabilidad de supervivencia fuera del útero aumenta con cuidados intensivos.', completed: false },
    { week: 25, icon: 'brain', title: 'Desarrollo cerebral', description: 'El cerebro fetal experimenta crecimiento rápido y formación de circunvoluciones iniciales.', completed: false },
    { week: 26, icon: 'lungs', title: 'Maduración pulmonar', description: 'Continúa la maduración de los pulmones; producción de surfactante aumenta.', completed: false },
    { week: 27, icon: 'stethoscope', title: 'Fin del segundo trimestre', description: 'Se completa el segundo trimestre; aumentan tamaño y complejidad funcional del feto.', completed: false },
    { week: 28, icon: 'running', title: 'Ingreso al tercer trimestre', description: 'Comienza el último tramo con ganancia importante de peso y maduración orgánica.', completed: false },
    { week: 29, icon: 'weight', title: 'Acumulación de grasa', description: 'El bebé acumula grasa subcutánea que ayuda a la regulación térmica tras el nacimiento.', completed: false },
    { week: 30, icon: 'heart', title: 'Fortalecimiento cardíaco', description: 'El sistema cardiovascular se consolida para soportar la vida extrauterina.', completed: false },
    { week: 31, icon: 'baby', title: 'Mayor actividad fetal', description: 'Movimientos fuertes y patrones de sueño-vigilia más definidos.', completed: false },
    { week: 32, icon: 'baby-carriage', title: 'Posición fetal', description: 'El bebé suele colocarse con la cabeza hacia abajo; la posición se estabiliza.', completed: false },
    { week: 33, icon: 'thermometer', title: 'Ganancia de peso acelerada', description: 'Aumenta de manera notable el peso fetal en preparación al nacimiento.', completed: false },
    { week: 34, icon: 'lungs', title: 'Madurez pulmonar avanzada', description: 'Los pulmones continúan madurando; las probabilidades de adaptación posnatal mejoran.', completed: false },
    { week: 35, icon: 'check-circle', title: 'Preparación para el parto', description: 'Se completan muchos procesos de madurez; se afinan reflejos y tonificación muscular.', completed: false },
    { week: 36, icon: 'hospital', title: 'A término temprano', description: 'A partir de esta semana muchos bebés están listos para nacer con mínima intervención.', completed: false },
    { week: 37, icon: 'baby', title: 'A término', description: 'El bebé está considerado a término y listo para el nacimiento en cualquier momento.', completed: false },
    { week: 38, icon: 'bell', title: 'Refinamiento final', description: 'Continúa el refinamiento funcional de pulmones, sistema nervioso y depósitos de grasa.', completed: false },
    { week: 39, icon: 'home', title: 'Listo para el nacimiento', description: 'El bebé está completamente desarrollado y puede nacer de forma segura en cualquier momento.', completed: false },
    { week: 40, icon: 'gift', title: 'Semana estimada de parto', description: 'Semana típica de término; el parto suele ocurrir entre las semanas 38 y 42.', completed: false }
];

class AdviceSystem {
    constructor() {
        this.currentWeek = 1;
        this.currentTrimester = 1;
        this.initialized = false;
    }

    /**
     * Inicializa el sistema de consejos
     */
    init() {
        if (this.initialized) return;
        
        console.log('Inicializando sistema de consejos...');
        
        // Configurar pestañas de trimestres
        this.setupTrimestreTabs();
        
        // Configurar navegación de semanas
        this.setupWeekNavigation();
        
        // Cargar datos iniciales
        this.loadInitialData();
        
        // Actualizar display
        this.updateDisplay();
        
        this.initialized = true;
        console.log('Sistema de consejos inicializado');
    }

    /**
     * Configura las pestañas de trimestres
     */
    setupTrimestreTabs() {
        const tabs = document.querySelectorAll('.advice-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Actualizar pestaña activa
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Mostrar contenido del trimestre
                const trimester = parseInt(tab.dataset.tab);
                this.showTrimesterAdvice(trimester);
                
                // Actualizar trimestre actual
                this.currentTrimester = trimester;
                
                // Guardar preferencia
                localStorage.setItem('primerLatidoLastTrimester', trimester);
            });
        });
        
        // Cargar último trimestre visto
        const lastTrimester = localStorage.getItem('primerLatidoLastTrimester') || 1;
        const defaultTab = document.querySelector(`.advice-tab[data-tab="${lastTrimester}"]`);
        if (defaultTab) {
            defaultTab.click();
        }
    }

    /**
     * Configura la navegación de semanas
     */
    setupWeekNavigation() {
        const prevBtn = document.getElementById('prevWeek');
        const nextBtn = document.getElementById('nextWeek');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.navigateWeek(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.navigateWeek(1);
            });
        }
        
        // Actualizar semana desde datos del embarazo
        const pregnancyData = JSON.parse(localStorage.getItem('primerLatidoPregnancyData') || '{}');
        if (pregnancyData.currentWeek) {
            this.currentWeek = pregnancyData.currentWeek;
            this.currentTrimester = this.getTrimester(this.currentWeek);
            
            // Seleccionar pestaña correcta
            const trimesterTab = document.querySelector(`.advice-tab[data-tab="${this.currentTrimester}"]`);
            if (trimesterTab) {
                trimesterTab.click();
            }
        }
    }

    /**
     * Carga datos iniciales
     */
    loadInitialData() {
        // Actualizar hitos basados en la semana actual
        this.updateMilestones();
        
        // Cargar última semana vista
        const lastWeek = localStorage.getItem('primerLatidoLastWeek');
        if (lastWeek && !isNaN(lastWeek)) {
            this.currentWeek = parseInt(lastWeek);
        }
    }

    /**
     * Muestra consejos para un trimestre específico
     */
    showTrimesterAdvice(trimester) {
        const adviceData = ADVICE_DATA[trimester];
        if (!adviceData) return;
        
        // Actualizar título y descripción
        const titleElement = document.querySelector(`#tab${trimester} h3`);
        if (titleElement) {
            const icon = trimester === 1 ? 'seedling' : trimester === 2 ? 'leaf' : 'baby';
            titleElement.innerHTML = `<i class="fas fa-${icon}"></i> ${adviceData.title}`;
        }
        
        // Actualizar consejos
        const adviceGrid = document.querySelector(`#tab${trimester} .advice-grid`);
        if (adviceGrid) {
            adviceGrid.innerHTML = adviceData.tips.map(tip => `
                <div class="advice-card importance-${tip.importance}">
                    <i class="fas fa-${tip.icon}"></i>
                    <h4>${tip.title}</h4>
                    <p>${tip.description}</p>
                </div>
            `).join('');
        }
        
        // Actualizar hitos del trimestre
        this.showTrimesterMilestones(trimester);
    }

    /**
     * Muestra hitos de un trimestre
     */
    showTrimesterMilestones(trimester) {
        const milestonesData = ADVICE_DATA[trimester]?.milestones || [];
        const milestonesContainer = document.querySelector(`#tab${trimester} .trimester-milestones`);
        
        if (milestonesContainer) {
            milestonesContainer.innerHTML = `
                <h4><i class="fas fa-flag"></i> Hitos del Trimestre</h4>
                <div class="milestones-list">
                    ${milestonesData.map(milestone => `
                        <div class="milestone-item ${this.currentWeek >= milestone.week ? 'completed' : ''}">
                            <div class="milestone-week">Semana ${milestone.week}</div>
                            <div class="milestone-content">
                                <h5>${milestone.title}</h5>
                                <p>${milestone.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    /**
     * Navega entre semanas
     */
    navigateWeek(direction) {
        const newWeek = this.currentWeek + direction;
        
        // Validar rango (1-40 semanas)
        if (newWeek < 1 || newWeek > 40) {
            return;
        }
        
        this.currentWeek = newWeek;
        this.updateWeekDisplay();
        
        // Guardar última semana vista
        localStorage.setItem('primerLatidoLastWeek', this.currentWeek);
    }

    /**
     * Actualiza el display de la semana
     */
    updateWeekDisplay() {
        const weekData = this.getWeekData(this.currentWeek);
        
        // Actualizar número de semana
        const weekNumberElement = document.getElementById('trackerWeek');
        if (weekNumberElement) {
            weekNumberElement.textContent = this.currentWeek;
        }
        
        // Actualizar información de la semana
        document.getElementById('weekTitle').textContent = weekData.title;
        document.getElementById('weekDescription').textContent = weekData.description;
        document.getElementById('weekSize').textContent = weekData.size;
        document.getElementById('weekWeight').textContent = weekData.weight;
        
        // Actualizar desarrollo del bebé y cambios en mamá
        const weekDetails = document.querySelector('.week-details');
        if (weekDetails) {
            const extraInfo = document.querySelector('.week-extra-info');
            if (!extraInfo) {
                const extraInfoDiv = document.createElement('div');
                extraInfoDiv.className = 'week-extra-info';
                weekDetails.appendChild(extraInfoDiv);
            }
            
            document.querySelector('.week-extra-info').innerHTML = `
                <div class="development-section">
                    <h5><i class="fas fa-baby"></i> Desarrollo del bebé</h5>
                    <p>${weekData.babyDevelopment}</p>
                </div>
                <div class="changes-section">
                    <h5><i class="fas fa-female"></i> Cambios en mamá</h5>
                    <p>${weekData.momChanges}</p>
                </div>
                <div class="tips-section">
                    <h5><i class="fas fa-lightbulb"></i> Consejos prácticos</h5>
                    <ul>
                        ${weekData.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Actualizar imagen (usando placeholder dinámico)
        const weekImage = document.getElementById('weekImage');
        if (weekImage) {
            // En una app real, aquí cargarías imágenes reales
            const colors = ['FFD6E7', 'C5F2E8', 'FFE8D6', 'E8D6FF'];
            const color = colors[(this.currentWeek - 1) % colors.length];
            weekImage.innerHTML = `
                <div class="week-image-placeholder" style="background-color: #${color};">
                    <div class="week-badge">Semana ${this.currentWeek}</div>
                    <div class="week-size">${weekData.size}</div>
                    <div class="week-weight">${weekData.weight}</div>
                </div>
            `;
        }
        
        // Actualizar hitos
        this.updateMilestones();
        
        // Actualizar navegación
        this.updateNavigation();
        
        // Actualizar trimestre si cambió
        const newTrimester = this.getTrimester(this.currentWeek);
        if (newTrimester !== this.currentTrimester) {
            this.currentTrimester = newTrimester;
            const trimesterTab = document.querySelector(`.advice-tab[data-tab="${newTrimester}"]`);
            if (trimesterTab) {
                trimesterTab.click();
            }
        }
    }

    /**
     * Obtiene datos de una semana específica
     */
    getWeekData(week) {
        // Buscar datos exactos
        if (WEEKLY_DEVELOPMENT[week]) {
            return WEEKLY_DEVELOPMENT[week];
        }
        
        // Encontrar la semana más cercana con datos
        const availableWeeks = Object.keys(WEEKLY_DEVELOPMENT).map(Number).sort((a, b) => a - b);
        let closestWeek = availableWeeks[0];
        
        for (const availableWeek of availableWeeks) {
            if (availableWeek <= week) {
                closestWeek = availableWeek;
            } else {
                break;
            }
        }
        
        // Datos base de la semana más cercana
        const baseData = WEEKLY_DEVELOPMENT[closestWeek];
        
        // Personalizar según la semana actual
        return {
            ...baseData,
            title: `Semana ${week}`,
            description: `Tu bebé continúa desarrollándose en la semana ${week}. ${baseData.description}`,
            size: this.estimateSize(week),
            weight: this.estimateWeight(week)
        };
    }

    /**
     * Estima el tamaño del bebé para una semana
     */
    estimateSize(week) {
        // Fórmula aproximada de crecimiento
        if (week <= 12) {
            return `${(week * 0.5).toFixed(1)} cm`;
        } else if (week <= 20) {
            return `${(week * 1.25).toFixed(1)} cm`;
        } else if (week <= 30) {
            return `${(week * 1.8).toFixed(1)} cm`;
        } else {
            return `${(40 + (week - 30) * 1.2).toFixed(1)} cm`;
        }
    }

    /**
     * Estima el peso del bebé para una semana
     */
    estimateWeight(week) {
        // Fórmula aproximada de peso
        if (week <= 12) {
            return `${(week * 1.2).toFixed(1)} gramos`;
        } else if (week <= 20) {
            return `${(Math.pow(week - 10, 2) * 3).toFixed(1)} gramos`;
        } else if (week <= 30) {
            return `${((week - 20) * 100).toFixed(1)} gramos`;
        } else {
            return `${(1000 + (week - 30) * 200).toFixed(1)} gramos`;
        }
    }

    /**
     * Actualiza los hitos del embarazo
     */
    updateMilestones() {
        const milestonesContainer = document.querySelector('.milestones-list');
        if (!milestonesContainer) return;
        
        // Usar la lista completa de hitos semanales para mostrar al menos un hito por semana
        const relevantMilestones = WEEKLY_MILESTONES_FULL
            .filter(milestone => milestone.week <= this.currentWeek + 4)
            .sort((a, b) => a.week - b.week);
        
        // Marcar hitos completados
        relevantMilestones.forEach(milestone => {
            milestone.completed = milestone.week <= this.currentWeek;
        });
        
        // Actualizar HTML
        milestonesContainer.innerHTML = relevantMilestones.map(milestone => `
            <div class="milestone ${milestone.completed ? 'completed' : ''}">
                <div class="milestone-icon">
                    <i class="fas fa-${milestone.icon}"></i>
                </div>
                <div class="milestone-content">
                    <h4>${milestone.title}</h4>
                    <p>${milestone.description}</p>
                    <div class="milestone-week">Semana ${milestone.week}</div>
                </div>
                <div class="milestone-status">
                    <i class="fas fa-${milestone.completed ? 'check-circle' : 'circle'}"></i>
                </div>
            </div>
        `).join('');
        
        // Si no hay hitos próximos, mostrar mensaje
        if (relevantMilestones.length === 0) {
            milestonesContainer.innerHTML = `
                <div class="empty-milestones">
                    <i class="fas fa-flag-checkered"></i>
                    <p>¡Felicidades! Has completado todos los hitos importantes del embarazo.</p>
                </div>
            `;
        }
    }

    /**
     * Actualiza los controles de navegación
     */
    updateNavigation() {
        const prevBtn = document.getElementById('prevWeek');
        const nextBtn = document.getElementById('nextWeek');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentWeek <= 1;
            prevBtn.title = this.currentWeek <= 1 ? 'Estás en la primera semana' : 'Ver semana anterior';
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentWeek >= 40;
            nextBtn.title = this.currentWeek >= 40 ? '¡Última semana!' : 'Ver semana siguiente';
        }
    }

    /**
     * Determina el trimestre basado en la semana
     */
    getTrimester(week) {
        if (week <= 13) return 1;
        if (week <= 27) return 2;
        return 3;
    }

    /**
     * Actualiza todo el display
     */
    updateDisplay() {
        this.updateWeekDisplay();
        this.showTrimesterAdvice(this.currentTrimester);
    }

    /**
     * Actualiza la semana actual desde datos externos
     */
    updateFromPregnancyData(pregnancyData) {
        if (pregnancyData && pregnancyData.currentWeek) {
            this.currentWeek = pregnancyData.currentWeek;
            this.currentTrimester = this.getTrimester(this.currentWeek);
            this.updateDisplay();
        }
    }
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en la página con consejos
    if (!document.querySelector('.advice-section')) {
        return;
    }
    
    // Crear instancia del sistema de consejos
    window.adviceSystem = new AdviceSystem();
    window.adviceSystem.init();
    
    // Escuchar actualizaciones de datos del embarazo
    window.addEventListener('pregnancyDataUpdated', function(e) {
        if (window.adviceSystem && e.detail) {
            window.adviceSystem.updateFromPregnancyData(e.detail);
        }
    });
    
    // Escuchar para cargar datos iniciales si ya existen
    const pregnancyData = JSON.parse(localStorage.getItem('primerLatidoPregnancyData') || '{}');
    if (pregnancyData.currentWeek) {
        window.adviceSystem.updateFromPregnancyData(pregnancyData);
    }
});

// Añadir estilos CSS para los componentes de consejos
const adviceStyles = document.createElement('style');
adviceStyles.textContent = `
    /* Estilos para las tarjetas de consejo */
    .advice-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border-left: 4px solid #FFD6E7;
    }
    
    .advice-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }
    
    .advice-card i {
        font-size: 2rem;
        color: #FFB8D9;
        margin-bottom: 15px;
    }
    
    .advice-card h4 {
        margin: 10px 0;
        color: #333;
        font-size: 1.1rem;
    }
    
    .advice-card p {
        color: #666;
        font-size: 0.9rem;
        line-height: 1.5;
        margin: 0;
    }
    
    /* Importancia de los consejos */
    .advice-card.importance-alta {
        border-left-color: #F8C8C8;
    }
    
    .advice-card.importance-alta i {
        color: #F8C8C8;
    }
    
    .advice-card.importance-media {
        border-left-color: #FFEAA7;
    }
    
    .advice-card.importance-media i {
        color: #FFEAA7;
    }
    
    .advice-card.importance-baja {
        border-left-color: #A3E4D7;
    }
    
    .advice-card.importance-baja i {
        color: #A3E4D7;
    }
    
    /* Grid de consejos */
    .advice-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    /* Hitos del trimestre */
    .trimester-milestones {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #F0F0F0;
    }
    
    .trimester-milestones h4 {
        color: #333;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .milestones-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .milestone-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px;
        background: #F9F9F9;
        border-radius: 8px;
        transition: background-color 0.3s ease;
    }
    
    .milestone-item:hover {
        background: #F0F0F0;
    }
    
    .milestone-item.completed {
        background: #E8F5E9;
        border-left: 3px solid #A3E4D7;
    }
    
    .milestone-week {
        background: #FFD6E7;
        color: #333;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        min-width: 80px;
        text-align: center;
    }
    
    .milestone-item.completed .milestone-week {
        background: #A3E4D7;
    }
    
    .milestone-content h5 {
        margin: 0 0 5px 0;
        color: #333;
        font-size: 1rem;
    }
    
    .milestone-content p {
        margin: 0;
        color: #666;
        font-size: 0.85rem;
    }
    
    /* Información adicional de la semana */
    .week-extra-info {
        margin-top: 20px;
        display: grid;
        gap: 20px;
    }
    
    @media (min-width: 768px) {
        .week-extra-info {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    .development-section,
    .changes-section,
    .tips-section {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    }
    
    .development-section h5,
    .changes-section h5,
    .tips-section h5 {
        color: #333;
        margin-top: 0;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .development-section {
        border-left: 4px solid #A3E4D7;
    }
    
    .changes-section {
        border-left: 4px solid #FFB8D9;
    }
    
    .tips-section {
        border-left: 4px solid #FFEAA7;
        grid-column: 1 / -1;
    }
    
    .tips-section ul {
        margin: 0;
        padding-left: 20px;
    }
    
    .tips-section li {
        margin-bottom: 8px;
        color: #666;
    }
    
    /* Placeholder de imagen de semana */
    .week-image-placeholder {
        width: 100%;
        height: 200px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        color: white;
        font-weight: bold;
    }
    
    .week-badge {
        background: rgba(0,0,0,0.7);
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 1.2rem;
        margin-bottom: 10px;
    }
    
    .week-size,
    .week-weight {
        background: rgba(255,255,255,0.9);
        color: #333;
        padding: 5px 15px;
        border-radius: 15px;
        margin: 5px;
        font-size: 0.9rem;
    }
    
    /* Hitos en el sidebar */
    .milestone {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        margin-bottom: 10px;
        background: #F9F9F9;
        border-radius: 10px;
        transition: all 0.3s ease;
    }
    
    .milestone:hover {
        background: #F0F0F0;
        transform: translateX(5px);
    }
    
    .milestone.completed {
        background: #E8F5E9;
        border-left: 4px solid #A3E4D7;
    }
    
    .milestone-icon {
        width: 40px;
        height: 40px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: #FFB8D9;
    }
    
    .milestone.completed .milestone-icon {
        background: #A3E4D7;
        color: white;
    }
    
    .milestone-content h4 {
        margin: 0 0 5px 0;
        font-size: 1rem;
        color: #333;
    }
    
    .milestone-content p {
        margin: 0;
        font-size: 0.85rem;
        color: #666;
    }
    
    .milestone-week {
        font-size: 0.8rem;
        color: #999;
        margin-top: 5px;
    }
    
    .milestone-status i {
        font-size: 1.2rem;
        color: #DDD;
    }
    
    .milestone.completed .milestone-status i {
        color: #A3E4D7;
    }
    
    .empty-milestones {
        text-align: center;
        padding: 30px 20px;
        color: #999;
    }
    
    .empty-milestones i {
        font-size: 3rem;
        margin-bottom: 15px;
        color: #FFD6E7;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .advice-grid {
            grid-template-columns: 1fr;
        }
        
        .week-extra-info {
            grid-template-columns: 1fr;
        }
        
        .milestone {
            flex-direction: column;
            text-align: center;
            gap: 10px;
        }
        
        .milestone-icon {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
        }
    }
`;

document.head.appendChild(adviceStyles);