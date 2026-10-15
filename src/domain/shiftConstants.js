/**
 * Definición inmutable de tipos de turno y del ciclo de 70 días (10 semanas).
 * Cumple con el Principio III de la Constitución: lógica de turnos pura desacoplada del DOM.
 */

export const ANCHOR_DATE = new Date(2026, 2, 9); // 9 de marzo de 2026 (Lunes, Día 1 del ciclo)
export const CYCLE_TOTAL_DAYS = 70;
export const CYCLE_TOTAL_WEEKS = 10;

export const SHIFT_TYPES = Object.freeze({
  MORNING: Object.freeze({
    id: 'morning',
    code: 'M',
    name: 'Mañana',
    startTime: '06:00',
    endTime: '14:00',
    startHour: 6,
    endHour: 14,
    isWork: true,
    crossesMidnight: false,
    colorVar: 'var(--color-shift-m)',
    bgVar: 'var(--bg-shift-m)',
    icon: 'fa-solid fa-sun'
  }),
  AFTERNOON: Object.freeze({
    id: 'afternoon',
    code: 'T',
    name: 'Tarde',
    startTime: '14:00',
    endTime: '22:00',
    startHour: 14,
    endHour: 22,
    isWork: true,
    crossesMidnight: false,
    colorVar: 'var(--color-shift-t)',
    bgVar: 'var(--bg-shift-t)',
    icon: 'fa-solid fa-cloud-sun'
  }),
  NIGHT: Object.freeze({
    id: 'night',
    code: 'N',
    name: 'Noche',
    startTime: '22:00',
    endTime: '06:00',
    startHour: 22,
    endHour: 6,
    isWork: true,
    crossesMidnight: true,
    colorVar: 'var(--color-shift-n)',
    bgVar: 'var(--bg-shift-n)',
    icon: 'fa-solid fa-moon'
  }),
  REST: Object.freeze({
    id: 'rest',
    code: 'D',
    name: 'Descanso',
    startTime: null,
    endTime: null,
    startHour: null,
    endHour: null,
    isWork: false,
    crossesMidnight: false,
    colorVar: 'var(--color-shift-d)',
    bgVar: 'var(--bg-shift-d)',
    icon: 'fa-solid fa-bed'
  })
});

/**
 * Array precalculado de 70 días representando la secuencia exacta del ciclo de 10 semanas (Lunes a Domingo).
 * 
 * Semana 1: 5 Tardes (L-V), 2 Descanso (S-D) [Días 0..6]
 * Semana 2: 7 Noches (L-D)                   [Días 7..13]
 * Semana 3: 7 Descanso (L-D)                 [Días 14..20]
 * Semana 4: 7 Mañanas (L-D)                  [Días 21..27]
 * Semana 5: 7 Descanso (L-D)                 [Días 28..34]
 * Semana 6: 5 Tardes (L-V), 2 Descanso (S-D) [Días 35..41]
 * Semana 7: 7 Noches (L-D)                   [Días 42..48]
 * Semana 8: 7 Descanso (L-D)                 [Días 49..55]
 * Semana 9: 5 Mañanas (L-V), 2 Descanso (S-D)[Días 56..62]
 * Semana 10: 7 Descanso (L-D)                [Días 63..69]
 */
export const CYCLE_SCHEDULE = Object.freeze([
  // Semana 1: 5 T, 2 D
  SHIFT_TYPES.AFTERNOON, SHIFT_TYPES.AFTERNOON, SHIFT_TYPES.AFTERNOON, SHIFT_TYPES.AFTERNOON, SHIFT_TYPES.AFTERNOON,
  SHIFT_TYPES.REST, SHIFT_TYPES.REST,

  // Semana 2: 7 N
  SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT,

  // Semana 3: 7 D
  SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST,

  // Semana 4: 7 M
  SHIFT_TYPES.MORNING, SHIFT_TYPES.MORNING, SHIFT_TYPES.MORNING, SHIFT_TYPES.MORNING, SHIFT_TYPES.MORNING, SHIFT_TYPES.MORNING, SHIFT_TYPES.MORNING,

  // Semana 5: 7 D
  SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST,

  // Semana 6: 5 T, 2 D
  SHIFT_TYPES.AFTERNOON, SHIFT_TYPES.AFTERNOON, SHIFT_TYPES.AFTERNOON, SHIFT_TYPES.AFTERNOON, SHIFT_TYPES.AFTERNOON,
  SHIFT_TYPES.REST, SHIFT_TYPES.REST,

  // Semana 7: 7 N
  SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT, SHIFT_TYPES.NIGHT,

  // Semana 8: 7 D
  SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST,

  // Semana 9: 5 M, 2 D
  SHIFT_TYPES.MORNING, SHIFT_TYPES.MORNING, SHIFT_TYPES.MORNING, SHIFT_TYPES.MORNING, SHIFT_TYPES.MORNING,
  SHIFT_TYPES.REST, SHIFT_TYPES.REST,

  // Semana 10: 7 D
  SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST, SHIFT_TYPES.REST
]);
