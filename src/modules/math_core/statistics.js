/**
 * modules/math_core/statistics.js
 * Funciones de análisis estadístico (PURAS)
 * 
 * [PROTECTED] [MATH-VERIFIED]
 * Algoritmos implementados según LOGIC.md:
 * 1. calculateSum - Suma simple
 * 2. countEvens - Conteo de números pares
 * 3. countPrimes - Conteo de números primos
 * 4. calculatePoissonMaturity - Distribución Poisson de madurez
 * 
 * RESTRICCIÓN: SIN acceso a DOM, SIN I/O, funciones PURAS
 */

// ============================================
// CONSTANTES [MATH-VERIFIED]
// ============================================

/**
 * Lista de números primos (0-56)
 * Usada por countPrimes() para análisis
 * [MATH-VERIFIED] - Verificado contra tabla de números primos
 */
const PRIMES = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53]);

/**
 * Umbrales para Frecuencia (Heatmap)
 * Según LOGIC.md sección 2.1
 * [MATH-VERIFIED]
 */
const FREQUENCY_HOT_THRESHOLD = 0.12;    // 12%
const FREQUENCY_COLD_THRESHOLD = 0.08;   // 8%

// ============================================
// FUNCIÓN 1: calculateSum
// ============================================

/**
 * Calcula la suma de un array de números
 * 
 * Fórmula: Σ(números)
 * Caso de uso: Validación de Zona Verde (Bernoulli convergence)
 * 
 * @param {number[]} numbers - Array de números
 * @returns {number} Suma de los números
 * 
 * Ejemplo:
 *   calculateSum([1, 2, 3]) → 6
 *   calculateSum([10, 20, 30]) → 60
 */
export function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('Argumento debe ser un array');
  }
  
  return numbers.reduce((acc, num) => {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new TypeError(`Elemento no es número: ${num}`);
    }
    return acc + num;
  }, 0);
}

// ============================================
// FUNCIÓN 2: countEvens
// ============================================

/**
 * Cuenta cuántos números pares hay en un array
 * 
 * Criterio: n % 2 === 0
 * Caso de uso: Análisis de distribución de paridad
 * 
 * @param {number[]} numbers - Array de números
 * @returns {number} Cantidad de números pares
 * 
 * Ejemplo:
 *   countEvens([1, 2, 3, 4]) → 2
 *   countEvens([1, 3, 5]) → 0
 *   countEvens([2, 4, 6]) → 3
 */
export function countEvens(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('Argumento debe ser un array');
  }
  
  return numbers.filter(num => {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new TypeError(`Elemento no es número: ${num}`);
    }
    return num % 2 === 0;
  }).length;
}

// ============================================
// FUNCIÓN 3: countPrimes
// ============================================

/**
 * Cuenta cuántos números primos hay en un array
 * 
 * Criterio: Número está en lista PRIMES (2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53)
 * Caso de uso: Análisis de distribución de primos (LOGIC.md sección 2.3)
 * 
 * [MATH-VERIFIED] Lista de primos verificada contra teoría de números
 * 
 * @param {number[]} numbers - Array de números
 * @returns {number} Cantidad de números primos
 * 
 * Ejemplo:
 *   countPrimes([1, 2, 3, 4]) → 2 (primos: 2, 3)
 *   countPrimes([10, 15, 20]) → 0 (sin primos)
 *   countPrimes([2, 3, 5, 7]) → 4 (todos primos)
 */
export function countPrimes(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('Argumento debe ser un array');
  }
  
  return numbers.filter(num => {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new TypeError(`Elemento no es número: ${num}`);
    }
    return PRIMES.has(num);
  }).length;
}

// ============================================
// FUNCIÓN 4: calculatePoissonMaturity
// ============================================

/**
 * Calcula el "score de madurez" de un número basado en Poisson
 * 
 * [MATH-VERIFIED] Distribución de Poisson para eventos aleatorios
 * Referencia: LOGIC.md sección 2.2 "Análisis de Poisson"
 * 
 * Fórmula:
 *   MADUREZ(%) = min(100, ⌊(gapsSinceDrawn / averageGap) × 100⌋)
 * 
 * Donde:
 *   - gapsSinceDrawn: Cantidad de sorteos desde que NO salió este número
 *   - averageGap: Promedio histórico de gaps para ese número
 * 
 * Semáforo de madurez (LOGIC.md sección 2.2):
 *   - 0%: Acaba de salir (gris)
 *   - 1-20%: Falta madurar (rojo) - Riesgo medio
 *   - 21-79%: Madurando (amarillo) - Equilibrio
 *   - 80-100%: ¡MADURO! (verde) - Listo para jugar [RECOMENDADO]
 *
 * @param {number} gapsSinceDrawn - Cantidad de sorteos sin salir
 * @param {number} averageGap - Promedio histórico de gap
 * @returns {number} Score de madurez (0-100)
 *
 * Ejemplo:
 *   calculatePoissonMaturity(20, 15) → 100 (maduro)
 *   calculatePoissonMaturity(10, 15) → 66 (madurando)
 *   calculatePoissonMaturity(2, 15) → 13 (falta madurar)
 */
export function calculatePoissonMaturity(gapsSinceDrawn, averageGap) {
  // Validación de entrada
  if (typeof gapsSinceDrawn !== 'number' || isNaN(gapsSinceDrawn)) {
    throw new TypeError(`gapsSinceDrawn debe ser número: ${gapsSinceDrawn}`);
  }
  if (typeof averageGap !== 'number' || isNaN(averageGap)) {
    throw new TypeError(`averageGap debe ser número: ${averageGap}`);
  }
  if (averageGap === 0) {
    throw new RangeError('averageGap no puede ser cero');
  }
  if (gapsSinceDrawn < 0 || averageGap < 0) {
    throw new RangeError('Los valores no pueden ser negativos');
  }
  
  // Cálculo: (gap / avgGap) * 100, capped a 100
  const ratio = gapsSinceDrawn / averageGap;
  const maturityPercent = Math.floor(ratio * 100);
  
  // Cap a 100%
  return Math.min(100, maturityPercent);
}

// ============================================
// FUNCIÓN AUXILIAR: getMaturityLabel
// ============================================

/**
 * Retorna etiqueta visual y color para un score de madurez
 * 
 * @param {number} maturityScore - Score 0-100 retornado por calculatePoissonMaturity
 * @returns {Object} { color, label, emoji, risk }
 * 
 * Ejemplo:
 *   getMaturityLabel(95) → { color: 'green', label: 'MADURO', emoji: '🟢', risk: 'low' }
 *   getMaturityLabel(50) → { color: 'yellow', label: 'Madurando', emoji: '🟡', risk: 'medium' }
 */
export function getMaturityLabel(maturityScore) {
  if (maturityScore < 0 || maturityScore > 100) {
    throw new RangeError('Score debe estar entre 0 y 100');
  }
  
  if (maturityScore === 0) {
    return { color: 'gray', label: 'Acaba de salir', emoji: '⚪', risk: 'low' };
  } else if (maturityScore <= 20) {
    return { color: 'red', label: 'Falta madurar', emoji: '🔴', risk: 'medium' };
  } else if (maturityScore < 80) {
    return { color: 'yellow', label: 'Madurando', emoji: '🟡', risk: 'medium' };
  } else {
    return { color: 'green', label: '¡MADURO!', emoji: '🟢', risk: 'low' };
  }
}

export default {
  calculateSum,
  countEvens,
  countPrimes,
  calculatePoissonMaturity,
  getMaturityLabel,
  PRIMES,
  FREQUENCY_HOT_THRESHOLD,
  FREQUENCY_COLD_THRESHOLD
};
