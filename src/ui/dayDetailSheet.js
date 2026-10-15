/**
 * Componente Bottom Sheet para inspeccionar el detalle de cualquier día del calendario.
 * Cumple con el Principio II (Modal iOS fluido con desenfoque) y el Principio IV (100% en español).
 */

import { SPANISH_WEEKDAYS } from '../domain/shiftEngine.js';

export class DayDetailSheet {
  /**
   * @param {HTMLElement} container Contenedor en el DOM
   */
  constructor(container) {
    this.container = container;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="ios-modal-backdrop" id="modal-backdrop" aria-hidden="true">
        <div class="ios-bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
          <div class="sheet-grabber-bar" aria-hidden="true"></div>
          
          <header class="sheet-header">
            <div>
              <h3 class="sheet-title" id="sheet-title">Detalle del Día</h3>
              <p class="sheet-subtitle" id="sheet-subtitle">Información del turno</p>
            </div>
            <button type="button" class="sheet-close-btn" id="sheet-close-btn" aria-label="Cerrar detalle">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>

          <div id="sheet-body-content"></div>
        </div>
      </div>
    `;

    this.backdrop = this.container.querySelector('#modal-backdrop');
    this.closeBtn = this.container.querySelector('#sheet-close-btn');
    this.bodyContent = this.container.querySelector('#sheet-body-content');

    // Cerrar al pulsar el botón de cerrar
    this.closeBtn.addEventListener('click', () => this.close());

    // Cerrar al pulsar fuera del panel (en el fondo translúcido)
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });

    // Cerrar con tecla Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * Abre el modal y muestra los detalles del día seleccionado
   * @param {Date} date
   * @param {object} cycleInfo
   */
  open(date, cycleInfo) {
    const { weekNumber, dayIndex, dayOfWeek, shift } = cycleInfo;
    const dayName = SPANISH_WEEKDAYS[dayOfWeek];

    const fullDateText = new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);

    const titleEl = this.container.querySelector('#sheet-title');
    const subtitleEl = this.container.querySelector('#sheet-subtitle');

    if (titleEl) titleEl.textContent = `${dayName}, ${date.getDate()} de ${new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date)}`;
    if (subtitleEl) subtitleEl.textContent = fullDateText;

    if (shift.isWork) {
      this.bodyContent.innerHTML = `
        <div class="widget-body-row" style="margin: 6px 0 14px 0;">
          <div class="widget-shift-icon-box" style="background: ${shift.colorVar}">
            <i class="${shift.icon}"></i>
          </div>
          <div class="widget-shift-details">
            <span class="widget-shift-label">Turno</span>
            <h4 class="widget-shift-title">${shift.name}</h4>
            <span class="widget-shift-hours">
              <i class="fa-regular fa-clock"></i> ${shift.hoursDisplay}
            </span>
          </div>
        </div>

        <div class="sheet-info-grid">
          <div class="sheet-info-card commute-card">
            <div class="commute-card-header">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              <span class="sheet-info-label">Sale de casa</span>
            </div>
            <span class="sheet-info-value commute-time">${shift.leaveHome}</span>
          </div>

          <div class="sheet-info-card commute-card">
            <div class="commute-card-header">
              <i class="fa-solid fa-house"></i>
              <span class="sheet-info-label">Vuelve a casa</span>
            </div>
            <span class="sheet-info-value commute-time">${shift.returnHome}</span>
          </div>
        </div>
      `;
    } else {
      this.bodyContent.innerHTML = `
        <div class="sheet-rest-simple-box">
          <div class="widget-shift-icon-box" style="background: ${shift.colorVar}">
            <i class="${shift.icon}"></i>
          </div>
          <div class="widget-shift-details">
            <h4 class="widget-shift-title">Día de descanso</h4>
          </div>
        </div>
      `;
    }

    this.backdrop.classList.add('is-open');
    this.backdrop.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
  }

  /**
   * Cierra el modal
   */
  close() {
    this.backdrop.classList.remove('is-open');
    this.backdrop.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
  }
}
