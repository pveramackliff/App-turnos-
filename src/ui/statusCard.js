/**
 * Componente UI para la Tarjeta de Estado Actual (Widget Hoy).
 * Cumple con el Principio III (Renderizado desacoplado) y Principio IV (100% en español).
 */

import { SPANISH_WEEKDAYS } from '../domain/shiftEngine.js';

/**
 * Renderiza la tarjeta principal de estado del día
 * @param {HTMLElement} container Contenedor donde renderizar
 * @param {object} cycleInfo Información del turno del día (CycleDayInfo)
 * @param {object} workStatus Estado en tiempo real (WorkStatus)
 */
export function renderStatusCard(container, cycleInfo, workStatus) {
  if (!container) return;

  const { date, weekNumber, dayIndex, dayOfWeek, shift } = cycleInfo;
  const dayName = SPANISH_WEEKDAYS[dayOfWeek];

  const fullDateText = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long'
  }).format(date);

  const hoursText = shift.isWork 
    ? shift.hoursDisplay 
    : 'Día de descanso';

  const isAtWork = workStatus && workStatus.isAtWork;
  const statusBadgeText = isAtWork ? 'Está en el trabajo' : 'Fuera de turno';
  const statusClass = isAtWork ? 'at-work' : 'off-work';
  const remainingText = (workStatus && workStatus.remainingText) ? workStatus.remainingText : '';

  // Asignar variable CSS de color de acento del turno para el widget
  container.innerHTML = `
    <article class="ios-widget-card" style="--widget-accent-color: ${shift.colorVar}">
      <div class="widget-header-row">
        <div class="widget-date-group">
          <span class="widget-day-name">${dayName}</span>
          <span class="widget-full-date">${fullDateText}</span>
        </div>
      </div>

      <div class="widget-body-row">
        <div class="widget-shift-icon-box" aria-hidden="true">
          <i class="${shift.icon}"></i>
        </div>
        <div class="widget-shift-details">
          <span class="widget-shift-label">Turno de Hoy</span>
          <h2 class="widget-shift-title">${shift.name}</h2>
          <span class="widget-shift-hours">
            <i class="${shift.isWork ? 'fa-regular fa-clock' : 'fa-solid fa-bed'}"></i> ${hoursText}
          </span>
        </div>
      </div>

      <div class="widget-footer-row">
        <div class="live-status-pill ${statusClass}" role="status">
          <span class="live-pulse-dot" aria-hidden="true"></span>
          <span>${statusBadgeText}</span>
        </div>
        ${remainingText ? `<span class="widget-remaining-time">${remainingText}</span>` : ''}
      </div>
    </article>
  `;
}
