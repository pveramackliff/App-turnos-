# Data Model: Rastreador de Turnos Kanki

**Feature**: `001-shift-schedule-tracker`  
**Date**: 2026-10-15  
**Status**: Completed  

---

## 1. Entidades del Dominio

### 1.1 ShiftType (Tipo de Turno)
Representa una de las 4 modalidades de jornada de trabajo o descanso en el sistema.

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|---|---|---|---|---|
| `id` | `string` | Sí | Identificador único textual | `"morning"`, `"afternoon"`, `"night"`, `"rest"` |
| `code` | `string` | Sí | Código de una letra o acrónimo corto | `"M"`, `"T"`, `"N"`, `"D"` |
| `name` | `string` | Sí | Nombre en español | `"Mañana"`, `"Tarde"`, `"Noche"`, `"Descanso"` |
| `startTime` | `string \| null` | Sí | Hora de inicio en formato militar `HH:mm` (null si descanso) | `"06:00"`, `"14:00"`, `"22:00"`, `null` |
| `endTime` | `string \| null` | Sí | Hora de finalización en formato `HH:mm` (null si descanso) | `"14:00"`, `"22:00"`, `"06:00"`, `null` |
| `isWork` | `boolean` | Sí | Indica si computa como jornada laboral activa | `true` para M, T, N; `false` para D |
| `crossesMidnight` | `boolean` | Sí | Indica si la jornada se extiende al día siguiente | `true` exclusivamente para N |
| `themeColor` | `string` | Sí | Variable CSS o color hexadecimal para resaltar el turno | `var(--color-shift-m)` |
| `iconClass` | `string` | Sí | Clase FontAwesome asociada para iconografía | `"fa-sun"`, `"fa-cloud-sun"`, `"fa-moon"`, `"fa-bed"` |

---

### 1.2 CycleDayInfo (Información del Día en el Ciclo)
Resultado del cálculo determinista para cualquier fecha del calendario.

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|---|---|---|---|---|
| `date` | `Date` | Sí | Objeto Date correspondiente normalizado a las 00:00:00 | `new Date(2026, 2, 9)` |
| `isoDate` | `string` | Sí | Fecha en formato ISO corto `AAAA-MM-DD` | `"2026-03-09"` |
| `dayIndex` | `number` | Sí | Índice del día dentro del ciclo (0 a 69) | `0` |
| `weekNumber` | `number` | Sí | Número de semana dentro del ciclo (1 a 10) | `1` |
| `dayOfWeek` | `number` | Sí | Día de la semana (0 = Lunes, 6 = Domingo) | `0` |
| `shift` | `ShiftType` | Sí | Instancia inmutable del tipo de turno asignado | `SHIFT_TYPES.AFTERNOON` |

---

### 1.3 WorkStatus (Estado en Tiempo Real)
Representa la condición operativa del trabajador en el minuto actual del dispositivo.

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|---|---|---|---|---|
| `isAtWork` | `boolean` | Sí | Indica si la hora actual está dentro de la jornada | `true` |
| `statusBadge` | `string` | Sí | Texto en español para el distintivo | `"Está en el trabajo"`, `"Fuera de turno"` |
| `activeShift` | `ShiftType` | Sí | Turno activo relevante (o el turno asignado del día) | `SHIFT_TYPES.NIGHT` |
| `contextDescription` | `string` | Sí | Descripción legible del horario o descanso | `"Turno de Noche (finaliza a las 06:00)"` |
| `checkedAt` | `Date` | Sí | Marca de tiempo del instante de evaluación | `new Date()` |

---

### 1.4 CalendarMonthView (Modelo de Vista del Calendario)
Estructura precomputada para renderizar el mes en cuadrícula de 7 columnas (Lunes a Domingo).

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `year` | `number` | Sí | Año calendario (ej. `2026`) |
| `monthIndex` | `number` | Sí | Índice del mes (0 = Enero, 11 = Diciembre) |
| `monthTitle` | `string` | Sí | Nombre en español formateado (ej. `"Marzo 2026"`) |
| `weeks` | `Array<CalendarWeek>` | Sí | Lista de semanas que componen la vista mensual |

Cada `CalendarDayCell`:
- `date`: `Date`
- `dayNumber`: `number` (1..31)
- `isCurrentMonth`: `boolean` (false para días del mes anterior/siguiente de relleno)
- `isToday`: `boolean`
- `cycleInfo`: `CycleDayInfo`

---

### 1.5 UserSettings (Configuración y Metadatos Locales)
Almacenado localmente a través de `StorageService`.

| Campo | Tipo | Requerido | Descripción | Valor por Defecto |
|---|---|---|---|---|
| `themeMode` | `'system' \| 'light' \| 'dark'` | Sí | Modo de apariencia de la interfaz | `'system'` |
| `dayNotes` | `Record<string, string>` | No | Notas o recordatorios por fecha `AAAA-MM-DD` | `{}` |
| `showLiveTimer` | `boolean` | Sí | Mostrar cuenta regresiva de fin de turno | `true` |
