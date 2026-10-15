/**
 * Punto de Entrada Principal de Kanki App.
 * Orquesta la lógica del ciclo de turnos, renderizado de widgets, calendario y PWA.
 */

import {
  getShiftForDate,
  evaluateLiveWorkStatus,
  SPANISH_WEEKDAYS
} from './domain/shiftEngine.js';
import { renderStatusCard } from './ui/statusCard.js';
import { updateLiveIndicator } from './ui/liveIndicator.js';
import { CalendarView } from './ui/calendarView.js';
import { DayDetailSheet } from './ui/dayDetailSheet.js';
import { storageService } from './services/storageService.js';

document.addEventListener('DOMContentLoaded', () => {
  // 0. Control de Tema (Modo Claro / Modo Oscuro) con Persistencia
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const userSettings = storageService.getUserSettings();

  function getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
      themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]:not([media])') || document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#000000' : '#F2F2F7');
    }
  }

  let currentTheme = userSettings.themeMode && userSettings.themeMode !== 'system'
    ? userSettings.themeMode 
    : getSystemPreference();

  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
      storageService.saveUserSettings({ themeMode: currentTheme });
    });
  }

  // 1. Elementos del DOM
  const statusContainer = document.getElementById('status-card-container');
  const calendarContainer = document.getElementById('calendar-section');
  const detailContainer = document.getElementById('day-detail-container');

  // 2. Instanciar Bottom Sheet Modal para detalle de día
  const dayDetailSheet = new DayDetailSheet(detailContainer);

  // 3. Instanciar Vista del Calendario
  const calendarView = new CalendarView(calendarContainer, {
    onDayClick: (date, cycleInfo) => {
      dayDetailSheet.open(date, cycleInfo);
    }
  });

  // 4. Función de actualización del estado de hoy
  function updateTodayView() {
    const now = new Date();
    const cycleInfo = getShiftForDate(now);
    const workStatus = evaluateLiveWorkStatus(now);

    // Renderizar tarjeta de hoy
    renderStatusCard(statusContainer, cycleInfo, workStatus);
  }

  // Render inicial
  updateTodayView();
  calendarView.render();

  // 6. Temporizador periódico para actualización en tiempo real (cada 60 segundos)
  // Cumple con el criterio FR-008
  setInterval(() => {
    updateTodayView();
  }, 60 * 1000);

  // 7. Registro del Service Worker para compatibilidad PWA y Offline (Solo en producción)
  if ('serviceWorker' in navigator) {
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
    } else if (window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => {
            console.log('Kanki Service Worker registrado correctamente:', reg.scope);
          })
          .catch((err) => {
            console.warn('Registro de Service Worker omitido o no compatible en este entorno:', err);
          });
      });
    }
  }
});
