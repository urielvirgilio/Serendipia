/**
 * modules/math_core/validators.js
 * Validaciones de entrada y reglas de negocio
 * 
 * [PROTECTED] Módulo de lógica pura - SIN referencias a DOM
 * 
 * Validaciones implementadas (según LOGIC.md sección 3):
 * - Rango válido (minNumber - maxNumber)
 * - No repetición de números
 * - Cantidad correcta de posiciones
 * - Números enteros positivos
 */

/**
 * Valida que el rango de números sea válido
 * 
 * @param {number[]} numbers - Array de números a validar
 * @param {number} minNumber - Número mínimo permitido
 * @param {number} maxNumber - Número máximo permitido
 * @returns {Object} { ok: boolean, error?: string }
 */
export function validateRange(numbers, minNumber, maxNumber) {
  // STUB - Implementación en siguiente fase
  return { ok: true };
}

/**
 * Valida que no haya números duplicados
 * 
 * @param {number[]} numbers - Array de números a validar
 * @returns {Object} { ok: boolean, error?: string }
 */
export function validateNoDuplicates(numbers) {
  // STUB - Implementación en siguiente fase
  return { ok: true };
}

/**
 * Valida que haya la cantidad correcta de números
 * 
 * @param {number[]} numbers - Array de números a validar
 * @param {number} requiredPositions - Cantidad de posiciones requeridas
 * @returns {Object} { ok: boolean, error?: string }
 */
export function validatePositionCount(numbers, requiredPositions) {
  // STUB - Implementación en siguiente fase
  return { ok: true };
}

/**
 * Validación integral de un conjunto de números
 * 
 * @param {number[]} numbers - Array de números a validar
 * @param {Object} gameRules - Reglas del juego { minNumber, maxNumber, positions }
 * @returns {Object} { ok: boolean, errors: string[] }
 */
export function validateNumbers(numbers, gameRules) {
  // STUB - Implementación en siguiente fase
  return { ok: true, errors: [] };
}

export default {
  validateRange,
  validateNoDuplicates,
  validatePositionCount,
  validateNumbers
};
