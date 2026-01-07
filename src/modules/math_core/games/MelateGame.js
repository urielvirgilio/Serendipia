/**
 * modules/math_core/games/MelateGame.js
 * Implementación de estrategia para juego Melate
 * 
 * [PROTECTED-LOGIC] Juego Mexicano: 6 números de 56
 * Ver LOGIC.md sección "1.1 Melate"
 * Ver LOGIC.md sección "3.1 Validación de Entrada"
 */

import GameStrategy from './GameStrategy.js';
import stats, { calculateSum, countEvens, countPrimes } from '../statistics.js';

export class MelateGame extends GameStrategy {
  constructor(gameConfig) {
    super(gameConfig);
  }
  
  /**
   * Valida números específicos para Melate
   * 
   * Validaciones (LOGIC.md sección 3.1):
   * A) Rango: 1-56
   * B) No repeticiones (unique_set.length === 6)
   * C) Ordenamiento ascendente
   * D) Cantidad: exactamente 6 números
   * 
   * @param {number[]} numbers - Array de números a validar
   * @returns {Object} { ok: boolean, error?: string }
   */
  validate(numbers) {
    // Validación de entrada básica
    if (!Array.isArray(numbers)) {
      return { ok: false, error: 'Los números deben ser un array' };
    }
    
    // A) Validar cantidad de números
    const expectedCount = this.config.positions;
    if (numbers.length !== expectedCount) {
      return { 
        ok: false, 
        error: `Se esperan ${expectedCount} números, recibidos ${numbers.length}` 
      };
    }
    
    // B) Validar rango (1-56)
    const { minNumber, maxNumber } = this.config;
    for (const num of numbers) {
      if (typeof num !== 'number' || isNaN(num)) {
        return { ok: false, error: `'${num}' no es un número válido` };
      }
      if (num < minNumber || num > maxNumber) {
        return { 
          ok: false, 
          error: `${num} está fuera de rango (${minNumber}-${maxNumber})` 
        };
      }
    }
    
    // C) Validar sin duplicados
    const unique = new Set(numbers);
    if (unique.size !== expectedCount) {
      return { ok: false, error: 'Tienes números repetidos' };
    }
    
    // D) Validar ordenamiento ascendente
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] >= numbers[i + 1]) {
        return { 
          ok: false, 
          error: `Los números deben ir en orden ascendente (posición ${i}: ${numbers[i]} >= ${numbers[i + 1]})` 
        };
      }
    }
    
    // Todas las validaciones pasaron
    return { ok: true };
  }
  
  /**
   * Analiza números para Melate con todos los algoritmos
   * 
   * @param {number[]} numbers - Números a analizar
   * @param {number[][]} historicalDraws - Draws históricos para comparación
   * @returns {Object} Análisis completo
   */
  analyze(numbers, historicalDraws = []) {
    // Validar primero y forzar tipo numérico
    const validation = this.validate(numbers.map(n => Number(n)));

    if (!validation.ok) {
      return {
        gameId: this.id,
        gameName: this.name,
        numbers,
        valid: false,
        error: validation.error
      };
    }

    // Forzar enteros y normalizar entrada
    const nums = numbers.map(n => parseInt(n, 10));
    const totalNumbers = nums.length;
    const sum = calculateSum(nums);
    const evenCount = countEvens(nums);
    const primeCount = countPrimes(nums);

    // Normalizar cada sorteo histórico a formato { nums: number[], date: string|null }
    const normalizeDraw = (draw) => {
      if (!draw) return { nums: [], date: null };
      if (Array.isArray(draw)) return { nums: draw.map(d => Number(d)), date: null };
      const candidate = draw.nums || draw.numbers || draw.draw || draw.drawNumbers || draw.values;
      const numsArr = Array.isArray(candidate) ? candidate.map(d => Number(d)) : (Array.isArray(draw) ? draw.map(d => Number(d)) : []);
      const dateRaw = draw.fecha || draw.date || draw.timestamp || draw.t || null;
      const date = dateRaw ? (new Date(dateRaw)).toString() : null;
      return { nums: numsArr, date };
    };

    const inputSet = new Set(nums);
    const totalHistorical = Array.isArray(historicalDraws) ? historicalDraws.length : 0;
    const lastN = 20;
    const recentDraws = Array.isArray(historicalDraws) ? historicalDraws.slice(Math.max(0, totalHistorical - lastN)) : [];

    const freqMap = {};
    const lastSeenIndex = {}; // number -> last index seen

    // Match history grouped
    const matchHistory = { tercia: [], cuarteta: [], quinteta: [], sexteta: [] };

    (historicalDraws || []).forEach((rawDraw, idx) => {
      const { nums: drawNums, date } = normalizeDraw(rawDraw);
      if (!drawNums || drawNums.length === 0) return;

      // Update frequency map and last seen
      drawNums.forEach(n => {
        freqMap[n] = (freqMap[n] || 0) + 1;
        lastSeenIndex[n] = idx;
      });

      // Compute intersection (only matched numbers)
      const matched = drawNums.filter(n => inputSet.has(n));
      const hits = matched.length;
      if (hits >= 3) {
        const rec = { nums: matched.slice().sort((a,b)=>a-b), drawIndex: idx, date };
        if (hits === 3) matchHistory.tercia.push(rec);
        else if (hits === 4) matchHistory.cuarteta.push(rec);
        else if (hits === 5) matchHistory.quinteta.push(rec);
        else if (hits >= 6) matchHistory.sexteta.push(rec);
      }
    });

    // Recent frequency for input numbers in lastN draws
    const recentFreq = {};
    recentDraws.forEach(rawDraw => {
      const { nums: drawNums } = normalizeDraw(rawDraw);
      drawNums.forEach(n => { if (inputSet.has(n)) recentFreq[n] = (recentFreq[n] || 0) + 1; });
    });

    // Hot / Cold classification and arrays for UI
    const hotNumbers = [];
    const coldNumbers = [];
    nums.forEach(n => {
      const seen = recentFreq[n] || 0;
      const pct = recentDraws.length === 0 ? 0 : (seen / recentDraws.length);
      if (pct >= stats.FREQUENCY_HOT_THRESHOLD) hotNumbers.push({ number: n, frequency: +(pct * 100).toFixed(1) });
      if (pct <= stats.FREQUENCY_COLD_THRESHOLD) {
        const drawsAgo = (typeof lastSeenIndex[n] === 'number') ? (totalHistorical - lastSeenIndex[n] - 1) : totalHistorical;
        coldNumbers.push({ number: n, drawsAgo });
      }
    });

    // Prize distribution top numbers
    const freqEntries = Object.keys(freqMap).map(k => ({ num: parseInt(k, 10), count: freqMap[k] }));
    freqEntries.sort((a,b) => b.count - a.count);
    const prizeDistribution = { labels: freqEntries.slice(0,10).map(e => String(e.num)), values: freqEntries.slice(0,10).map(e => e.count) };

    // Bernoulli: evenness per position -> produce series as [{x: 'P1', y: 0.5}, ...]
    const posCount = this.config.positions || nums.length;
    const positionEven = new Array(posCount).fill(0);
    let considered = 0;
    (historicalDraws || []).forEach(rawDraw => {
      const { nums: drawNums } = normalizeDraw(rawDraw);
      if (!drawNums || drawNums.length < posCount) return;
      considered++;
      for (let i = 0; i < posCount; i++) { if (drawNums[i] % 2 === 0) positionEven[i]++; }
    });
    const bernoulliData = Array.from({length: posCount}, (_, i) => ({ x: `P${i+1}`, y: (considered === 0 ? 0 : +(positionEven[i] / considered).toFixed(3)) }));

    return {
      gameId: this.id,
      gameName: this.name,
      numbers: nums,
      valid: true,
      sum,
      totalNumbers,
      evenCount,
      primeCount,
      frequency: freqMap,
      prizeDistribution,
      bernoulli: bernoulliData,
      bernoulliData,
      hotNumbers,
      coldNumbers,
      matchHistory,
      meta: { historicalCount: totalHistorical, recentConsidered: recentDraws.length }
    };
  }
  
  /**
   * Retorna los límites de la Zona Verde para Melate
   * [MATH-VERIFIED] Según LOGIC.md sección 1.1
   * 
   * La Zona Verde (120-220) contiene el 85% de los premios históricos.
   * 
   * @returns {Object} { min, max }
   */
  getGreenZone() {
    return {
      min: this.config.zoneMin,
      max: this.config.zoneMax
    };
  }
  
  /**
   * Retorna la suma ideal de Melate
   * [MATH-VERIFIED] Según LOGIC.md sección 1.1
   * 
   * La suma ideal teórica es 171 = (21 + 321) / 2
   * 
   * @returns {number} Suma ideal
   */
  getIdealSum() {
    return this.config.idealSum;
  }
}

export default MelateGame;
