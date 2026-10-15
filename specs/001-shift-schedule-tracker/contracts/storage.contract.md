# Contract: Adaptador de Almacenamiento Local (Storage Contract)

**Module**: `src/services/storageService.js`  
**Purpose**: Persistencia de metadatos, notas locales y preferencias con compatibilidad total PWA.

---

## 1. Interfaz del Servicio

```javascript
export class StorageService {
  /**
   * Obtiene un valor tipado desde el almacenamiento local
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  get(key, defaultValue = null) {}

  /**
   * Guarda un valor serializado en JSON
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {}

  /**
   * Elimina una clave del almacenamiento
   * @param {string} key
   */
  remove(key) {}

  /**
   * Obtiene la configuración de preferencias de usuario
   * @returns {UserSettings}
   */
  getUserSettings() {}

  /**
   * Actualiza parcialmente la configuración de usuario
   * @param {Partial<UserSettings>} updates
   */
  saveUserSettings(updates) {}
}
```

## 2. Invariantes
- Los accesos a `localStorage` deben estar encapsulados en bloques `try/catch` para manejar entornos restringidos de navegación privada en iOS Safari.
- Si `localStorage` no estuviese disponible, debe realizar fallback transparente a un almacén en memoria en tiempo de ejecución para evitar excepciones.
