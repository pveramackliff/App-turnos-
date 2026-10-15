/**
 * Componente UI para el Calendario Mensual Interactivo.
 * Cumple con el Principio III (Renderizado desacoplado de la lógica matemática)
 * y el Principio IV (100% en español, Lunes a Domingo).
 */

import {
  getMonthCalendarMatrix,
  SPANISH_WEEKDAYS_SHORT
} from '../domain/shiftEngine.js';

export class CalendarView {
  /**
   * @param {HTMLElement} container Contenedor donde renderizar el calendario
   * @param {object} options
   * @param {function(Date, object): void} options.onDayClick Callback al pulsar un día
   */
  constructor(container, options = {}) {
    this.container = container;
    this.onDayClick = options.onDayClick || (() => {});
    
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.selectedIso = null;
  }

  /**
   * Cambia el mes visible
   * @param {number} delta -1 para mes anterior, +1 para mes siguiente
   */
  navigate(delta) {
    this.currentMonth += delta;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    }
    this.render();
  }

  /**
   * Regresa la vista al mes y año actual
   */
  goToToday() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.render();
  }

  /**
   * Renderiza el componente completo del calendario
   */
  render() {
    if (!this.container) return;

    const matrix = getMonthCalendarMatrix(this.currentYear, this.currentMonth);

    // Cabecera de días de la semana
    const weekdaysHtml = SPANISH_WEEKDAYS_SHORT
      .map(name => `<div class="calendar-weekday-col">${name}</div>`)
      .join('');

    // Cuadrícula de días
    const daysHtml = matrix.days.map(dayCell => {
      const { date, dayNumber, isCurrentMonth, isToday, cycleInfo } = dayCell;
      const iso = cycleInfo.isoDate;
      const isSelected = this.selectedIso === iso;

      const classes = [
        'calendar-day-cell',
        isCurrentMonth ? 'current-month' : 'other-month',
        isToday ? 'is-today' : '',
        isSelected ? 'is-selected' : ''
      ].filter(Boolean).join(' ');

      const shiftCode = cycleInfo.shift.code;

      return `
        <button type="button" 
                class="${classes}" 
                data-iso="${iso}" 
                aria-label="${dayNumber} de ${matrix.monthTitle}, Turno ${cycleInfo.shift.name}">
          <span class="day-number-text">${dayNumber}</span>
          <span class="shift-cell-chip shift-${shiftCode}" aria-hidden="true">${shiftCode}</span>
        </button>
      `;
    }).join('');

    this.container.innerHTML = `
      <section class="ios-calendar-card" aria-label="Calendario mensual de turnos">
        <header class="calendar-header">
          <h2 class="calendar-month-title">${matrix.monthTitle}</h2>
          <div class="calendar-nav-buttons">
            <button type="button" class="calendar-nav-btn" id="cal-today-btn" aria-label="Ir a hoy" title="Ir a hoy">
              <i class="fa-solid fa-calendar-day"></i>
            </button>
            <button type="button" class="calendar-nav-btn" id="cal-prev-btn" aria-label="Mes anterior">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button type="button" class="calendar-nav-btn" id="cal-next-btn" aria-label="Mes siguiente">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </header>

        <div class="calendar-weekdays-row" aria-hidden="true">
          ${weekdaysHtml}
        </div>

        <div class="calendar-grid" role="grid" id="calendar-grid-cells">
          ${daysHtml}
        </div>

        <footer class="calendar-legend" aria-label="Leyenda de turnos">
          <div class="legend-item">
            <span class="legend-chip shift-cell-chip shift-M">M</span>
            <span>Mañana</span>
          </div>
          <div class="legend-item">
            <span class="legend-chip shift-cell-chip shift-T">T</span>
            <span>Tarde</span>
          </div>
          <div class="legend-item">
            <span class="legend-chip shift-cell-chip shift-N">N</span>
            <span>Noche</span>
          </div>
          <div class="legend-item">
            <span class="legend-chip shift-cell-chip shift-D">D</span>
            <span>Descanso</span>
          </div>
        </footer>
      </section>
    `;

    this.attachEventListeners(matrix);
  }

  /**
   * Conecta los eventos de navegación y selección de días
   * @private
   */
  attachEventListeners(matrix) {
    const todayBtn = this.container.querySelector('#cal-today-btn');
    const prevBtn = this.container.querySelector('#cal-prev-btn');
    const nextBtn = this.container.querySelector('#cal-next-btn');

    if (todayBtn) {
      todayBtn.addEventListener('click', () => this.goToToday());
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigate(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigate(1));
    }

    const grid = this.container.querySelector('#calendar-grid-cells');
    if (grid) {
      grid.addEventListener('click', (event) => {
        const cell = event.target.closest('.calendar-day-cell');
        if (!cell) return;

        const iso = cell.getAttribute('data-iso');
        if (!iso) return;

        this.selectedIso = iso;
        
        // Actualizar visualmente la selección sin re-renderizar todo
        grid.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('is-selected'));
        cell.classList.add('is-selected');

        const foundDay = matrix.days.find(d => d.cycleInfo.isoDate === iso);
        if (foundDay) {
          this.onDayClick(foundDay.date, foundDay.cycleInfo);
        }
      });
    }
  }
}
