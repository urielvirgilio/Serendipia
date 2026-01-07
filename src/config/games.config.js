/**
 * config/games.config.js
 * Configuración de juegos de lotería soportados
 * [PROTECTED-LOGIC] [GAME-CONFIG-LOCKED]
 * 
 * Versión: 38.2 (Marketing Edition)
 * Ver LOGIC.md sección "1. Configuración de Juegos" para detalles.
 * 
 * RESTRICCIÓN: No cambiar parámetros sin aprobación de Tech Lead.
 */

// ============================================
// JUEGO: MELATE (1.1)
// Parámetros según LOGIC.md
// ============================================

const MELATE = {
  id: 'melate',
  name: 'Melate',
  displayName: 'Melate (México)',
  positions: 6,                           // count = 6 números
  maxNumber: 56,                          // rango 1-56
  minNumber: 1,
  minSum: 21,                             // suma teórica mínima: 1+2+3+4+5+6
  maxSum: 321,                            // suma teórica máxima: 51+52+53+54+55+56
  idealSum: 171,                          // centro teórico: (21+321)/2
  zoneMin: 120,                           // [MATH-VERIFIED] Zona Verde
  zoneMax: 220,                           // [MATH-VERIFIED] Zona Verde
  guaranteedMinimum: 30000000,            // bolsa mínima garantizada ($30M)
  idealParityText: '3 Pares / 3 Impares', // distribución teórica (33% probabilidad)
  idealPrimes: 3,                         // cantidad ideal de primos
  drawDaySpanish: 'Martes, Jueves, Sábado',
  drawDayEnglish: 'Tuesday, Thursday, Saturday',
  description: 'Lotería Nacional Mexicana - 6 números de 56',
  enabled: true
};

// ============================================
// JUEGO: RETRO (1.2)
// Parámetros según LOGIC.md
// ============================================

const RETRO = {
  id: 'retro',
  name: 'Retro',
  displayName: 'Retro (México)',
  positions: 6,                           // count = 6 números
  maxNumber: 39,                          // rango 1-39
  minNumber: 1,
  minSum: 21,                             // suma teórica mínima: 1+2+3+4+5+6
  maxSum: 219,                            // suma teórica máxima: 34+35+36+37+38+39
  idealSum: 120,                          // centro teórico: (21+219)/2
  zoneMin: 90,                            // [MATH-VERIFIED] Zona Verde
  zoneMax: 150,                           // [MATH-VERIFIED] Zona Verde
  guaranteedMinimum: 5000000,             // bolsa mínima garantizada ($5M)
  idealParityText: '3 Pares / 3 Impares', // distribución teórica (33% probabilidad)
  idealPrimes: 3,                         // cantidad ideal de primos
  drawDaySpanish: 'Diario',
  drawDayEnglish: 'Daily',
  description: 'Lotería Retro - 6 números de 39',
  enabled: true
};

// ============================================
// JUEGO: CHISPAZO (1.3)
// Parámetros según LOGIC.md
// ============================================

const CHISPAZO = {
  id: 'chispazo',
  name: 'Chispazo',
  displayName: 'Chispazo (México)',
  positions: 5,                           // count = 5 números (NO 6)
  maxNumber: 28,                          // rango 1-28
  minNumber: 1,
  minSum: 15,                             // suma teórica mínima: 1+2+3+4+5
  maxSum: 130,                            // suma teórica máxima: 24+25+26+27+28
  idealSum: 72.5,                         // centro teórico: (15+130)/2
  zoneMin: 50,                            // [MATH-VERIFIED] Zona Verde
  zoneMax: 100,                           // [MATH-VERIFIED] Zona Verde
  guaranteedMinimum: 0,                   // no aplica acumulado de bolsa
  idealParityText: '2 Pares / 3 Impares', // distribución diferente (32% probabilidad)
  idealPrimes: 3,                         // cantidad ideal de primos
  drawDaySpanish: 'Diario',
  drawDayEnglish: 'Daily',
  description: 'Chispazo - 5 números de 28',
  enabled: true
};

// ============================================
// JUEGO: TRIS (1.4) - STUB
// Estructura especial: No se analiza por suma
// Implementación diferida para Sprint 3
// ============================================

const TRIS = {
  id: 'tris',
  name: 'TRIS',
  displayName: 'TRIS (México)',
  positions: 5,
  maxNumber: 9,
  minNumber: 0,
  drawDaySpanish: 'Diario',
  drawDayEnglish: 'Daily',
  description: 'TRIS - 5 dígitos de 0-9',
  enabled: false  // Stub para Sprint 3
};

// ============================================
// JUEGO: GATO (1.5) - STUB
// Estructura especial: Grid 3x3
// Implementación diferida para Sprint 3
// ============================================

const GATO = {
  id: 'gato',
  name: 'Gato',
  displayName: 'Gato (Juego)',
  positions: 9,
  maxNumber: 5,
  minNumber: 1,
  gridSize: 3,      // 3x3 grid
  drawDaySpanish: 'Experimental',
  drawDayEnglish: 'Experimental',
  description: 'Juego en grilla 3x3 - Números 1-5',
  enabled: false    // Stub para Sprint 3
};

// ============================================
// EXPORTAR CONFIGURACIÓN GLOBAL
// ============================================

export const GAME_CONFIG = {
  melate: MELATE,
  retro: RETRO,
  chispazo: CHISPAZO,
  tris: TRIS,
  gato: GATO
};

export default GAME_CONFIG;
