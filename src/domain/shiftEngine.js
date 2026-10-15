/**
 * Motor de Cálculo de Turnos y Evaluación en Tiempo Real.
 * Cumple con el Principio III (Separación Estricta de Lógica de Turnos y UI)
 * y el Principio IV (Localización Estricta en Español).
 */

import {
  ANCHOR_DATE,
  CYCLE_TOTAL_DAYS,
  CYCLE_SCHEDULE,
  SHIFT_TYPES
} from './shiftConstants.js';

/**
 * Normaliza un objeto Date a las 00:00:00.000 en hora local
 * @param {Date} date
 * @returns {Date}
 */
export function normalizeToMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Formatea una fecha como cadena ISO corta AAAA-MM-DD
 * @param {Date} date
 * @returns {string}
 */
export function formatIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calcula el índice de día dentro del ciclo de 70 días (0 a 69) para cualquier fecha
 * Aplica módulo seguro para fechas anteriores al día ancla (9 de marzo de 2026).
 * @param {Date} date
 * @returns {number}
 */
export function getCycleDayIndex(date) {
  const targetMidnight = normalizeToMidnight(date);
  const anchorMidnight = normalizeToMidnight(ANCHOR_DATE);
  
  const diffMs = targetMidnight.getTime() - anchorMidnight.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  
  return ((diffDays % CYCLE_TOTAL_DAYS) + CYCLE_TOTAL_DAYS) % CYCLE_TOTAL_DAYS;
}

/**
 * Obtiene la información completa del turno para una fecha calendario
 * Incluye turnos de 12h para fines de semana (Noche: 18:00-06:00, Mañana: 06:00-18:00)
 * y horas de salida y retorno al hogar.
 * @param {Date} date
 * @returns {object} CycleDayInfo
 */
export function getShiftForDate(date) {
  const targetMidnight = normalizeToMidnight(date);
  const dayIndex = getCycleDayIndex(targetMidnight);
  const baseShift = CYCLE_SCHEDULE[dayIndex];
  const weekNumber = Math.floor(dayIndex / 7) + 1;
  const dayOfWeek = (targetMidnight.getDay() + 6) % 7; // 0 = Lunes, 6 = Domingo
  const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6); // Sábado (5) o Domingo (6)

  let startTime = baseShift.startTime;
  let endTime = baseShift.endTime;
  let startHour = baseShift.startHour;
  let endHour = baseShift.endHour;
  let is12h = false;
  let leaveHome = null;
  let returnHome = null;
  let hoursDisplay = 'Día de descanso';

  if (baseShift.code === 'M') {
    if (isWeekend) {
      startTime = '06:00';
      endTime = '18:00';
      startHour = 6;
      endHour = 18;
      is12h = true;
      leaveHome = '05:00';
      returnHome = '18:40';
      hoursDisplay = '06:00 - 18:00 (12h)';
    } else {
      startTime = '06:00';
      endTime = '14:00';
      startHour = 6;
      endHour = 14;
      is12h = false;
      leaveHome = '05:00';
      returnHome = '14:40';
      hoursDisplay = '06:00 - 14:00';
    }
  } else if (baseShift.code === 'T') {
    startTime = '14:00';
    endTime = '22:00';
    startHour = 14;
    endHour = 22;
    is12h = false;
    leaveHome = '13:00';
    returnHome = '22:40';
    hoursDisplay = '14:00 - 22:00';
  } else if (baseShift.code === 'N') {
    if (isWeekend) {
      startTime = '18:00';
      endTime = '06:00';
      startHour = 18;
      endHour = 6;
      is12h = true;
      leaveHome = '17:00';
      returnHome = '06:40';
      hoursDisplay = '18:00 - 06:00 (12h)';
    } else {
      startTime = '22:00';
      endTime = '06:00';
      startHour = 22;
      endHour = 6;
      is12h = false;
      leaveHome = '21:00';
      returnHome = '06:40';
      hoursDisplay = '22:00 - 06:00';
    }
  }

  const shift = {
    ...baseShift,
    startTime,
    endTime,
    startHour,
    endHour,
    is12h,
    isWeekend,
    leaveHome,
    returnHome,
    hoursDisplay
  };

  return {
    date: targetMidnight,
    isoDate: formatIsoDate(targetMidnight),
    dayIndex,
    weekNumber,
    dayOfWeek,
    isWeekend,
    shift
  };
}

/**
 * Evalúa si en un instante específico el trabajador está dentro o fuera de jornada laboral.
 * Soporta de forma determinista el cruce de medianoche y los turnos de 12h de fines de semana.
 * @param {Date} [now=new Date()]
 * @returns {object} WorkStatus
 */
export function evaluateLiveWorkStatus(now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayInfo = getShiftForDate(now);
  const todayShift = todayInfo.shift;

  // Caso 1: Madrugada entre 00:00 y 05:59:59 -> comprobar turno nocturno iniciado ayer
  if (currentMinutes < 6 * 60) {
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayInfo = getShiftForDate(yesterday);
    if (yesterdayInfo.shift.code === 'N') {
      const minutesLeft = 6 * 60 - currentMinutes;
      const hoursLeft = Math.floor(minutesLeft / 60);
      const minsRemainder = minutesLeft % 60;
      return {
        isAtWork: true,
        statusBadge: 'Está en el trabajo',
        activeShift: yesterdayInfo.shift,
        contextDescription: 'Turno de Noche (finaliza a las 06:00)',
        remainingText: `Quedan ${hoursLeft}h ${minsRemainder}min`,
        shiftDate: yesterdayInfo.date,
        checkedAt: now
      };
    }
  }

  // Caso 2: Noche iniciado hoy:
  // Si fin de semana: empieza a las 18:00 (18:00 a 23:59:59)
  // Si entre semana: empieza a las 22:00 (22:00 a 23:59:59)
  if (todayShift.code === 'N') {
    const startMinutes = (todayShift.is12h ? 18 : 22) * 60;
    if (currentMinutes >= startMinutes) {
      const minutesElapsed = currentMinutes - startMinutes;
      return {
        isAtWork: true,
        statusBadge: 'Está en el trabajo',
        activeShift: todayShift,
        contextDescription: todayShift.is12h 
          ? 'Turno de Noche 12h (finaliza a las 06:00)' 
          : 'Turno de Noche (finaliza a las 06:00 de mañana)',
        remainingText: `Lleva ${Math.floor(minutesElapsed / 60)}h ${minutesElapsed % 60}min`,
        shiftDate: todayInfo.date,
        checkedAt: now
      };
    }
  }

  // Caso 3: Mañana:
  // Si fin de semana: 06:00 a 18:00
  // Si entre semana: 06:00 a 14:00
  if (todayShift.code === 'M') {
    const endMinutes = (todayShift.is12h ? 18 : 14) * 60;
    if (currentMinutes >= 6 * 60 && currentMinutes < endMinutes) {
      const minutesLeft = endMinutes - currentMinutes;
      return {
        isAtWork: true,
        statusBadge: 'Está en el trabajo',
        activeShift: todayShift,
        contextDescription: todayShift.is12h 
          ? 'Turno de Mañana 12h (06:00 - 18:00)' 
          : 'Turno de Mañana (06:00 - 14:00)',
        remainingText: `Quedan ${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}min`,
        shiftDate: todayInfo.date,
        checkedAt: now
      };
    }
  }

  // Caso 4: Tarde (14:00 a 21:59:59)
  if (todayShift.code === 'T' && currentMinutes >= 14 * 60 && currentMinutes < 22 * 60) {
    const minutesLeft = 22 * 60 - currentMinutes;
    return {
      isAtWork: true,
      statusBadge: 'Está en el trabajo',
      activeShift: todayShift,
      contextDescription: 'Turno de Tarde (14:00 - 22:00)',
      remainingText: `Quedan ${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}min`,
      shiftDate: todayInfo.date,
      checkedAt: now
    };
  }

  // Fuera de jornada
  return {
    isAtWork: false,
    statusBadge: 'Fuera de turno',
    activeShift: todayShift,
    contextDescription: todayShift.code === 'D' ? 'Día de Descanso' : 'Fuera de horario laboral',
    remainingText: null,
    shiftDate: todayInfo.date,
    checkedAt: now
  };
}

/**
 * Nombres oficiales de los días de la semana en español (Lunes a Domingo)
 */
export const SPANISH_WEEKDAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const SPANISH_WEEKDAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/**
 * Genera la matriz de días para el calendario mensual con alineación estricta de Lunes a Domingo.
 * @param {number} year
 * @param {number} monthIndex 0 = Enero, 11 = Diciembre
 * @returns {object} CalendarMonthView
 */
export function getMonthCalendarMatrix(year, monthIndex) {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const todayIso = formatIsoDate(new Date());

  // Día de la semana del primer día (0 = Lunes, 6 = Domingo)
  const firstDayDow = (firstOfMonth.getDay() + 6) % 7;

  const days = [];

  // Días del mes previo de relleno
  if (firstDayDow > 0) {
    const prevMonthTotalDays = new Date(year, monthIndex, 0).getDate();
    for (let i = firstDayDow - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const prevDate = new Date(year, monthIndex - 1, dayNum);
      days.push({
        date: prevDate,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: formatIsoDate(prevDate) === todayIso,
        cycleInfo: getShiftForDate(prevDate)
      });
    }
  }

  // Días del mes actual
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const curDate = new Date(year, monthIndex, d);
    days.push({
      date: curDate,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: formatIsoDate(curDate) === todayIso,
      cycleInfo: getShiftForDate(curDate)
    });
  }

  // Días del mes siguiente para completar la cuadrícula de 7 columnas
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    const nextDate = new Date(year, monthIndex + 1, n);
    days.push({
      date: nextDate,
      dayNumber: n,
      isCurrentMonth: false,
      isToday: formatIsoDate(nextDate) === todayIso,
      cycleInfo: getShiftForDate(nextDate)
    });
  }

  // Agrupar en semanas
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Título del mes en español con primera letra en mayúscula
  const rawTitle = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(firstOfMonth);
  const monthTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  return {
    year,
    monthIndex,
    monthTitle,
    weeks,
    days
  };
}
