/**
 * Componente UI para el indicador en tiempo real "Está en el trabajo" / "Fuera de turno".
 * Proporciona actualización en vivo sin parpadeos ni reflows completos.
 */

/**
 * Actualiza el distintivo en vivo en un contenedor dado
 * @param {HTMLElement} element Contenedor del pill
 * @param {object} workStatus Estado generado por evaluateLiveWorkStatus
 */
export function updateLiveIndicator(element, workStatus) {
  if (!element) return;

  const isAtWork = workStatus && workStatus.isAtWork;
  const text = isAtWork ? 'Está en el trabajo' : 'Fuera de turno';
  const targetClass = isAtWork ? 'at-work' : 'off-work';

  element.className = `live-status-pill ${targetClass}`;
  element.setAttribute('aria-label', `Estado actual: ${text}`);

  element.innerHTML = `
    <span class="live-pulse-dot" aria-hidden="true"></span>
    <span>${text}</span>
  `;
}
