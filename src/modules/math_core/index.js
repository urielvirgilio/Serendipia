/**
 * modules/math_core/index.js
 * Barril de exportación del módulo math_core
 * 
 * [PROTECTED] Este módulo contiene lógica pura SIN acceso a DOM.
 * Responsabilidad: Cálculos matemáticos y análisis estadístico.
 * 
 * Ver ARCH.md sección "2.2 Módulo: math_core" para detalles.
 */

import * as Statistics from './statistics.js';
import * as Validators from './validators.js';
import GameStrategy from './games/GameStrategy.js';
import { MelateGame } from './games/MelateGame.js';
import { RetroGame } from './games/RetroGame.js';
import { ChispazoGame } from './games/ChispazoGame.js';
import { GAME_CONFIG } from '../../config/games.config.js';

export const MathCore = {
  statistics: Statistics,
  validators: Validators,
  games: {
    GameStrategy,
    MelateGame,
    RetroGame,
    ChispazoGame
  },
  
  /**
   * Factory method para crear instancias de juegos
   * 
   * @param {string} gameId - 'melate', 'retro', 'chispazo'
   * @returns {GameStrategy} Instancia del juego
   * @throws {Error} Si el gameId no es válido
   */
  createGame(gameId) {
    const config = GAME_CONFIG[gameId];
    if (!config) {
      throw new Error(`Invalid gameId: ${gameId}. Valid options: ${Object.keys(GAME_CONFIG).join(', ')}`);
    }

    switch (gameId.toLowerCase()) {
      case 'melate':
        return new MelateGame(config);
      case 'retro':
        return new RetroGame(config);
      case 'chispazo':
        return new ChispazoGame(config);
      default:
        throw new Error(`Game not yet implemented: ${gameId}`);
    }
  },
  
  // Método raíz para verificación de estado
  isReady() {
    return true; // Stub - todos los submódulos listos
  }
};

export default MathCore;
