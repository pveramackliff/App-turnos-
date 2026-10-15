# Implementation Plan: Rastreador de Turnos de Trabajo (PWA)

**Branch**: `001-shift-schedule-tracker` | **Date**: 2026-10-15 | **Spec**: [specs/001-shift-schedule-tracker/spec.md](spec.md)

**Input**: Feature specification from `specs/001-shift-schedule-tracker/spec.md`

## Summary

Desarrollo de una Progressive Web App (PWA) móvil centrada en la experiencia de usuario de trabajadores a turnos, con un ciclo cerrado de 70 días (10 semanas) anclado al 9 de marzo de 2026. La aplicación se construye con **Vite**, **Vanilla JavaScript modular** y **CSS nativo con variables de diseño estilo iOS/Apple**, incorporando una tarjeta destacada con el turno de hoy, un indicador dinámico en tiempo real ("Está en el trabajo" con soporte de cruce de medianoche en turnos de 22:00 a 06:00), un calendario mensual interactivo localizado en español y capacidad de instalación offline en iPhone y navegadores modernos.

## Technical Context

**Language/Version**: Modern Vanilla JavaScript (ES2022+ modules) nativo, sin frameworks ni dependencias de renderizado.

**Primary Dependencies**: 
- **Vite** (herramienta ultrarrápida de desarrollo y empaquetado para Vanilla JS).
- **FontAwesome** (iconografía mediante SVG/Webfonts para símbolos de sol, luna, descanso y navegación).

**Storage**: Adaptador `StorageService` sobre `localStorage` nativo del navegador, proporcionando persistencia inmediata sin latencia para metadatos, notas y preferencias de usuario, garantizando soporte offline PWA total.

**Testing**: **Vitest** para la validación exhaustiva y determinista del motor matemático de turnos (`% 70`), casos borde de calendario y cruce de medianoche.

**Target Platform**: Mobile-first Web / iOS Safari 15+ (con soporte para PWA instalable en pantalla de inicio vía `manifest.webmanifest` y metaetiquetas de Apple) y navegadores modernos de escritorio y Android.

**Project Type**: Progressive Web Application (PWA).

**Performance Goals**: Carga inicial en < 1 segundo en modo offline, animaciones y transiciones de interfaz a 60 fps continuos, cero desajustes de diseño (*layout shift*).

**Constraints**:
- Disponibilidad 100% offline mediante Service Worker.
- Respeto de zonas seguras de pantalla (`env(safe-area-inset-*)`) para Dynamic Island y barra de inicio en iOS.
- Localización 100% estricta en español (`es-ES`) para interfaz, días, meses y formateo de horas.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación y Cumplimiento en el Diseño |
|---|---|---|
| **I. Arquitectura Modular en Vanilla JS** | **APROBADO** | No se utilizan frameworks (React, Vue, etc.). El código se organiza en módulos ES6 puros (dominio, servicios, UI). |
| **II. Estándar Visual Estricto Apple/iOS** | **APROBADO** | Diseño basado en tarjetas widget iOS, desenfoque `backdrop-filter: blur(24px)`, sombras multicapa suaves y curvas `border-radius: 20px`. |
| **III. Separación de Lógica de Turnos y UI** | **APROBADO** | El motor `src/domain/shiftEngine.js` es 100% puro y no toca el DOM. La capa `src/ui/` sólo consume datos calculados. |
| **IV. Localización Estricta en Español** | **APROBADO** | Todo texto, etiquetas, nombres de meses y días se generan en español. El calendario inicia incondicionalmente en Lunes. |
| **V. Rendimiento y Ergonomía Mobile-First** | **APROBADO** | PWA autónoma con Service Worker, áreas táctiles mínimas de 44x44px y diseño responsivo para uso con una sola mano. |

## Project Structure

### Documentation (this feature)

```text
specs/001-shift-schedule-tracker/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación técnica y decisiones (Fase 0)
├── data-model.md        # Entidades y modelos de datos (Fase 1)
├── contracts/           # Contratos de interfaces públicas (Fase 1)
│   ├── shift-engine.contract.md
│   └── storage.contract.md
├── quickstart.md        # Guía de validación y escenarios de prueba (Fase 1)
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code (repository root)

```text
public/
├── icons/
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── apple-touch-icon.png
├── manifest.webmanifest
└── sw.js                     # Service Worker para caché offline
src/
├── domain/                   # Motor matemático puro de turnos (Sin DOM)
│   ├── shiftConstants.js     # Definición inmutable de turnos y ciclo de 70 días
│   └── shiftEngine.js        # Algoritmo % 70, evaluación de horas y cruce de medianoche
├── services/                 # Servicios de infraestructura
│   ├── storageService.js     # Adaptador de almacenamiento local y configuración
│   └── soundOrHaptics.js     # Feedback táctil sutil para iOS
├── ui/                       # Componentes de renderizado visual Vanilla
│   ├── statusCard.js         # Tarjeta de turno de hoy y saludo contextual
│   ├── liveIndicator.js      # Distintivo en tiempo real "Está en el trabajo"
│   ├── calendarView.js       # Cuadrícula mensual interactiva y selector de mes
│   └── dayDetailSheet.js     # Panel inferior / modal con detalle del día pulsado
├── styles/                   # Sistema de diseño con variables CSS
│   ├── tokens.css            # Paleta de colores iOS, desenfoques, radios y sombras
│   ├── base.css              # Reset, tipografía SF Pro, safe-areas
│   ├── widgets.css           # Estilos de tarjetas widget y distintivos
│   └── calendar.css          # Cuadrícula de calendario y celdas de turnos
├── main.js                   # Punto de entrada de la aplicación y ciclo de actualización
└── index.html                # Shell HTML con metaetiquetas nativas para iOS
tests/
└── shiftEngine.test.js       # Suite de pruebas unitarias del motor de turnos
package.json
vite.config.js
```

**Structure Decision**: Arquitectura en proyecto único modular, aislando estrictamente la lógica matemática en `src/domain/`, los adaptadores en `src/services/` y las vistas en `src/ui/`.

## Complexity Tracking

*No existen desviaciones ni violaciones de la Constitución; no se requiere registro de complejidad.*
