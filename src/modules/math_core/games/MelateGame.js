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
    const validation = this.validate(numbers.map(n => Number(n)));
    if (!validation.ok) {
      return { gameId: this.id, valid: false, error: validation.error };
    }

    const nums = numbers.map(n => parseInt(n, 10));
    const totalNumbers = nums.length;
    const sum = calculateSum(nums);
    const evenCount = countEvens(nums);
    const primeCount = countPrimes(nums);
    
    // --- Lógica de Diagnóstico ---
    
    // Parity Status
    let parityStatus = 'warn';
    if (this.config.idealEven?.includes(evenCount)) {
      parityStatus = 'good';
    } else if (this.config.badEven?.includes(evenCount)) {
      parityStatus = 'bad';
    }

    // Prime Status
    // Fallback seguro si la config falla
    const idealPrimes = this.config.idealPrimes || [1, 2, 3]; 
    const isPrimeIdeal = Array.isArray(idealPrimes) && idealPrimes.includes(primeCount);
    
    let primeStatus = 'warn';
    if (isPrimeIdeal) {
      primeStatus = 'good';
    } else if (primeCount > 4 || primeCount < 1) {
      primeStatus = 'bad';
    }

    const lastDraw = historicalDraws.length > 0 ? historicalDraws[0].nums.map(Number) : [];
    const repeatedFromLast = nums.filter(n => lastDraw.includes(n));

    let hasConsecutive = false;
    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i+1] === nums[i] + 1) {
        hasConsecutive = true;
        break;
      }
    }

    const endings = nums.map(n => n % 10);
    const endingCounts = {};
    endings.forEach(x => endingCounts[x] = (endingCounts[x] || 0) + 1);
    const maxEndingRep = Math.max(...Object.values(endingCounts), 0);
    
    const isArithmetic = (() => {
        if(nums.length < 3) return false;
        const diff = nums[1] - nums[0];
        for(let i = 2; i < nums.length; i++) {
            if(nums[i] - nums[i-1] !== diff) return false;
        }
        return true;
    })();

    const hotNumbers = [];
    const coldNumbers = [];
    // (La lógica de hot/cold se simplifica aquí, se puede expandir después)

    const diagnostics = {
      sum: {
        value: sum,
        min: this.config.minSum,
        max: this.config.maxSum,
        zoneMin: this.config.zoneMin,
        zoneMax: this.config.zoneMax
      },
      parity: {
        even: evenCount,
        odd: totalNumbers - evenCount,
        status: parityStatus,
        trendPct: 0 // Placeholder
      },
      primes: {
        count: primeCount,
        status: primeStatus,
        list: stats.PRIMES.values()
      },
      repetition: {
        hasRepetition: repeatedFromLast.length > 0,
        numbers: repeatedFromLast
      },
      consecutive: {
        hasConsecutive: hasConsecutive,
        historicalPct: 40 // Placeholder
      },
      terminations: {
        maxRep: maxEndingRep
      },
      structure: {
        clean: !isArithmetic, // Placeholder para una lógica más compleja
        message: isArithmetic ? 'Secuencia aritmética detectada.' : ''
      },
      mix: {
        hot: hotNumbers.length,
        cold: coldNumbers.length
      },
      hotNumbers,
      coldNumbers
    };

    // --- Lógica de Historial y Frecuencia (existente) ---
    
    const normalizeDraw = (draw) => {
      if (!draw) return { nums: [], date: null };
      if (Array.isArray(draw)) return { nums: draw.map(d => Number(d)), date: null };
      const candidate = draw.nums || draw.numbers || [];
      const numsArr = Array.isArray(candidate) ? candidate.map(d => Number(d)) : [];
      const dateRaw = draw.fecha || draw.date || null;
      return { nums: numsArr, date: dateRaw };
    };

    const inputSet = new Set(nums);
    const totalHistorical = historicalDraws.length;
    const matchHistory = { tercia: [], cuarteta: [], quinteta: [] };

    historicalDraws.forEach((rawDraw) => {
      const { nums: drawNums, date } = normalizeDraw(rawDraw);
      if (!drawNums || drawNums.length === 0) return;
      
      const matched = drawNums.filter(n => inputSet.has(n));
      const hits = matched.length;
      const rec = { nums: matched.sort((a,b)=>a-b), date };

      if (hits === 3) matchHistory.tercia.push(rec);
      else if (hits === 4) matchHistory.cuarteta.push(rec);
      else if (hits === 5) matchHistory.quinteta.push(rec);
    });

    return {
      gameId: this.id,
      gameName: this.name,
      numbers: nums,
      valid: true,
      diagnostics: diagnostics, // Objeto anidado
      matchHistory: matchHistory,
      meta: { historicalCount: totalHistorical }
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
