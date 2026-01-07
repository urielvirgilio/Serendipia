/**
 * modules/math_core/games/GameStrategy.js
 * Clase base para estrategia de juegos de lotería
 * 
 * [PROTECTED] Implementa Strategy Pattern
 * Ver ARCH.md sección "3.1 Strategy Pattern: Games"
 * 
 * Todos los juegos (Melate, Retro, Chispazo, TRIS, Gato) heredan de esta clase.
 */

export class GameStrategy {
  constructor(gameConfig) {
    if (!gameConfig) {
      throw new Error('gameConfig es requerido');
    }
    this.config = gameConfig;
    this.id = gameConfig.id;
    this.name = gameConfig.name;
  }
  
  /**
   * Valida que los números cumplan con las reglas del juego
   * Debe ser implementado por subclases
   * 
   * @param {number[]} numbers - Array de números a validar
   * @returns {Object} { ok: boolean, error?: string }
   */
  validate(numbers) {
    throw new Error('validate() debe ser implementado en subclase');
  }
  
  /**
   * Analiza un conjunto de números usando todos los algoritmos
   * Debe ser implementado por subclases
   * 
   * @param {number[]} numbers - Números a analizar
   * @param {number[][]} historicalDraws - Draws históricos para comparación
   * @returns {Object} Análisis completo
   */
  analyze(numbers, historicalDraws = []) {
    throw new Error('analyze() debe ser implementado en subclase');
  }
  
  /**
   * Retorna la configuración del juego
   * 
   * @returns {Object} Configuración del juego
   */
  getConfig() {
    return this.config;
  }
  
  /**
   * Retorna información legible del juego
   * 
   * @returns {string} Descripción del juego
   */
  toString() {
    return `GameStrategy(${this.id}: ${this.name})`;
  }

  /**
   * Genera números aleatorios para el juego
   * @param {string} mode - 'smart'|'omega' etc
   * @returns {number[]} Array de números generados (ordenados)
   */
  generateRandom(mode = 'smart') {
    const positions = this.config.positions || 6;
    const min = this.config.minNumber || 1;
    const max = this.config.maxNumber || 56;
    const zoneMin = this.config.zoneMin || (min * positions);
    const zoneMax = this.config.zoneMax || (max * positions / 2);

    const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    const tryGenerate = () => {
      const set = new Set();
      while (set.size < positions) {
        set.add(randInt(min, max));
      }
      const arr = Array.from(set).sort((x, y) => x - y);
      return arr;
    };

    // Smart: try to bias towards zone by re-rolling up to attempts
    if (mode === 'smart') {
      const maxAttempts = 200;
      for (let i = 0; i < maxAttempts; i++) {
        const candidate = tryGenerate();
        const sum = candidate.reduce((a, b) => a + b, 0);
        if (sum >= zoneMin && sum <= zoneMax) return candidate;
      }
      // fallback: return last candidate
      return tryGenerate();
    }

    // Omega: reserved for advanced strategy (for now same as smart)
    if (mode === 'omega') {
      return this.generateRandom('smart');
    }

    // Default: pure random
    return tryGenerate();
  }
}

export default GameStrategy;
