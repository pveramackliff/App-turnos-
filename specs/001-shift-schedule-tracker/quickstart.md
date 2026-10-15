# Quickstart: Validación y Ejecución de Kanki PWA

**Feature**: `001-shift-schedule-tracker`  
**Date**: 2026-10-15  

---

## 1. Requisitos Previos

- **Node.js**: v18.0.0 o superior
- **NPM**: v9.0.0 o superior
- **Navegador**: Safari (iOS / macOS) o Chrome/Edge/Firefox moderno

---

## 2. Configuración y Ejecución del Entorno

```bash
# 1. Instalar dependencias del proyecto (Vite, FontAwesome, Vitest)
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev

# 3. Ejecutar pruebas unitarias del motor de turnos
npm run test
```

El servidor local de Vite se ejecutará típicamente en `http://localhost:5173/`.

---

## 3. Escenarios de Validación de Criterios de Éxito

### Escenario 1: Validación del Día Ancla (9 de Marzo de 2026)
- **Acción**: Navegar en el calendario a `Marzo 2026` y seleccionar el `9 de marzo`.
- **Resultado Esperado**:
  - Día 1 del ciclo de 70 días (Semana 1).
  - Turno: **Tarde** (`14:00 - 22:00`).
  - Código: `T`.
  - Tarjeta de detalle confirma: "Semana 1 (Día 1 de 70) - Turno de Tarde".

### Escenario 2: Validación de la Semana 2 (Turno Nocturno Completo)
- **Acción**: Consultar del 16 al 22 de marzo de 2026.
- **Resultado Esperado**:
  - Los 7 días (Lunes 16 a Domingo 22) muestran la insignia violeta de **Noche** (`N`, `22:00 - 06:00`).

### Escenario 3: Cruce de Medianoche en Turno de Noche
- **Acción**: Evaluar el estado a las `03:00` del martes 17 de marzo de 2026.
- **Resultado Esperado**:
  - El indicador activo muestra con brillo: **"Está en el trabajo"**.
  - Reconoce el turno de Noche iniciado el lunes 16 a las 22:00.

### Escenario 4: Fin de Turno y Estado Inactivo
- **Acción**: Evaluar a las `06:01` del martes 17 de marzo de 2026.
- **Resultado Esperado**:
  - El distintivo cambia a **"Fuera de turno"**.

### Escenario 5: Navegación de Meses y Retorno Rápido
- **Acción**: Avanzar 6 meses hacia adelante en el calendario y pulsar el botón **"Hoy"**.
- **Resultado Esperado**:
  - El calendario regresa de inmediato al mes en curso, enfocando visualmente el día actual.

### Escenario 6: Instalación PWA y Disponibilidad Offline
- **Acción**: Activar "Modo Avión" o emular Offline en DevTools.
- **Resultado Esperado**:
  - La aplicación carga sin errores de red, sirviendo el shell, iconos FontAwesome y scripts desde el Service Worker.
