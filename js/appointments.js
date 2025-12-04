// Gestor de citas médicas
function initAppointmentsTracker() {
    const appointmentForm = document.getElementById('appointmentForm');
    const clearAppointmentsBtn = document.getElementById('clearAppointments');
    const filterBtns = document.querySelectorAll('.appointments-filters .filter-btn');
    
    if (!appointmentForm) return;
    
    // Manejar envío del formulario
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addAppointment();
    });
    
    // Limpiar todas las citas
    if (clearAppointmentsBtn) {
        clearAppointmentsBtn.addEventListener('click', clearAllAppointments);
    }
    
    // Filtros de citas
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterAppointments(this.dataset.filter);
        });
    });
}

function addAppointment() {
    const typeInput = document.getElementById('appointmentType');
    const dateInput = document.getElementById('appointmentDate');
    const doctorInput = document.getElementById('appointmentDoctor');
    const locationInput = document.getElementById('appointmentLocation');
    const notesInput = document.getElementById('appointmentNotes');
    
    if (!typeInput.value) {
        showNotification('Por favor, selecciona el tipo de cita', 'error');
        typeInput.focus();
        return;
    }
    
    if (!dateInput.value) {
        showNotification('Por favor, ingresa la fecha y hora de la cita', 'error');
        dateInput.focus();
        return;
    }
    
    if (!doctorInput.value.trim()) {
        showNotification('Por favor, ingresa el nombre del médico', 'error');
        doctorInput.focus();
        return;
    }
    
    const appointment = {
        id: Date.now(),
        type: typeInput.value,
        date: dateInput.value,
        doctor: doctorInput.value.trim(),
        location: locationInput.value.trim(),
        notes: notesInput.value.trim(),
        createdAt: new Date().toISOString()
    };
    
    // Añadir a la lista en el DOM
    addAppointmentToDOM(appointment);
    
    // Guardar en localStorage
    saveAppointment(appointment);
    
    // Actualizar estadísticas
    updateAppointmentsStats();
    
    // Resetear formulario
    appointmentForm.reset();
    document.getElementById('appointmentDate').min = new Date().toISOString().slice(0, 16);
    
    showNotification('Cita agregada correctamente', 'success');
}

function addAppointmentToDOM(appointment) {
    const appointmentsList = document.getElementById('appointmentsList');
    if (!appointmentsList) return;
    
    // Eliminar estado vacío si existe
    const emptyState = appointmentsList.querySelector('.empty-state');
    if (emptyState) emptyState.remove();
    
    // Crear elemento de la cita
    const appointmentElement = document.createElement('div');
    appointmentElement.className = 'appointment-item';
    appointmentElement.dataset.id = appointment.id;
    
    // Formatear fecha y hora
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const isPast = appointmentDate < now;
    
    appointmentElement.dataset.status = isPast ? 'past' : 'upcoming';
    
    const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    const formattedTime = appointmentDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Nombres de tipos
    const typeNames = {
        'control': 'Control prenatal',
        'ecografia': 'Ecografía',
        'analisis': 'Análisis de laboratorio',
        'especialista': 'Especialista',
        'otro': 'Otro'
    };
    
    appointmentElement.innerHTML = `
        <div class="appointment-header">
            <span class="appointment-type">${typeNames[appointment.type] || appointment.type}</span>
            <span class="appointment-date">${formattedDate} - ${formattedTime}</span>
        </div>
        <div class="appointment-details">
            <p><strong>Médico:</strong> ${appointment.doctor}</p>
            <p><strong>Lugar:</strong> ${appointment.location}</p>
            ${appointment.notes ? `<p class="appointment-notes"><strong>Notas:</strong> ${appointment.notes}</p>` : ''}
        </div>
        <div class="item-actions">
            <button class="delete-btn" onclick="deleteAppointment(${appointment.id})">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `;
    
    // Añadir con animación
    appointmentElement.style.opacity = '0';
    appointmentElement.style.transform = 'translateY(20px)';
    appointmentsList.prepend(appointmentElement);
    
    // Animar entrada
    setTimeout(() => {
        appointmentElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        appointmentElement.style.opacity = '1';
        appointmentElement.style.transform = 'translateY(0)';
    }, 10);
}

function saveAppointment(appointment) {
    let appointments = JSON.parse(localStorage.getItem('primerLatidoAppointments') || '[]');
    appointments.unshift(appointment);
    localStorage.setItem('primerLatidoAppointments', JSON.stringify(appointments));
}

function deleteAppointment(id) {
    let appointments = JSON.parse(localStorage.getItem('primerLatidoAppointments') || '[]');
    appointments = appointments.filter(appointment => appointment.id !== id);
    localStorage.setItem('primerLatidoAppointments', JSON.stringify(appointments));
    
    // Eliminar del DOM
    const appointmentElement = document.querySelector(`.appointment-item[data-id="${id}"]`);
    if (appointmentElement) {
        appointmentElement.style.opacity = '0';
        appointmentElement.style.transform = 'translateX(100px)';
        
        setTimeout(() => {
            appointmentElement.remove();
            updateAppointmentsStats();
            
            // Mostrar estado vacío si no hay citas
            const appointmentsList = document.getElementById('appointmentsList');
            if (appointmentsList && appointmentsList.children.length === 0) {
                showEmptyAppointmentsState();
            }
        }, 300);
    }
    
    showNotification('Cita eliminada', 'info');
}

function clearAllAppointments() {
    if (confirm('¿Estás segura de que quieres eliminar todas las citas? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('primerLatidoAppointments');
        const appointmentsList = document.getElementById('appointmentsList');
        if (appointmentsList) {
            appointmentsList.innerHTML = '';
            showEmptyAppointmentsState();
        }
        updateAppointmentsStats();
        showNotification('Todas las citas han sido eliminadas', 'info');
    }
}

function showEmptyAppointmentsState() {
    const appointmentsList = document.getElementById('appointmentsList');
    if (appointmentsList) {
        appointmentsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>No hay citas programadas. ¡Agrega tu primera cita médica!</p>
            </div>
        `;
    }
}

function filterAppointments(filter) {
    const appointments = document.querySelectorAll('.appointment-item');
    const now = new Date();
    
    appointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.querySelector('.appointment-date').textContent.split(' - ')[0]);
        const isPast = appointmentDate < now;
        
        let shouldShow = false;
        
        if (filter === 'all') {
            shouldShow = true;
        } else if (filter === 'upcoming' && !isPast) {
            shouldShow = true;
        } else if (filter === 'past' && isPast) {
            shouldShow = true;
        }
        
        if (shouldShow) {
            appointment.style.display = 'block';
            setTimeout(() => {
                appointment.style.opacity = '1';
                appointment.style.transform = 'translateY(0)';
            }, 10);
        } else {
            appointment.style.opacity = '0';
            appointment.style.transform = 'translateY(20px)';
            setTimeout(() => {
                appointment.style.display = 'none';
            }, 300);
        }
    });
}

function updateAppointmentsStats() {
    const appointments = JSON.parse(localStorage.getItem('primerLatidoAppointments') || '[]');
    const upcomingAppointments = document.getElementById('upcomingAppointments');
    
    if (upcomingAppointments) {
        const now = new Date();
        const upcoming = appointments.filter(apt => new Date(apt.date) > now).length;
        upcomingAppointments.textContent = `${upcoming} ${upcoming === 1 ? 'cita próxima' : 'citas próximas'}`;
    }
}