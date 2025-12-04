// Calculadora de fecha probable de parto
function initDueDateCalculator() {
    const calculatorForm = document.getElementById('dueDateCalculator');
    const cycleSlider = document.getElementById('cycleLength');
    const cycleValue = document.getElementById('cycleValue');
    const resetBtn = document.getElementById('resetCalculator');
    
    if (!calculatorForm) return;
    
    // Actualizar valor del ciclo en tiempo real
    if (cycleSlider && cycleValue) {
        cycleSlider.addEventListener('input', function() {
            cycleValue.textContent = `${this.value} días`;
        });
    }
    
    // Calcular al enviar el formulario
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateDueDate();
    });
    
    // Reiniciar calculadora
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() - 28);
            document.getElementById('lastPeriod').value = defaultDate.toISOString().split('T')[0];
            document.getElementById('cycleLength').value = 28;
            document.getElementById('cycleValue').textContent = '28 días';
            
            calculateDueDate();
            showNotification('Calculadora reiniciada', 'info');
        });
    }
}

function calculateDueDate() {
    const lastPeriodInput = document.getElementById('lastPeriod');
    const cycleLengthInput = document.getElementById('cycleLength');
    
    if (!lastPeriodInput || !lastPeriodInput.value) {
        showNotification('Por favor, ingresa la fecha de tu última menstruación', 'error');
        return;
    }
    
    // Guardar fecha en localStorage
    localStorage.setItem('primerLatidoLastPeriod', lastPeriodInput.value);
    
    const lastPeriod = new Date(lastPeriodInput.value);
    const cycleLength = cycleLengthInput ? parseInt(cycleLengthInput.value) : 28;
    
    // Calcular fecha probable de parto (FPP)
    // Regla de Naegele: FPP = FUR + 7 días - 3 meses + 1 año
    let dueDate = new Date(lastPeriod);
    dueDate.setDate(dueDate.getDate() + 7);
    dueDate.setMonth(dueDate.getMonth() - 3);
    dueDate.setFullYear(dueDate.getFullYear() + 1);
    
    // Ajustar por duración del ciclo
    const cycleAdjustment = cycleLength - 28;
    dueDate.setDate(dueDate.getDate() + cycleAdjustment);
    
    // Calcular semana actual de embarazo
    const today = new Date();
    const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(daysSinceLastPeriod / 7) + 1;
    const currentDay = (daysSinceLastPeriod % 7) + 1;
    
    // Calcular días restantes
    const daysLeft = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    
    // Determinar trimestre
    let trimester;
    if (currentWeek <= 13) {
        trimester = "Primer trimestre";
    } else if (currentWeek <= 27) {
        trimester = "Segundo trimestre";
    } else {
        trimester = "Tercer trimestre";
    }
    
    // Actualizar resultados en la UI
    updateCalculatorResults(dueDate, currentWeek, currentDay, daysLeft, trimester);
    
    // Actualizar banner principal
    updatePregnancyBanner(currentWeek, dueDate, daysLeft);
    
    // Actualizar seguimiento
    updatePregnancyTracker(currentWeek);
    
    showNotification('Fecha probable calculada correctamente', 'success');
}

function updateCalculatorResults(dueDate, week, day, daysLeft, trimester) {
    // Formatear fecha
    const dueDateStr = dueDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Actualizar elementos
    const elements = {
        resultDueDate: dueDateStr,
        resultCurrentWeek: `Semana ${week} (día ${day})`,
        resultTrimester: trimester,
        resultDaysLeft: `${daysLeft} días`
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
    
    // Actualizar barra de progreso
    const progressFill = document.getElementById('pregnancyProgress');
    if (progressFill) {
        const progressPercentage = Math.min((week / 40) * 100, 100);
        progressFill.style.width = `${progressPercentage}%`;
    }
}

function updatePregnancyBanner(week, dueDate, daysLeft) {
    const elements = {
        currentWeek: `Semana ${week}`,
        dueDate: dueDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        daysLeft: `${daysLeft} días`
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
}