/**
 * modules/math_core/games/RetroGame.js
 * Implementación de estrategia para juego Retro
 * 
 * [PROTECTED-LOGIC] Juego: Retro (6 de 39)
 * Ver LOGIC.md sección "1.2 RETRO" para parámetros [MATH-VERIFIED]
 * 
 * Reglas:
 *   - 6 números del 1 al 39
 *   - Zona Verde: 90-150
 *   - Suma Ideal: 120
 */

import GameStrategy from './GameStrategy.js';

export class RetroGame extends GameStrategy {
  constructor(gameConfig) {
    super(gameConfig);
    
    // Validar que el config es para Retro
    if (gameConfig.id !== 'retro') {
      throw new Error(`RetroGame requires gameConfig.id='retro', got '${gameConfig.id}'`);
    }
  }

  /**
   * Valida que los números cumplan con las reglas de Retro
   * 
   * Reglas:
   *   1. Exactamente 6 números
   *   2. Todos en rango 1-39
   *   3. Sin duplicados
   *   4. Orden ascendente
   * 
   * @param {number[]} numbers - Array de números a validar
   * @returns {Object} { ok: boolean, error?: string }
   */
  validate(numbers) {
    // Validación 1: Es array
    if (!Array.isArray(numbers)) {
      return { ok: false, error: 'Los números deben ser un array' };
    }

    // Validación 2: Cantidad correcta
    if (numbers.length !== this.config.positions) {
      return { 
        ok: false, 
        error: `Se esperan ${this.config.positions} números, recibidos ${numbers.length}` 
      };
    }

    // Validación 3: Todos son números y están en rango
    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];
      
      if (typeof num !== 'number' || isNaN(num)) {
        return { ok: false, error: `${num} no es un número válido` };
      }
      
      if (num < 1 || num > this.config.maxNumber) {
        return { 
          ok: false, 
          error: `${num} está fuera de rango (1-${this.config.maxNumber})` 
        };
      }
    }

    // Validación 4: Sin duplicados
    const uniqueNumbers = new Set(numbers);
    if (uniqueNumbers.size !== numbers.length) {
      return { ok: false, error: 'Tienes números repetidos' };
    }

    // Validación 5: Orden ascendente
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] <= numbers[i - 1]) {
        return { 
          ok: false, 
          error: 'Los números deben ir en orden ascendente' 
        };
      }
    }

    return { ok: true };
  }

  /**
   * Analiza un conjunto de números
   * 
   * @param {number[]} numbers - Números a analizar
   * @param {Array} historicalDraws - Draws históricos (para futuro análisis)
   * @returns {Object} Análisis completo
   */
  analyze(numbers, historicalDraws = []) {
    // Primero valida
    const validation = this.validate(numbers);
    if (!validation.ok) {
      return {
        gameId: this.id,
        gameName: this.name,
        numbers: numbers,
        valid: false,
        error: validation.error,
        analysis: null
      };
    }

    // Análisis (stub para siguiente fase)
    const analysis = {
      sum: numbers.reduce((a, b) => a + b, 0),
      greenZone: this.getGreenZone(),
      idealSum: this.getIdealSum(),
      parity: this._analyzeParity(numbers),
      frequency: null, // Requiere historicalDraws
      poisson: null    // Requiere historicalDraws
    };

    return {
      gameId: this.id,
      gameName: this.name,
      numbers: numbers,
      valid: true,
      analysis: analysis
    };
  }

  /**
   * Retorna la Zona Verde [MATH-VERIFIED]
   * 
   * LOGIC.md 1.2: zoneMin=90, zoneMax=150
   * Contiene 85% de premios históricos
   * 
   * @returns {Object} { min, max }
   */
  getGreenZone() {
    return {
      min: this.config.zoneMin,  // 90
      max: this.config.zoneMax   // 150
    };
  }

  /**
   * Retorna la Suma Ideal [MATH-VERIFIED]
   * 
   * LOGIC.md 1.2: idealSum = 120 = (21 + 219) / 2
   * Centro teórico del rango de sumas posibles
   * 
   * @returns {number} Suma ideal (120)
   */
  getIdealSum() {
    return this.config.idealSum;  // 120
  }

  /**
   * Analiza la distribución de paridad (pares/impares)
   * 
   * @private
   * @param {number[]} numbers - Números a analizar
   * @returns {Object} { evens, odds, distribution }
   */
  _analyzeParity(numbers) {
    const evens = numbers.filter(n => n % 2 === 0).length;
    const odds = numbers.length - evens;
    
    return {
      evens: evens,
      odds: odds,
      distribution: `${evens} Pares / ${odds} Impares`,
      isIdeal: evens === 3 && odds === 3  // 3P/3I es distribución teórica
    };
  }
}

export default RetroGame;
