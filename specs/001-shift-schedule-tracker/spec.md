# Feature Specification: Rastreador de Turnos de Trabajo (PWA)

**Feature Branch**: `001-shift-schedule-tracker`

**Created**: 2026-10-15

**Status**: Ready for Planning

**Input**: User description: "Build a mobile-first web app (PWA) entirely in Spanish to track a worker's shift schedule. Core features: Current Status Card: A prominent card showing today's shift (e.g., 'Hoy: Turno de Mañana (06:00 - 14:00)'). Live 'At Work' Indicator: Check the device's current local time against today's shift. If inside working hours, show a badge saying 'Está en el trabajo' (handle the 22:00-06:00 night shift crossing midnight). Otherwise, show 'Fuera de turno' or hide the badge. Interactive Calendar: A monthly view localized in Spanish showing shifts (M, T, N, or Descanso) for each day. Shift Logic: A 70-day (10-week) cycle aligned from Monday to Sunday. Week 1: 5 Afternoons (Mon-Fri), 2 Rest (Sat-Sun). Week 2: 7 Nights (Mon-Sun). Week 3: 7 Rest. Week 4: 7 Mornings (Mon-Sun). Week 5: 7 Rest. Week 6: 5 Afternoons (Mon-Fri), 2 Rest. Week 7: 7 Nights (Mon-Sun). Week 8: 7 Rest. Week 9: 5 Mornings (Mon-Fri), 2 Rest. Week 10: 7 Rest. (Mornings: 06:00-14:00, Afternoons: 14:00-22:00, Nights: 22:00-06:00). Use March 9, 2026 as the exact reference date for Day 1 (Monday of Week 1). Assets: Use FontAwesome. Visual references are in a local reference folder."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver Estado y Turno de Hoy de Forma Inmediata (Priority: P1)

Como trabajador con horarios rotativos, quiero abrir la aplicación en mi móvil y ver inmediatamente qué turno me corresponde hoy junto con su horario exacto, para organizar mi día sin necesidad de buscar en un cuadrante físico o calcular semanas.

**Why this priority**: Es la necesidad primordial y el caso de uso más frecuente del usuario: saber al instante si trabaja hoy, en qué turno y a qué hora entra y sale.

**Independent Test**: Al abrir la aplicación en la fecha actual, la pantalla principal muestra una tarjeta de estado destacada con el nombre del turno correspondiente según el ciclo y su rango horario, permitiendo validar de forma independiente el cálculo del día.

**Acceptance Scenarios**:

1. **Given** la fecha de hoy calculada según el ciclo de 70 días corresponde a un turno de Mañana, **When** el usuario abre la aplicación, **Then** visualiza en la tarjeta principal el texto "Hoy: Turno de Mañana" y el horario "06:00 - 14:00".
2. **Given** la fecha actual corresponde a un día de Descanso según el ciclo, **When** el usuario abre la aplicación, **Then** la tarjeta principal indica claramente "Hoy: Descanso" con simbología de descanso y sin rango de horas laborales.

---

### User Story 2 - Indicador en Vivo "En el Trabajo" con Cruce de Medianoche (Priority: P1)

Como trabajador en turno o familiar del trabajador, quiero ver un indicador dinámico en tiempo real que refleje si en el minuto actual el trabajador está dentro o fuera de su jornada laboral, contemplando con total precisión el turno nocturno que cruza la medianoche.

**Why this priority**: Evita confusiones sobre si el trabajador está actualmente en su puesto laboral o disponible, especialmente durante las madrugadas del turno de noche que pertenecen al turno iniciado la noche anterior.

**Independent Test**: Ajustando o simulando la hora local del dispositivo a diferentes franjas horarias (por ejemplo, a las 02:30 de la madrugada habiendo turno nocturno activo iniciado a las 22:00 de la víspera), se verifica que el distintivo cambie automáticamente a "Está en el trabajo", y en horas no laborales cambie a "Fuera de turno".

**Acceptance Scenarios**:

1. **Given** un día con turno de Mañana (06:00 - 14:00) y la hora local del dispositivo son las 09:30, **When** el usuario consulta la aplicación, **Then** el sistema muestra un distintivo activo y visible con el mensaje "Está en el trabajo".
2. **Given** un día con turno de Noche iniciado a las 22:00 del lunes y la hora actual son las 02:30 del martes, **When** el usuario consulta la aplicación, **Then** el sistema reconoce que el turno nocturno sigue activo y muestra el distintivo "Está en el trabajo".
3. **Given** la hora local del dispositivo son las 15:00 de un día con turno de Mañana finalizado a las 14:00, **When** el usuario consulta la aplicación, **Then** el sistema muestra el estado "Fuera de turno" (o el estado secundario de inactividad correspondiente).

---

### User Story 3 - Navegación y Consulta en Calendario Mensual Interactivo (Priority: P2)

Como trabajador, quiero navegar mes a mes en un calendario interactivo en español para anticipar mis turnos futuros (fines de semana libres, semanas de descanso, noches consecutivas) o revisar turnos pasados.

**Why this priority**: Permite la planificación personal y familiar a corto y mediano plazo (vacaciones, citas médicas, compromisos sociales) con una visión global mensual.

**Independent Test**: El usuario puede avanzar al mes siguiente o volver a meses anteriores, observando para cada día del mes una celda con el indicador de turno correspondiente (M, T, N, D / Descanso) conforme a la secuencia matemática del ciclo de 70 días.

**Acceptance Scenarios**:

1. **Given** el calendario en vista del mes actual, **When** el usuario pulsa el control para avanzar al mes siguiente, **Then** el calendario renderiza los días del nuevo mes con la cabecera en español (Lunes a Domingo) y las marcas de turno correctas calculadas para cada día.
2. **Given** el usuario se encuentra navegando en un mes futuro o pasado, **When** pulsa el botón "Hoy", **Then** el calendario regresa automáticamente a la vista del mes corriente resaltando la fecha de hoy.

---

### User Story 4 - Inspección Detallada de Turno por Día Seleccionado (Priority: P3)

Como usuario, quiero tocar cualquier día del calendario mensual para inspeccionar los detalles completos de ese día (tipo de turno, horas de inicio y fin, número de semana dentro del ciclo de 10 semanas).

**Why this priority**: Complementa la vista resumida del calendario brindando certidumbre sobre los detalles operativos de días específicos sin saturar la cuadrícula mensual.

**Independent Test**: Al hacer clic o pulsar sobre cualquier día de la cuadrícula del calendario, la interfaz resalta el día seleccionado y actualiza un panel o tarjeta de detalle con la información completa en español.

**Acceptance Scenarios**:

1. **Given** el calendario mensual en pantalla, **When** el usuario selecciona el 15 de marzo de 2026, **Then** el sistema presenta el detalle completo: día de la semana en español, semana correspondiente del ciclo y estado ("Descanso").
2. **Given** un día seleccionado con turno de Noche, **When** se visualiza su detalle, **Then** se detalla explícitamente "Turno de Noche (22:00 - 06:00)" indicando que finaliza a la mañana siguiente.

---

### Edge Cases

- **Cruce de medianoche en turno nocturno (22:00 - 06:00)**: Si la hora actual está entre las 00:00 y las 05:59:59, el sistema debe evaluar el turno que comenzó a las 22:00 del día anterior para determinar si el usuario "Está en el trabajo", y no únicamente los turnos programados a partir de las 00:00 del día en curso.
- **Límites de minutos exactos**: A las 06:00:00, el turno de mañana comienza y el de noche expira; a las 14:00:00 el turno de mañana finaliza y el de tarde comienza. El sistema debe evitar solapamientos ambiguos o desfases de un minuto.
- **Años bisiestos y cambios de mes**: El motor de fechas debe calcular la diferencia de días exactos entre la fecha ancla (9 de marzo de 2026) y cualquier fecha objetivo considerando meses de 28, 29, 30 y 31 días y desfases de huso horario sin pérdidas de días por horario de verano (DST).
- **Fechas anteriores a la fecha ancla**: Si el usuario navega a fechas previas al 9 de marzo de 2026, el cálculo cíclico módulo 70 debe retroceder de manera matemáticamente correcta sin generar índices negativos.
- **Acceso sin conexión a internet (Modo Offline PWA)**: Si el dispositivo pierde la conectividad o se instala como aplicación de pantalla de inicio, la aplicación debe cargar instantáneamente y funcionar al 100% gracias a su naturaleza local y autónoma.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE implementar un ciclo recurrente estricto de 70 días (10 semanas), con fecha de anclaje inicial fijada el lunes 9 de marzo de 2026 (Semana 1, Día 1).
- **FR-002**: El patrón del ciclo de 70 días DEBE estructurarse de lunes a domingo de la siguiente manera:
  - *Semana 1*: 5 Tardes (Lunes a Viernes), 2 Descanso (Sábado y Domingo).
  - *Semana 2*: 7 Noches (Lunes a Domingo).
  - *Semana 3*: 7 Descanso (Lunes a Domingo).
  - *Semana 4*: 7 Mañanas (Lunes a Domingo).
  - *Semana 5*: 7 Descanso (Lunes a Domingo).
  - *Semana 6*: 5 Tardes (Lunes a Viernes), 2 Descanso (Sábado y Domingo).
  - *Semana 7*: 7 Noches (Lunes a Domingo).
  - *Semana 8*: 7 Descanso (Lunes a Domingo).
  - *Semana 9*: 5 Mañanas (Lunes a Viernes), 2 Descanso (Sábado y Domingo).
  - *Semana 10*: 7 Descanso (Lunes a Domingo).
- **FR-003**: Los tipos de turno y sus horarios DEBEN definirse como:
  - Mañana: 06:00 a 14:00 (código identificador: `M`).
  - Tarde: 14:00 a 22:00 (código identificador: `T`).
  - Noche: 22:00 a 06:00 del día siguiente (código identificador: `N`).
  - Descanso: Sin horario laboral (código identificador: `D` o `Descanso`).
- **FR-004**: El sistema DEBE mostrar una Tarjeta de Estado Actual destacada en la parte superior que presente el turno de la fecha actual con formato legible (ejemplo: "Hoy: Turno de Mañana (06:00 - 14:00)" o "Hoy: Descanso").
- **FR-005**: El sistema DEBE contar con un Indicador "En el trabajo" en tiempo real que verifique el minuto actual del dispositivo frente a los horarios de turno activos.
- **FR-006**: El indicador en tiempo real DEBE gestionar el cruce de medianoche del turno de noche: si la hora actual está entre las 00:00 y las 05:59:59 y el día anterior tuvo turno de noche, el indicador DEBE mostrar "Está en el trabajo".
- **FR-007**: Cuando la hora actual esté fuera de cualquier jornada laboral, el sistema DEBE mostrar un estado "Fuera de turno" o silenciar el estado activo.
- **FR-008**: El sistema DEBE actualizar automáticamente el indicador en tiempo real periódicamente (al menos cada 60 segundos) sin necesidad de recargar la página.
- **FR-009**: El sistema DEBE renderizar un Calendario Mensual interactivo con cabeceras de lunes a domingo en español.
- **FR-010**: Cada celda del calendario DEBE mostrar el número del día y una insignia o código visual claramente diferenciado según el turno asignado (M, T, N, Descanso).
- **FR-011**: El calendario DEBE permitir avanzar al mes siguiente, retroceder al mes anterior y retornar al mes actual mediante un botón "Hoy".
- **FR-012**: El usuario DEBE poder pulsar cualquier día del calendario para ver el detalle ampliado de esa fecha (turno, horario completo y semana del ciclo).
- **FR-013**: Toda la interfaz de usuario, nombres de días, nombres de meses, etiquetas, estados y mensajes DEBEN estar íntegramente en español.
- **FR-014**: La aplicación DEBE responder a estándares de Progressive Web App (PWA), permitiendo su instalación en la pantalla de inicio de dispositivos móviles y su operación completa offline.
- **FR-015**: La interfaz DEBE seguir estrictamente una estética Apple/iOS: tarjetas tipo widget con esquinas redondeadas continuas, efectos de desenfoque de fondo (`backdrop-filter: blur`), sombras sutiles multicapa, microinteracciones táctiles y tipografía limpia.
- **FR-016**: La aplicación DEBE utilizar iconografía de FontAwesome para reforzar visualmente los estados de turno, controles de navegación y distintivos.

### Key Entities

- **Turno (Shift)**: Define la categoría del turno de trabajo. Atributos: nombre en español ("Mañana", "Tarde", "Noche", "Descanso"), código corto (`M`, `T`, `N`, `D`), hora de inicio (`HH:mm`), hora de fin (`HH:mm`), color distintivo, icono representativo.
- **Ciclo de Turnos (ShiftCycle)**: Estructura fija de 70 días con fecha ancla (`2026-03-09`). Permite computar de forma pura para cualquier fecha calendario el índice de día (`0` a `69`), la semana (`1` a `10`) y el Turno correspondiente.
- **Día de Calendario (CalendarDay)**: Representación de una fecha particular. Atributos: fecha calendario (`AAAA-MM-DD`), número de día del mes, nombre del día en español, pertenencia al mes visible, es hoy (`boolean`), turno asignado.
- **Estado de Actividad (WorkStatus)**: Estado en tiempo real del usuario en un instante dado. Atributos: `estaEnElTrabajo` (`boolean`), texto descriptivo ("Está en el trabajo" / "Fuera de turno"), turno asociado activo, tiempo restante de turno.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El usuario puede comprobar su turno actual y saber si está en horario de trabajo en menos de 2 segundos tras abrir la aplicación.
- **SC-002**: El cálculo cíclico de turnos presenta una precisión del 100% para cualquier fecha entre los años 2020 y 2040, sin desajustes por cambios horarios ni años bisiestos.
- **SC-003**: La detección de cruce de medianoche en el turno de noche funciona con un 100% de fiabilidad en pruebas automatizadas de franjas horarias (22:00 a 23:59 y 00:00 a 05:59).
- **SC-004**: La interfaz de usuario logra una puntuación de accesibilidad y contraste superior a 90/100 en auditorías estándar en dispositivos móviles.
- **SC-005**: La aplicación se carga y muestra el estado en menos de 1 segundo en condiciones sin conexión (offline) una vez instalada o cacheada.
- **SC-006**: El 100% de las cadenas visibles en la interfaz están redactadas y formateadas en español.

## Assumptions

- **Huso horario**: Los turnos se calculan en base a la hora local configurada en el dispositivo móvil del usuario.
- **Monousuario / Sin backend**: La versión actual es de uso personal y local; no requiere registro de usuarios en servidor ni sincronización multi-dispositivo en la nube para operar.
- **Fecha de anclaje**: El 9 de marzo de 2026 es invariablemente el día 1 (lunes) de la semana 1 del ciclo de 70 días.
- **Navegadores objetivo**: Navegadores móviles modernos con soporte para Progressive Web Apps, CSS `backdrop-filter` y JavaScript modular ES6+ (Safari en iOS 15+ y Chrome en Android).
