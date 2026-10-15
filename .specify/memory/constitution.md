<!--
Sync Impact Report:
- Version change: Template -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Modular Vanilla JavaScript Architecture
  - [PRINCIPLE_2_NAME] -> II. Strict Apple/iOS Visual Design Standards
  - [PRINCIPLE_3_NAME] -> III. Strict Separation of Shift Logic and UI Rendering
  - [PRINCIPLE_4_NAME] -> IV. Strict Spanish-First Localization (i18n)
  - [PRINCIPLE_5_NAME] -> V. Lightweight Performance & Mobile-First Ergonomics
- Added sections:
  - Technical Constraints & Standards
  - Development Workflow & Quality Gates
- Removed sections:
  - None
- Follow-up TODOs:
  - None
-->

# Kanki Constitution

## Core Principles

### I. Modular Vanilla JavaScript Architecture
The application MUST be built using clean, modern, modular Vanilla JavaScript (ES6+ modules).
- No external frameworks, heavy runtime libraries, or bloated dependencies are permitted for core application functionality.
- Code MUST be organized into cohesive, single-responsibility modules (e.g., shift engines, storage adapters, view controllers, UI components).
- Native Web APIs (such as Web Storage, modern DOM APIs, and Intl) MUST be preferred over third-party utilities.
- *Rationale*: Guarantees instant load times, zero framework churn, minimal build overhead, and longevity of the codebase.

### II. Strict Apple/iOS Visual Design Standards
The user interface MUST strictly adhere to Apple/iOS Human Interface Guidelines design conventions:
- Glassmorphism & Depth: Deep frosted glass effects implemented via `backdrop-filter: blur(...)` combined with subtle semi-transparent background fills.
- Shadows & Elevation: Delicate, multi-layered drop shadows rather than harsh outlines or flat solid borders.
- Geometry: Smooth rounded corners (`border-radius` between 12px and 24px) reflecting iOS squircle aesthetic curves.
- Fluid Transitions: Hardware-accelerated, high-frame-rate CSS transitions (using iOS-style timing curves such as `cubic-bezier(0.25, 1, 0.5, 1)`) for all state changes, interactive feedback, and sheet/modal presentations.
- *Rationale*: Creates an elegant, polished, and native-feeling interface that provides high tactile satisfaction and clarity.

### III. Strict Separation of Shift Logic and UI Rendering
Business logic for shift calculation MUST be strictly decoupled from the presentation layer:
- Shift calculation logic (rotations, shift types, hours, cycle repetitions, calendar offsets) MUST reside in pure, deterministic JavaScript functions with zero DOM or rendering dependencies.
- UI rendering components MUST only consume computed state/models and emit user intent. Rendering logic MUST NOT compute shift intervals or maintain schedule rules directly.
- The shift calculation engine MUST be independently testable with standard inputs and deterministic assertions.
- *Rationale*: Shift patterns are algorithmically demanding; separating calculation from DOM presentation prevents visual glitches, eliminates side effects, and enables safe maintenance and evolution of complex shift rotations.

### IV. Strict Spanish-First Localization (i18n)
All user-facing elements, interactions, and date presentations MUST be strictly in Spanish:
- Every UI copy string, button label, modal prompt, tooltip, and error message MUST be written in natural, grammatically correct Spanish.
- Date and time formatting MUST follow Spanish regional standards (`es-ES` / standard Spanish locale conventions), including day and month names, Monday-first calendar grids, and 24-hour time notation where applicable.
- No hardcoded English strings or mixed-language UI artifacts are permitted.
- *Rationale*: Delivers a cohesive, accessible, and intuitive experience tailored specifically for Spanish-speaking shift workers.

### V. Lightweight Performance & Mobile-First Ergonomics
The application MUST be designed and optimized mobile-first:
- All interactive targets MUST respect iOS touch ergonomics (minimum 44x44px clickable areas) and support safe area insets (`env(safe-area-inset-*)`).
- DOM updates MUST be efficient, avoiding unnecessary re-renders, layout thrashing, or high-overhead reflows to maintain consistent 60fps animations.
- *Rationale*: Shift workers frequently consult their schedules on mobile devices under varying network and lighting conditions; effortless ergonomics and high responsiveness are mandatory.

## Technical Constraints & Standards

- **Language & Runtime**: Pure HTML5, Vanilla CSS3 (utilizing CSS custom properties for design tokens: colors, blurs, radii, shadows), and ECMAScript 2022+ modules.
- **State Management**: Predictable unidirectional state flow or lightweight pub/sub model without external state frameworks.
- **Persistence**: Clean browser-native storage (e.g., `localStorage` or `IndexedDB`) wrapped behind an abstracted storage service.
- **Browser Target**: Modern mobile and desktop browsers with full support for CSS `backdrop-filter` and ES modules.

## Development Workflow & Quality Gates

- **Logic Verification**: Any modifications to shift computation, calendar generation, or rotation cycles must be validated against edge cases (month boundaries, leap years, rotation offsets).
- **Aesthetic Gate**: All visual changes must be audited against Apple/iOS design principles: blur readability, contrast accessibility, proper corner radii, and smooth spring-like transitions.
- **Locale Compliance Check**: Every pull request or feature update must ensure 100% Spanish text coverage across all user-facing views and formats.

## Governance

- This Constitution serves as the authoritative architectural, design, and linguistic benchmark for Kanki.
- Principles and constraints defined herein supersede ad-hoc implementation preferences.
- Amendments to this constitution require documented rationale, impact assessment on existing modules, and a semantic version bump.
- Compliance MUST be verified during design and code reviews prior to feature completion.

**Version**: 1.0.0 | **Ratified**: 2026-10-15 | **Last Amended**: 2026-10-15
