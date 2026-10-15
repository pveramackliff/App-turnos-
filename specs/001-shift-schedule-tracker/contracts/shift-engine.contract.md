# Contract: Motor de Turnos (Shift Engine Interface)

**Module**: `src/domain/shiftEngine.js`  
**Compliance**: Strict Separation of Shift Logic and UI Rendering (Constitution Principle III)  

---

## 1. Constantes Exportadas

### `SHIFT_TYPES`
```javascript
export const SHIFT_TYPES = Object.freeze({
  MORNING: {
    id: 'morning',
    code: 'M',
    name: 'Mañana',
    startTime: '06:00',
    endTime: '14:00',
    isWork: true,
    crossesMidnight: false,
    colorVar: '--color-shift-m',
    icon: 'fa-solid fa-sun'
  },
  AFTERNOON: {
    id: 'afternoon',
    code: 'T',
    name: 'Tarde',
    startTime: '14:00',
    endTime: '22:00',
    isWork: true,
    crossesMidnight: false,
    colorVar: '--color-shift-t',
    icon: 'fa-solid fa-cloud-sun'
  },
  NIGHT: {
    id: 'night',
    code: 'N',
    name: 'Noche',
    startTime: '22:00',
    endTime: '06:00',
    isWork: true,
    crossesMidnight: true,
    colorVar: '--color-shift-n',
    icon: 'fa-solid fa-moon'
  },
  REST: {
    id: 'rest',
    code: 'D',
    name: 'Descanso',
    startTime: null,
    endTime: null,
    isWork: false,
    crossesMidnight: false,
    colorVar: '--color-shift-d',
    icon: 'fa-solid fa-bed'
  }
});
```

---

## 2. Métodos Públicos

### `getCycleDayIndex(date: Date): number`
- **Propósito**: Calcula el índice de día (`0` a `69`) dentro del ciclo de 70 días a partir de una fecha dada.
- **Entrada**: Objeto `Date` de JavaScript.
- **Salida**: Número entero en el rango `[0, 69]`.
- **Invariante**: Para la fecha `2026-03-09` retorna exactamente `0`.
- **Determinismo**: La misma fecha siempre devuelve el mismo índice sin importar el huso horario del cliente ni el horario de verano.

### `getShiftForDate(date: Date): CycleDayInfo`
- **Propósito**: Obtiene la información completa del turno para un día específico.
- **Entrada**: Objeto `Date`.
- **Salida**:
  ```typescript
  {
    date: Date,
    isoDate: string,           // 'YYYY-MM-DD'
    dayIndex: number,          // 0..69
    weekNumber: number,        // 1..10
    dayOfWeek: number,         // 0 (Lunes) .. 6 (Domingo)
    shift: ShiftType
  }
  ```

### `evaluateLiveWorkStatus(now?: Date): WorkStatus`
- **Propósito**: Evalúa la hora actual y determina si el trabajador está en horario de trabajo o fuera de turno.
- **Entrada**: Objeto `Date` opcional (por defecto `new Date()`).
- **Salida**:
  ```typescript
  {
    isAtWork: boolean,
    statusBadge: "Está en el trabajo" | "Fuera de turno",
    activeShift: ShiftType,
    contextDescription: string,
    checkedAt: Date
  }
  ```
- **Regla Crítica de Cruce de Medianoche**: Si `now` está entre `00:00:00` y `05:59:59`, se evalúa el turno de `now - 1 día`. Si fue turno de `Noche`, `isAtWork` es `true` y `activeShift` es `SHIFT_TYPES.NIGHT`.

### `getMonthCalendarMatrix(year: number, monthIndex: number): CalendarMonthView`
- **Propósito**: Genera la estructura de semanas y días para renderizar la cuadrícula del calendario de cualquier mes.
- **Semana**: Comienza incondicionalmente en Lunes (índice 0) y termina en Domingo (índice 6).
