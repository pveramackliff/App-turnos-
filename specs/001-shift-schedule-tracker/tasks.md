# Implementation Tasks: Rastreador de Turnos de Trabajo (PWA)

**Feature**: `001-shift-schedule-tracker` | **Spec**: [specs/001-shift-schedule-tracker/spec.md](spec.md) | **Plan**: [specs/001-shift-schedule-tracker/plan.md](plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización del proyecto, dependencias y estructura básica PWA.

- [X] T001 Initialize package.json with Vite and Vitest dependencies in package.json
- [X] T002 Configure Vite bundler in vite.config.js
- [X] T003 Configure HTML shell with iOS meta tags and FontAwesome in index.html
- [X] T004 [P] Create PWA web app manifest with iOS standalone configuration in public/manifest.webmanifest
- [X] T005 [P] Create application icon assets for iOS and PWA install in public/icons/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura compartida del motor de turnos, almacenamiento y tokens de diseño iOS.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Implement shift types and 70-day cycle pattern in src/domain/shiftConstants.js
- [X] T007 [P] Implement iOS design tokens with CSS variables for glassmorphism, blur, and shifts in src/styles/tokens.css
- [X] T008 [P] Implement base reset, typography, and safe area insets in src/styles/base.css
- [X] T009 [P] Implement local storage adapter service with safe fallback in src/services/storageService.js
- [X] T010 Implement 70-day modulo cycle math and date normalization in src/domain/shiftEngine.js
- [X] T011 Implement unit tests for anchor date (March 9, 2026) and 70-day sequence in tests/shiftEngine.test.js

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Ver Estado y Turno de Hoy (Priority: P1) 🎯 MVP

**Goal**: Permitir al usuario ver de inmediato su turno de hoy con horario exacto e información del ciclo al abrir la app.

**Independent Test**: Al abrir la aplicación en la fecha actual, se presenta la tarjeta principal destacada con el turno correspondiente y su rango de horas.

### Tests for User Story 1 ⚠️

- [X] T012 [P] [US1] Add unit tests for today's shift resolution and text formatting in tests/shiftEngine.test.js

### Implementation for User Story 1

- [X] T013 [P] [US1] Implement iOS widget card and typography styles in src/styles/widgets.css
- [X] T014 [US1] Implement status card component showing today's shift and hours in src/ui/statusCard.js
- [X] T015 [US1] Integrate status card with shiftEngine in src/main.js

**Checkpoint**: User Story 1 (MVP) is fully functional and independently verifiable.

---

## Phase 4: User Story 2 - Indicador en Vivo "En el Trabajo" con Cruce de Medianoche (Priority: P1)

**Goal**: Mostrar un distintivo en tiempo real que indique si el trabajador está en su turno o fuera de turno, gestionando el turno de noche (22:00 a 06:00).

**Independent Test**: Simular horas dentro y fuera de turno (especialmente de 00:00 a 05:59 con turno nocturno previo) y comprobar que el distintivo cambie a "Está en el trabajo" o "Fuera de turno".

### Tests for User Story 2 ⚠️

- [X] T016 [P] [US2] Add unit tests for midnight crossing logic and time interval checks in tests/shiftEngine.test.js

### Implementation for User Story 2

- [X] T017 [US2] Implement evaluateLiveWorkStatus in src/domain/shiftEngine.js
- [X] T018 [P] [US2] Implement live indicator badge component and animations in src/ui/liveIndicator.js
- [X] T019 [US2] Connect live indicator and 60-second periodic timer in src/main.js

**Checkpoint**: User Stories 1 AND 2 are fully functional together.

---

## Phase 5: User Story 3 - Navegación y Consulta en Calendario Mensual Interactivo (Priority: P2)

**Goal**: Visualizar el cuadrante de turnos del mes en una cuadrícula en español (L-D) con navegación mes a mes y botón "Hoy".

**Independent Test**: Navegar entre diferentes meses, verificar las marcas de turno (M, T, N, D) y pulsar "Hoy" para volver al mes actual.

### Implementation for User Story 3

- [X] T020 [P] [US3] Implement getMonthCalendarMatrix with Monday-first alignment in src/domain/shiftEngine.js
- [X] T021 [P] [US3] Implement monthly grid and shift badge styles in src/styles/calendar.css
- [X] T022 [US3] Implement interactive calendar component with month navigation in src/ui/calendarView.js
- [X] T023 [US3] Mount calendarView and bind month navigation controls in src/main.js

**Checkpoint**: User Stories 1, 2, and 3 work seamlessly.

---

## Phase 6: User Story 4 - Inspección Detallada de Turno por Día Seleccionado (Priority: P3)

**Goal**: Tocar cualquier día del calendario para desplegar una tarjeta/modal inferior con el detalle completo del turno, horario y semana.

**Independent Test**: Tocar un día cualquiera en el calendario y verificar que se abra el panel con la información detallada en español.

### Implementation for User Story 4

- [X] T024 [P] [US4] Implement bottom sheet and detail modal styles with blur in src/styles/widgets.css
- [X] T025 [US4] Implement day detail sheet component in src/ui/dayDetailSheet.js
- [X] T026 [US4] Connect calendar day selection event to dayDetailSheet in src/main.js

**Checkpoint**: All 4 user stories are fully interactive and complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: PWA offline caching, instalación en iOS, rendimiento y aseguramiento de calidad.

- [X] T027 [P] Implement Cache-First Service Worker for complete offline operation in public/sw.js
- [X] T028 Register Service Worker and manage lifecycle in src/main.js
- [X] T029 Audit 100% Spanish text and verify Apple iOS visual polish across all components
- [X] T030 Execute end-to-end quickstart scenarios per specs/001-shift-schedule-tracker/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories.
- **User Story 1 (Phase 3 - P1)**: Depends on Phase 2. Forms the core MVP.
- **User Story 2 (Phase 4 - P1)**: Depends on Phase 2 and shift engine. Integrates with US1.
- **User Story 3 (Phase 5 - P2)**: Depends on Phase 2. Integrates with US1/US2.
- **User Story 4 (Phase 6 - P3)**: Depends on Phase 5 (calendar day clicks).
- **Polish (Phase 7)**: Depends on completion of user stories.

### Parallel Opportunities

- Within Phase 1: `T004` and `T005` can run in parallel.
- Within Phase 2: `T007`, `T008`, and `T009` can run in parallel.
- User Story 1 & 2: `T012`, `T013`, `T016`, `T018` can be built in parallel.
- Calendar & Modal: `T020`, `T021`, `T024` can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)
1. Complete Setup (Phase 1) + Foundational (Phase 2).
2. Complete User Story 1 (Phase 3) → Validate MVP showing today's shift.
3. Complete User Story 2 (Phase 4) → Live "Está en el trabajo" status.

### Incremental Delivery
4. Add User Story 3 (Phase 5) → Full monthly interactive calendar view.
5. Add User Story 4 (Phase 6) → Interactive day selection detail sheet.
6. Complete Polish (Phase 7) → Offline Service Worker PWA installation for iOS.
