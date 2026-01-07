/**
 * modules/web_ui/state.js
 * Gestor de estado global de la aplicación
 * 
 * [PROTECTED] Patrón: State Management (Singleton)
 * Responsabilidad: Centralizar estado de UI, evitar prop drilling
 * 
 * Ver ARCH.md sección "3.2 State Management"
 */

export class State {
  constructor() {
    // Estado de juegos cargados
    this.games = {};
    
    // Juego actualmente seleccionado
    this.activeGame = null;
    
    // Datos del usuario/sesión
    this.userSession = {
      lastAnalysis: null,
      savedAnalyses: []
    };
    
    // Estado de UI
    this.ui = {
      loading: false,
      error: null,
      notifications: []
    };
    
    // Listeners para cambios de estado
    this.listeners = new Set();
  }
  
  /**
   * Registra un listener que se ejecuta cuando el estado cambia
   * 
   * @param {Function} callback - Función a ejecutar en cambios
   * @returns {Function} Función para deregistrar listener
   */
  subscribe(callback) {
    this.listeners.add(callback);
    
    // Retorna función para desuscribirse
    return () => this.listeners.delete(callback);
  }
  
  /**
   * Notifica a todos los listeners de un cambio
   */
  notifyChange() {
    this.listeners.forEach(callback => {
      try {
        callback(this);
      } catch (error) {
        console.error('[State] Error en listener:', error);
      }
    });
  }
  
  /**
   * Actualiza el juego activo
   * 
   * @param {string} gameId - ID del juego a activar
   */
  setActiveGame(gameId) {
    this.activeGame = gameId;
    this.notifyChange();
  }
  
  /**
   * Establece estado de loading
   * 
   * @param {boolean} loading - true si está cargando
   */
  setLoading(loading) {
    this.ui.loading = loading;
    this.notifyChange();
  }
  
  /**
   * Establece mensaje de error
   * 
   * @param {string|null} error - Mensaje de error o null
   */
  setError(error) {
    this.ui.error = error;
    this.notifyChange();
  }
  
  /**
   * Agrega una notificación temporal
   * 
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo: 'info', 'success', 'warning', 'error'
   */
  addNotification(message, type = 'info') {
    this.ui.notifications.push({ message, type, id: Date.now() });
    this.notifyChange();
  }
  
  /**
   * Obtiene snapshot del estado actual
   * 
   * @returns {Object} Copia del estado actual
   */
  getSnapshot() {
    return {
      games: { ...this.games },
      activeGame: this.activeGame,
      userSession: { ...this.userSession },
      ui: { ...this.ui }
    };
  }
}

export default State;
