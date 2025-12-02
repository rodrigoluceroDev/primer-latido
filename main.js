
// main.js: maneja la calculadora, registro de síntomas y agenda de citas
document.addEventListener('DOMContentLoaded', () => {
    // Calculadora de fecha probable de parto
    const calcForm = document.getElementById('calcForm');
    const resultadoParto = document.getElementById('resultadoParto');
    if (calcForm && resultadoParto) {
        calcForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fechaVal = document.getElementById('fechaUltima').value;
            if (!fechaVal) {
                resultadoParto.textContent = 'Por favor ingresa una fecha válida.';
                return;
            }
            const fechaUltima = new Date(fechaVal);
            if (isNaN(fechaUltima.getTime())) {
                resultadoParto.textContent = 'Fecha inválida.';
                return;
            }
            const fechaParto = new Date(fechaUltima);
            fechaParto.setDate(fechaParto.getDate() + 280);
            resultadoParto.textContent = `Fecha probable de parto: ${fechaParto.toLocaleDateString()}`;
        });
    }

    // Registro de síntomas
    const tablaSintomas = document.getElementById('tablaSintomas');
    const sintomasForm = document.getElementById('sintomasForm');
    if (sintomasForm && tablaSintomas) {
        sintomasForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const sintomaInput = document.getElementById('sintoma');
            const estadoInput = document.getElementById('estadoAnimo');
            const sintoma = sintomaInput.value.trim();
            const estado = estadoInput.value;
            if (!sintoma) return;
            const fila = document.createElement('tr');
            fila.innerHTML = `<td>${escapeHtml(sintoma)}</td><td>${escapeHtml(estado)}</td><td><button class="eliminar">Eliminar</button></td>`;
            tablaSintomas.appendChild(fila);
            this.reset();
        });

        tablaSintomas.addEventListener('click', function(e) {
            if (e.target.classList.contains('eliminar')) {
                e.target.closest('tr').remove();
            }
        });
    }

    // Agenda de citas
    const tablaCitas = document.getElementById('tablaCitas');
    const citasForm = document.getElementById('citasForm');
    if (citasForm && tablaCitas) {
        citasForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fecha = document.getElementById('fechaCita').value;
            const hora = document.getElementById('horaCita').value;
            const tipo = document.getElementById('tipoCita').value.trim();
            if (!fecha || !hora || !tipo) return;
            const fila = document.createElement('tr');
            fila.innerHTML = `<td>${escapeHtml(fecha)}</td><td>${escapeHtml(hora)}</td><td>${escapeHtml(tipo)}</td><td><button class="eliminar">Eliminar</button></td>`;
            tablaCitas.appendChild(fila);
            this.reset();
        });

        tablaCitas.addEventListener('click', function(e) {
            if (e.target.classList.contains('eliminar')) {
                e.target.closest('tr').remove();
            }
        });
    }

    // Util: evitar inyección simple al añadir texto al DOM
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
    }
});
