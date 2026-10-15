# Research: Arquitectura y Decisiones Técnicas para Kanki PWA

**Feature**: `001-shift-schedule-tracker`  
**Date**: 2026-10-15  
**Status**: Completed  

---

## 1. Algoritmo de Cálculo Cíclico de Turnos (Módulo 70)

### Decisión
Implementar una función pura en JavaScript que compute el desfase en días enteros entre cualquier fecha objetivo y la fecha ancla (`2026-03-09`), aplicando el operador módulo con normalización matemática para fechas anteriores:

```javascript
const ANCHOR_DATE = new Date(2026, 2, 9); // 9 de marzo de 2026 (mes 2 = marzo en JS Date)

export function getCycleDayIndex(targetDate) {
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const anchorMidnight = new Date(ANCHOR_DATE.getFullYear(), ANCHOR_DATE.getMonth(), ANCHOR_DATE.getDate());
  
  // Desfase en días normalizado a medianoche para evitar desvíos por horario de verano (DST)
  const diffTime = targetMidnight.getTime() - anchorMidnight.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  // Módulo seguro para números negativos
  return ((diffDays % 70) + 70) % 70;
}
```

### Razón
- `Math.round(diffTime / 86400000)` sobre fechas en hora local a las 00:00:00 elimina por completo errores provocados por cambios horarios de 23 o 25 horas al inicio o fin del horario de verano europeo (`DST`).
- La normalización `((diff % 70) + 70) % 70` garantiza que la navegación a años anteriores (2025, 2024...) o futuros sea 100% determinista y matemática.
- Mapeo directo de los 70 días a un array precomputado inmutable de tipos de turno:
  - Días 0..4 (Semana 1 L-V): Tarde (`T`)
  - Días 5..6 (Semana 1 S-D): Descanso (`D`)
  - Días 7..13 (Semana 2 L-D): Noche (`N`)
  - Días 14..20 (Semana 3 L-D): Descanso (`D`)
  - Días 21..27 (Semana 4 L-D): Mañana (`M`)
  - Días 28..34 (Semana 5 L-D): Descanso (`D`)
  - Días 35..39 (Semana 6 L-V): Tarde (`T`)
  - Días 40..41 (Semana 6 S-D): Descanso (`D`)
  - Días 42..48 (Semana 7 L-D): Noche (`N`)
  - Días 49..55 (Semana 8 L-D): Descanso (`D`)
  - Días 56..60 (Semana 9 L-V): Mañana (`M`)
  - Días 61..62 (Semana 9 S-D): Descanso (`D`)
  - Días 63..69 (Semana 10 L-D): Descanso (`D`)

### Alternativas Consideradas
- **Librería externa como `date-fns` o `moment.js`**: Rechazada porque la Constitución (Principio I) exige Vanilla JS puro sin dependencias externas innecesarias. La API nativa `Date` de JavaScript con operaciones a nivel de medianoche resuelve el problema con 0 bytes de sobrecarga.

---

## 2. Detección en Tiempo Real del Estado "En el Trabajo" (Cruce de Medianoche)

### Decisión
Desarrollar una función `evaluateWorkStatus(now = new Date())` que evalúe tanto el turno del día calendario en curso como el turno del día previo para el intervalo nocturno de madrugada:

```javascript
export function evaluateWorkStatus(now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayShift = getShiftForDate(now);
  
  // Caso 1: Madrugada (00:00 a 05:59:59) -> Comprobar si ayer hubo turno de Noche
  if (currentMinutes < 6 * 60) {
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayShift = getShiftForDate(yesterday);
    if (yesterdayShift.code === 'N') {
      return {
        isAtWork: true,
        statusText: "Está en el trabajo",
        shift: yesterdayShift,
        activeContext: "Turno de Noche (finaliza a las 06:00)"
      };
    }
  }

  // Caso 2: Noche después de las 22:00 (22:00 a 23:59:59)
  if (currentMinutes >= 22 * 60 && todayShift.code === 'N') {
    return {
      isAtWork: true,
      statusText: "Está en el trabajo",
      shift: todayShift,
      activeContext: "Turno de Noche (finaliza a las 06:00)"
    };
  }

  // Caso 3: Mañana (06:00 a 13:59:59)
  if (currentMinutes >= 6 * 60 && currentMinutes < 14 * 60 && todayShift.code === 'M') {
    return {
      isAtWork: true,
      statusText: "Está en el trabajo",
      shift: todayShift,
      activeContext: "Turno de Mañana (06:00 - 14:00)"
    };
  }

  // Caso 4: Tarde (14:00 a 21:59:59)
  if (currentMinutes >= 14 * 60 && currentMinutes < 22 * 60 && todayShift.code === 'T') {
    return {
      isAtWork: true,
      statusText: "Está en el trabajo",
      shift: todayShift,
      activeContext: "Turno de Tarde (14:00 - 22:00)"
    };
  }

  return {
    isAtWork: false,
    statusText: "Fuera de turno",
    shift: todayShift,
    activeContext: todayShift.code === 'D' ? "Día de Descanso" : "Fuera de horario laboral"
  };
}
```

### Razón
- Elimina cualquier ambigüedad en los turnos de noche de 22:00 a 06:00.
- Si un trabajador consulta la app a las 03:00 de la mañana de un martes, el sistema reconoce que el turno que está transcurriendo es el turno de noche del lunes, marcando `"Está en el trabajo"`.

---

## 3. Persistencia de Datos y Metadatos: LocalStorage vs SQLite WASM

### Decisión
Adoptar una arquitectura basada en `StorageAdapter` con implementación nativa en `LocalStorage` (con soporte para copia de seguridad/exportación JSON), en lugar de empaquetar una base de datos SQLite compilada a WebAssembly:

```javascript
export interface StorageService {
  get(key: string): any;
  set(key: string, value: any): void;
  remove(key: string): void;
}
```

### Razón
- **Tamaño de paquete y arranque en frío**: SQLite WASM requiere entre 800 KB y 1.5 MB adicionales de binario WASM, inicialización asíncrona de Web Workers y cabeceras complejas de aislamiento cruzado (`Cross-Origin-Opener-Policy` y `Cross-Origin-Embedder-Policy`) para OPFS (Origin Private File System).
- **Compatibilidad con iOS PWA**: `localStorage` funciona de manera 100% nativa, sincrónica y garantizada en WebKit/Safari iOS al guardar la aplicación en la pantalla de inicio, sin problemas de permisos de sistema de archivos ni overhead de memoria.
- **Volumen de datos**: El ciclo es una fórmula matemática pura de 70 días precalculada en memoria; los metadatos a guardar son ligeros (preferencias del usuario, notas por día, ajustes de visualización). `localStorage` gestiona esto en microsegundos sin latencia.

### Alternativas Consideradas
- **SQLite WASM**: Muy potente para consultas relacionales pesadas, pero excesivamente complejo y pesado para una PWA local de turnos con cero requisitos de SQL relacional complejo.
- **IndexedDB**: Buena opción para almacenamiento binario o grandes volúmenes, pero con API innecesariamente verbosa para configuraciones y notas locales ligeras. La capa `StorageService` permite cambiar el adaptador interno sin alterar el resto del código si en el futuro se requiriese.

---

## 4. Arquitectura PWA para iOS y Entorno Safari Móvil

### Decisión
Configurar un `manifest.webmanifest` moderno junto con las metaetiquetas específicas requeridas por WebKit en iOS, y un Service Worker en modo *Cache-First* para garantizar disponibilidad total offline:

```html
<!-- Meta tags para experiencia nativa iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Kanki">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

### Razón
- `viewport-fit=cover` permite que la aplicación aproveche la pantalla completa de los iPhone modernos (respetando los márgenes de Dynamic Island y la barra inferior de navegación mediante variables CSS `env(safe-area-inset-*)`).
- El Service Worker precachea el shell HTML, CSS, JavaScript modular e iconos FontAwesome, permitiendo abrir la aplicación instantáneamente en modo avión.

---

## 5. Sistema de Diseño iOS con CSS Variables y Glassmorphism

### Decisión
Diseñar un sistema de diseño basado en variables CSS puras (`:root`) que emula la estética de tarjetas widget de iOS (según la referencia visual `reference/dc8cae148e7639a0a857c90ea025fe73.jpg`):

- **Fondo de pantalla**: Tono neutro claro Apple `#F2F2F7` (o `#000000` en modo oscuro).
- **Tarjetas widget**: Superficies translúcidas con desenfoque de fondo:
  ```css
  --ios-card-bg: rgba(255, 255, 255, 0.82);
  --ios-card-blur: blur(24px) saturate(180%);
  --ios-card-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03);
  --ios-border-radius: 22px;
  ```
- **Paleta de turnos funcional**:
  - Mañana (`M`): Ámbar solar cálido (`#FF9500`, fondo suave `#FFF7E6`).
  - Tarde (`T`): Azul zafiro iOS (`#007AFF`, fondo suave `#EBF4FF`).
  - Noche (`N`): Violeta índigo nocturno (`#5856D6`, fondo suave `#F0F0FF`).
  - Descanso (`D`): Verde menta relajante (`#34C759`, fondo suave `#EBFBF0`).
- **Tipografía**: Pila tipográfica del sistema de Apple (`-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui`).
