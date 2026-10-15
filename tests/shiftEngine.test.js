import { describe, it, expect } from 'vitest';
import {
  getCycleDayIndex,
  getShiftForDate,
  evaluateLiveWorkStatus,
  getMonthCalendarMatrix
} from '../src/domain/shiftEngine.js';
import { SHIFT_TYPES } from '../src/domain/shiftConstants.js';

describe('Motor de Cálculo de Turnos (Shift Engine)', () => {
  it('identifica correctamente el Día 1 del ciclo en la fecha ancla (9 de marzo de 2026)', () => {
    const anchor = new Date(2026, 2, 9); // 9 de marzo de 2026
    const dayIndex = getCycleDayIndex(anchor);
    const info = getShiftForDate(anchor);

    expect(dayIndex).toBe(0);
    expect(info.weekNumber).toBe(1);
    expect(info.dayOfWeek).toBe(0); // Lunes
    expect(info.shift.code).toBe('T');
    expect(info.shift.name).toBe('Tarde');
    expect(info.shift.startTime).toBe('14:00');
    expect(info.shift.endTime).toBe('22:00');
  });

  it('verifica la Semana 1 completa: 5 Tardes (L-V) y 2 Descanso (S-D)', () => {
    // Lunes 9 a Viernes 13: Tardes
    for (let day = 9; day <= 13; day++) {
      const date = new Date(2026, 2, day);
      const info = getShiftForDate(date);
      expect(info.weekNumber).toBe(1);
      expect(info.shift.code).toBe('T');
    }

    // Sábado 14 y Domingo 15: Descanso
    const sat = getShiftForDate(new Date(2026, 2, 14));
    const sun = getShiftForDate(new Date(2026, 2, 15));
    expect(sat.shift.code).toBe('D');
    expect(sun.shift.code).toBe('D');
  });

  it('verifica la Semana 2: 7 Noches (L-V de 22:00 a 06:00, S-D de 18:00 a 06:00 de 12h)', () => {
    // 16 a 20 de marzo de 2026 (Lunes a Viernes)
    for (let day = 16; day <= 20; day++) {
      const date = new Date(2026, 2, day);
      const info = getShiftForDate(date);
      expect(info.weekNumber).toBe(2);
      expect(info.shift.code).toBe('N');
      expect(info.shift.startTime).toBe('22:00');
      expect(info.shift.endTime).toBe('06:00');
      expect(info.shift.leaveHome).toBe('21:00');
      expect(info.shift.returnHome).toBe('06:40');
      expect(info.shift.is12h).toBe(false);
    }

    // 21 y 22 de marzo (Sábado y Domingo): Turno de 12h de 18:00 a 06:00
    for (let day = 21; day <= 22; day++) {
      const date = new Date(2026, 2, day);
      const info = getShiftForDate(date);
      expect(info.weekNumber).toBe(2);
      expect(info.shift.code).toBe('N');
      expect(info.shift.startTime).toBe('18:00');
      expect(info.shift.endTime).toBe('06:00');
      expect(info.shift.leaveHome).toBe('17:00');
      expect(info.shift.returnHome).toBe('06:40');
      expect(info.shift.is12h).toBe(true);
    }
  });

  it('verifica la Semana 3: 7 días de Descanso', () => {
    // 23 a 29 de marzo de 2026
    for (let day = 23; day <= 29; day++) {
      const date = new Date(2026, 2, day);
      const info = getShiftForDate(date);
      expect(info.weekNumber).toBe(3);
      expect(info.shift.code).toBe('D');
      expect(info.shift.leaveHome).toBeNull();
      expect(info.shift.returnHome).toBeNull();
    }
  });

  it('verifica la Semana 4: 7 Mañanas (L-V de 06:00 a 14:00, S-D de 06:00 a 18:00 de 12h)', () => {
    // 30 de marzo a 3 de abril (Lunes a Viernes)
    for (let d = 0; d < 5; d++) {
      const date = new Date(2026, 2, 30 + d);
      const info = getShiftForDate(date);
      expect(info.weekNumber).toBe(4);
      expect(info.shift.code).toBe('M');
      expect(info.shift.startTime).toBe('06:00');
      expect(info.shift.endTime).toBe('14:00');
      expect(info.shift.leaveHome).toBe('05:00');
      expect(info.shift.returnHome).toBe('14:40');
      expect(info.shift.is12h).toBe(false);
    }

    // 4 y 5 de abril (Sábado y Domingo): Turno de 12h de 06:00 a 18:00
    for (let d = 5; d < 7; d++) {
      const date = new Date(2026, 2, 30 + d);
      const info = getShiftForDate(date);
      expect(info.weekNumber).toBe(4);
      expect(info.shift.code).toBe('M');
      expect(info.shift.startTime).toBe('06:00');
      expect(info.shift.endTime).toBe('18:00');
      expect(info.shift.leaveHome).toBe('05:00');
      expect(info.shift.returnHome).toBe('18:40');
      expect(info.shift.is12h).toBe(true);
    }
  });

  it('cumple el reinicio cíclico al cumplirse los 70 días (Día 70 = Lunes Semana 1 Tarde)', () => {
    // 70 días tras el 9 de marzo de 2026: 18 de mayo de 2026
    const day70 = new Date(2026, 2, 9 + 70);
    const info = getShiftForDate(day70);

    expect(info.dayIndex).toBe(0);
    expect(info.weekNumber).toBe(1);
    expect(info.shift.code).toBe('T');
  });

  it('calcula fechas anteriores a la fecha ancla con módulo matemático seguro', () => {
    // 8 de marzo de 2026 (1 día antes del ancla): debe ser Día 69 (Semana 10, Domingo, Descanso)
    const dayBefore = new Date(2026, 2, 8);
    const info = getShiftForDate(dayBefore);

    expect(info.dayIndex).toBe(69);
    expect(info.weekNumber).toBe(10);
    expect(info.dayOfWeek).toBe(6); // Domingo
    expect(info.shift.code).toBe('D');
  });

  describe('Detección en tiempo real y cruce de medianoche', () => {
    it('detecta correctamente "Está en el trabajo" durante la tarde (14:00 - 22:00)', () => {
      // Lunes 9 de marzo a las 16:30 (Turno Tarde activo)
      const now = new Date(2026, 2, 9, 16, 30);
      const status = evaluateLiveWorkStatus(now);

      expect(status.isAtWork).toBe(true);
      expect(status.statusBadge).toBe('Está en el trabajo');
      expect(status.activeShift.code).toBe('T');
    });

    it('detecta "Fuera de turno" antes del inicio de la tarde', () => {
      // Lunes 9 de marzo a las 11:00
      const now = new Date(2026, 2, 9, 11, 0);
      const status = evaluateLiveWorkStatus(now);

      expect(status.isAtWork).toBe(false);
      expect(status.statusBadge).toBe('Fuera de turno');
    });

    it('detecta turno de Noche activo a las 23:15 del día correspondiente', () => {
      // Lunes 16 de marzo a las 23:15 (Semana 2 Noche)
      const now = new Date(2026, 2, 16, 23, 15);
      const status = evaluateLiveWorkStatus(now);

      expect(status.isAtWork).toBe(true);
      expect(status.statusBadge).toBe('Está en el trabajo');
      expect(status.activeShift.code).toBe('N');
    });

    it('CRUCIAL: Detecta "Está en el trabajo" en la madrugada (02:45) por el turno de noche del día previo', () => {
      // Martes 17 de marzo a las 02:45 (madrugada, el turno de noche del lunes 16 sigue activo)
      const now = new Date(2026, 2, 17, 2, 45);
      const status = evaluateLiveWorkStatus(now);

      expect(status.isAtWork).toBe(true);
      expect(status.statusBadge).toBe('Está en el trabajo');
      expect(status.activeShift.code).toBe('N');
      expect(status.contextDescription).toContain('finaliza a las 06:00');
    });

    it('detecta "Fuera de turno" a las 06:01 tras finalizar el turno de noche', () => {
      // Martes 17 de marzo a las 06:01
      const now = new Date(2026, 2, 17, 6, 1);
      const status = evaluateLiveWorkStatus(now);

      expect(status.isAtWork).toBe(false);
      expect(status.statusBadge).toBe('Fuera de turno');
    });
  });

  describe('Matriz mensual del calendario', () => {
    it('genera la cuadrícula de Marzo 2026 iniciando siempre en Lunes y con nombres en español', () => {
      const matrix = getMonthCalendarMatrix(2026, 2); // Marzo 2026
      expect(matrix.monthTitle).toContain('Marzo');
      expect(matrix.weeks.length).toBeGreaterThanOrEqual(4);
      expect(matrix.weeks[0].length).toBe(7); // 7 días por semana (L a D)

      // Verificar que el 9 de marzo esté en los días del mes actual con turno T
      const day9 = matrix.days.find(d => d.isCurrentMonth && d.dayNumber === 9);
      expect(day9).toBeDefined();
      expect(day9.cycleInfo.shift.code).toBe('T');
    });
  });
});
