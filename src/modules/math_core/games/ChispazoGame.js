/**
 * modules/math_core/games/ChispazoGame.js
 * Implementación de estrategia para juego Chispazo
 * 
 * [PROTECTED-LOGIC] Juego: Chispazo (5 de 28)
 * Ver LOGIC.md sección "1.3 CHISPAZO" para parámetros [MATH-VERIFIED]
 * 
 * NOTA CRÍTICA: Chispazo usa 5 números, NO 6 como Melate o Retro
 * 
 * Reglas:
 *   - 5 números del 1 al 28 (¡NO 6!)
 *   - Zona Verde: 50-100
 *   - Suma Ideal: 72.5
 *   - Paridad ideal: 2 Pares / 3 Impares
 */

import GameStrategy from './GameStrategy.js';

export class ChispazoGame extends GameStrategy {
  constructor(gameConfig) {
    super(gameConfig);
    
    // Validar que el config es para Chispazo
    if (gameConfig.id !== 'chispazo') {
      throw new Error(`ChispazoGame requires gameConfig.id='chispazo', got '${gameConfig.id}'`);
    }
    
    // Validar que está configurado para 5 posiciones
    if (gameConfig.positions !== 5) {
      throw new Error(`ChispazoGame requires 5 positions, got ${gameConfig.positions}`);
    }
  }

  /**
   * Valida que los números cumplan con las reglas de Chispazo
   * 
   * Reglas Específicas para Chispazo:
   *   1. Exactamente 5 números (¡NO 6!)
   *   2. Todos en rango 1-28
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

    // Validación 2: Cantidad correcta (5, NO 6)
    if (numbers.length !== this.config.positions) {
      return { 
        ok: false, 
        error: `Chispazo requiere ${this.config.positions} números, recibidos ${numbers.length}` 
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
   * @param {number[]} numbers - Números a analizar (5 números para Chispazo)
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
   * LOGIC.md 1.3: zoneMin=50, zoneMax=100
   * Más compacta que Melate/Retro porque usa solo 5 números
   * 
   * @returns {Object} { min, max }
   */
  getGreenZone() {
    return {
      min: this.config.zoneMin,  // 50
      max: this.config.zoneMax   // 100
    };
  }

  /**
   * Retorna la Suma Ideal [MATH-VERIFIED]
   * 
   * LOGIC.md 1.3: idealSum = 72.5 = (15 + 130) / 2
   * Centro teórico del rango de sumas posibles
   * 
   * @returns {number} Suma ideal (72.5)
   */
  getIdealSum() {
    return this.config.idealSum;  // 72.5
  }

  /**
   * Analiza la distribución de paridad (pares/impares)
   * 
   * NOTA: Chispazo tiene distribución ideal diferente
   * Ideal: 2 Pares / 3 Impares (vs 3P/3I en Melate/Retro)
   * 
   * @private
   * @param {number[]} numbers - Números a analizar (5 números)
   * @returns {Object} { evens, odds, distribution }
   */
  _analyzeParity(numbers) {
    const evens = numbers.filter(n => n % 2 === 0).length;
    const odds = numbers.length - evens;
    
    return {
      evens: evens,
      odds: odds,
      distribution: `${evens} Pares / ${odds} Impares`,
      isIdeal: evens === 2 && odds === 3  // 2P/3I es distribución teórica para Chispazo
    };
  }
}

export default ChispazoGame;
