// Gestor de síntomas
function initSymptomsTracker() {
    const symptomForm = document.getElementById('symptomForm');
    const intensityOptions = document.querySelectorAll('.intensity-option');
    const clearSymptomsBtn = document.getElementById('clearSymptoms');
    const filterBtns = document.querySelectorAll('.symptoms-filters .filter-btn');
    
    if (!symptomForm) return;
    
    // Configurar selector de intensidad
    intensityOptions.forEach(option => {
        option.addEventListener('click', function() {
            intensityOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('symptomIntensity').value = this.dataset.value;
        });
    });
    
    // Manejar envío del formulario
    symptomForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addSymptom();
    });
    
    // Limpiar todos los síntomas
    if (clearSymptomsBtn) {
        clearSymptomsBtn.addEventListener('click', clearAllSymptoms);
    }
    
    // Filtros de síntomas
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterSymptoms(this.dataset.filter);
        });
    });
}

function addSymptom() {
    const nameInput = document.getElementById('symptomName');
    const intensityInput = document.getElementById('symptomIntensity');
    const dateInput = document.getElementById('symptomDate');
    const notesInput = document.getElementById('symptomNotes');
    
    if (!nameInput.value.trim()) {
        showNotification('Por favor, ingresa un nombre para el síntoma', 'error');
        nameInput.focus();
        return;
    }
    
    const symptom = {
        id: Date.now(),
        name: nameInput.value.trim(),
        intensity: parseInt(intensityInput.value),
        date: dateInput.value,
        notes: notesInput.value.trim(),
        createdAt: new Date().toISOString()
    };
    
    // Añadir a la lista en el DOM
    addSymptomToDOM(symptom);
    
    // Guardar en localStorage
    saveSymptom(symptom);
    
    // Actualizar estadísticas
    updateSymptomsStats();
    
    // Resetear formulario
    nameInput.value = '';
    notesInput.value = '';
    nameInput.focus();
    
    showNotification('Síntoma agregado correctamente', 'success');
}

function addSymptomToDOM(symptom) {
    const symptomsList = document.getElementById('symptomsList');
    if (!symptomsList) return;
    
    // Eliminar estado vacío si existe
    const emptyState = symptomsList.querySelector('.empty-state');
    if (emptyState) emptyState.remove();
    
    // Crear elemento del síntoma
    const symptomElement = document.createElement('div');
    symptomElement.className = `symptom-item intensity-${symptom.intensity}`;
    symptomElement.dataset.id = symptom.id;
    symptomElement.dataset.intensity = symptom.intensity;
    
    // Formatear fecha
    const symptomDate = new Date(symptom.date);
    const formattedDate = symptomDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    // Nombres de intensidad
    const intensityNames = {
        1: 'Leve',
        2: 'Moderado',
        3: 'Fuerte'
    };
    
    symptomElement.innerHTML = `
        <div class="symptom-header">
            <span class="symptom-name">${symptom.name}</span>
            <span class="symptom-date">${formattedDate}</span>
        </div>
        <div class="symptom-details">
            <span class="symptom-intensity">${intensityNames[symptom.intensity]}</span>
            ${symptom.notes ? `<p class="symptom-notes">${symptom.notes}</p>` : ''}
        </div>
        <div class="item-actions">
            <button class="delete-btn" onclick="deleteSymptom(${symptom.id})">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `;
    
    // Añadir con animación
    symptomElement.style.opacity = '0';
    symptomElement.style.transform = 'translateY(20px)';
    symptomsList.prepend(symptomElement);
    
    // Animar entrada
    setTimeout(() => {
        symptomElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        symptomElement.style.opacity = '1';
        symptomElement.style.transform = 'translateY(0)';
    }, 10);
}

function saveSymptom(symptom) {
    let symptoms = JSON.parse(localStorage.getItem('primerLatidoSymptoms') || '[]');
    symptoms.unshift(symptom);
    localStorage.setItem('primerLatidoSymptoms', JSON.stringify(symptoms));
}

function deleteSymptom(id) {
    let symptoms = JSON.parse(localStorage.getItem('primerLatidoSymptoms') || '[]');
    symptoms = symptoms.filter(symptom => symptom.id !== id);
    localStorage.setItem('primerLatidoSymptoms', JSON.stringify(symptoms));
    
    // Eliminar del DOM
    const symptomElement = document.querySelector(`.symptom-item[data-id="${id}"]`);
    if (symptomElement) {
        symptomElement.style.opacity = '0';
        symptomElement.style.transform = 'translateX(100px)';
        
        setTimeout(() => {
            symptomElement.remove();
            updateSymptomsStats();
            
            // Mostrar estado vacío si no hay síntomas
            const symptomsList = document.getElementById('symptomsList');
            if (symptomsList && symptomsList.children.length === 0) {
                showEmptySymptomsState();
            }
        }, 300);
    }
    
    showNotification('Síntoma eliminado', 'info');
}

function clearAllSymptoms() {
    if (confirm('¿Estás segura de que quieres eliminar todos los síntomas? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('primerLatidoSymptoms');
        const symptomsList = document.getElementById('symptomsList');
        if (symptomsList) {
            symptomsList.innerHTML = '';
            showEmptySymptomsState();
        }
        updateSymptomsStats();
        showNotification('Todos los síntomas han sido eliminados', 'info');
    }
}

function showEmptySymptomsState() {
    const symptomsList = document.getElementById('symptomsList');
    if (symptomsList) {
        symptomsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heartbeat"></i>
                <p>No hay síntomas registrados aún. ¡Agrega tu primer síntoma!</p>
            </div>
        `;
    }
}

function filterSymptoms(filter) {
    const symptoms = document.querySelectorAll('.symptom-item');
    
    symptoms.forEach(symptom => {
        if (filter === 'all' || symptom.dataset.intensity === filter) {
            symptom.style.display = 'block';
            setTimeout(() => {
                symptom.style.opacity = '1';
                symptom.style.transform = 'translateY(0)';
            }, 10);
        } else {
            symptom.style.opacity = '0';
            symptom.style.transform = 'translateY(20px)';
            setTimeout(() => {
                symptom.style.display = 'none';
            }, 300);
        }
    });
}

function updateSymptomsStats() {
    const symptoms = JSON.parse(localStorage.getItem('primerLatidoSymptoms') || '[]');
    const totalSymptoms = document.getElementById('totalSymptoms');
    
    if (totalSymptoms) {
        totalSymptoms.textContent = `${symptoms.length} ${symptoms.length === 1 ? 'síntoma' : 'síntomas'}`;
    }
}