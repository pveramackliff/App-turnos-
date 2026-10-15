# Kanki Turnos

PWA mobile-first para el seguimiento y control visual de turnos de trabajo rotativos.

## Caracteristicas

- **Ciclo de 70 dias (10 semanas)**: Calculo automatico y continuo de turnos (Mañana, Tarde, Noche y Descanso) alineado de lunes a domingo.
- **Estado en tiempo real**: Indicador en vivo de jornada laboral (*Esta en el trabajo* / *Fuera de turno*) con soporte para cruce de medianoche.
- **Calendario mensual interactivo**: Visualizacion de turnos por dia y panel de detalle con horarios de trabajo y desplazamientos (salida y llegada a casa).
- **Turnos de fin de semana (12h)**: Gestion automatica de horarios extendidos para turnos de mañanas y noches en sabado y domingo.
- **Modo oscuro persistente**: Selector de tema claro/oscuro con guardado local de preferencias.
- **PWA e instalacion local**: Instalable en pantalla de inicio (iOS / Android) y soporte offline mediante Service Worker.

## Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Compilar para produccion (carpeta dist)
npm run build

# Ejecutar tests unitarios
npm test
```

## Stack Tecnologico

- **Frontend**: Vanilla JavaScript (ES Modules), HTML5 y CSS3 nativo (Variables y Glassmorphism iOS).
- **Tipografia**: Google Fonts (Alata y Dongle).
- **Herramientas**: Vite y Vitest.
