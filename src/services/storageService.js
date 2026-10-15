/**
 * Servicio de almacenamiento local con respaldo en memoria para PWA.
 * Cumple con el contrato contracts/storage.contract.md.
 */

const SETTINGS_KEY = 'kanki_user_settings_v1';

export class StorageService {
  constructor() {
    this.memoryFallback = new Map();
    this.isLocalStorageAvailable = this.checkAvailability();
  }

  /**
   * Verifica la disponibilidad de localStorage (por ejemplo, en navegación privada de Safari)
   * @private
   */
  checkAvailability() {
    try {
      const testKey = '__kanki_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      console.warn('LocalStorage no disponible. Utilizando memoria volátil como respaldo.');
      return false;
    }
  }

  /**
   * Obtiene un valor desde el almacenamiento
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  get(key, defaultValue = null) {
    if (this.isLocalStorageAvailable) {
      try {
        const item = window.localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
      } catch (err) {
        console.error(`Error leyendo clave ${key} de localStorage:`, err);
        return defaultValue;
      }
    }
    return this.memoryFallback.has(key) ? this.memoryFallback.get(key) : defaultValue;
  }

  /**
   * Guarda un valor serializado en JSON
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return;
      } catch (err) {
        console.error(`Error escribiendo clave ${key} en localStorage:`, err);
      }
    }
    this.memoryFallback.set(key, value);
  }

  /**
   * Elimina una clave del almacenamiento
   * @param {string} key
   */
  remove(key) {
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.removeItem(key);
      } catch (err) {
        console.error(`Error eliminando clave ${key} de localStorage:`, err);
      }
    }
    this.memoryFallback.delete(key);
  }

  /**
   * Obtiene la configuración de preferencias de usuario
   * @returns {object}
   */
  getUserSettings() {
    return this.get(SETTINGS_KEY, {
      themeMode: 'system',
      dayNotes: {},
      showLiveTimer: true
    });
  }

  /**
   * Actualiza parcialmente la configuración de usuario
   * @param {object} updates
   */
  saveUserSettings(updates) {
    const current = this.getUserSettings();
    const updated = { ...current, ...updates };
    this.set(SETTINGS_KEY, updated);
    return updated;
  }
}

export const storageService = new StorageService();
