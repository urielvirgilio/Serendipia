/**
 * modules/web_ui/main.js
 * Orquestador Principal de la Aplicación
 * 
 * Responsabilidades:
 * 1. Monta componentes (GameSelector, Balls)
 * 2. Maneja estado local de la aplicación
 * 3. Coordina flujos: seleccionar juego → ingresar números → analizar
 * 4. Comunica math_core y data_layer
 */

import GameSelector from './components/GameSelector.js';
import Ball from './components/Ball.js';
import ResultsDashboard from './components/ResultsDashboard.js';
import MathCore from '../math_core/index.js';
import DataLayer from '../data_layer/index.js';
import GAME_CONFIG from '../../config/games.config.js';

console.log('🧭 Main.js inicializando...');

// ============================================
// ESTADO LOCAL DE LA APLICACIÓN
// ============================================

const appState = {
  activeGame: 'melate',
  balls: [],              // Array de instancias Ball
  inputs: [],             // Array de números ingresados
  analysisResult: null
};

// ============================================
// INICIALIZACIÓN
// ============================================

async function initializeApp() {
  try {
    console.log('[INIT] Inicializando data_layer...');
    const initialized = await DataLayer.initialize();
    if (!initialized) {
      throw new Error('No se pudo inicializar data_layer');
    }
    console.log('✅ data_layer inicializado');

    // Crear y montar GameSelector
    console.log('[UI] Montando GameSelector...');
    const selectorContainer = document.getElementById('game-selector-container');
    const selector = new GameSelector({
      activeGame: appState.activeGame,
      games: Object.keys(GAME_CONFIG),
      onGameChange: handleGameChange
    });
    const selectorEl = selector.render();
    if (selectorEl instanceof HTMLElement) {
      selectorContainer.appendChild(selectorEl);
      console.log('✅ GameSelector montado');
    }

    // Montar bolas iniciales
    mountBalls();

    // Conectar eventos de la botonera
    const analyzeBtn = document.getElementById('btn-analyze');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', handleAnalyze);
      console.log('✅ Botón Analizar conectado');
    }

    const randomBtn = document.getElementById('btn-random');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => handleGenerate('smart'));
      console.log('✅ Botón Aleatorio conectado');
    }

    const omegaBtn = document.getElementById('btn-omega');
    if (omegaBtn) {
      omegaBtn.addEventListener('click', () => handleGenerate('omega'));
      console.log('✅ Botón Omega conectado');
    }

    const clearBtn = document.getElementById('btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', handleClear);
      console.log('✅ Botón Limpiar conectado');
    }

    const printBtn = document.getElementById('btn-print');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
      console.log('✅ Botón Imprimir conectado');
    }

    console.log('%c✨ Aplicación lista para usar', 'color: #2A9D8F; font-weight: bold; font-size: 14px;');
  } catch (err) {
    console.error('❌ Error en inicialización:', err);
    showError(`Error durante inicialización: ${err.message}`);
  }
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Maneja cambio de juego
 * @param {string} gameId - ID del juego (melate, retro, chispazo)
 */
function handleGameChange(gameId) {
  console.log(`🎮 Cambiando a juego: ${gameId}`);
  appState.activeGame = gameId;
  appState.balls = [];
  appState.inputs = [];
  
  // Limpiar contenedor y remount
  mountBalls();
  
  // Limpiar resultados previos
  hideResults();
  hideError();

  // --- INICIO: Actualización de UI Dinámica ---
  const gameTitleEl = document.getElementById('game-title');
  const gameIconEl = document.getElementById('game-icon');
  const melateSelectorEl = document.getElementById('melate-type-selector');
  
  const gameInfo = {
    melate: {
      icon: '🎱',
      title: 'Analizador de tu Número Melate'
    },
    retro: {
      icon: '🎱',
      title: 'Analizador de tu Número Retro'
    },
    chispazo: {
      icon: '🔥',
      title: 'Analizador de tu Número Chispazo'
    }
  };

  const info = gameInfo[gameId] || gameInfo.melate; // Default a melate

  if (gameTitleEl) gameTitleEl.innerText = info.title;
  if (gameIconEl) gameIconEl.innerText = info.icon;
  
  // El selector de tipo de Melate solo es visible para Melate
  if (melateSelectorEl) {
    melateSelectorEl.style.display = (gameId === 'melate') ? 'block' : 'none';
  }
  // --- FIN: Actualización de UI Dinámica ---
}

/**
 * Monta las bolas según el juego activo
 */
function mountBalls() {
  const ballsContainer = document.getElementById('balls-container');
  if (!ballsContainer) {
    console.error('❌ Contenedor de bolas "#balls-container" no encontrado.');
    return;
  }
  ballsContainer.innerHTML = ''; // Limpiar
  appState.balls = [];

  const gameConfig = GAME_CONFIG[appState.activeGame];
  if (!gameConfig) {
    console.error(`❌ Configuración no encontrada para ${appState.activeGame}`);
    return;
  }

  const positions = gameConfig.positions || 6;
  console.log(`🎱 Creando ${positions} bolas para ${appState.activeGame}`);

  for (let i = 0; i < positions; i++) {
    const ball = new Ball({
      id: `${appState.activeGame}_${i}`, // ID único para la etiqueta de frecuencia
      number: '',
      max: gameConfig.maxNumber,
      frequency: 0,
      status: 'normal',
      onChange: (value) => {
        console.log(`Ball ${i + 1} changed: ${value}`);
      }
    });

    const ballEl = ball.render();
    if (ballEl instanceof HTMLElement) {
      ballsContainer.appendChild(ballEl);
      appState.balls.push(ball);
    }
  }
}

/**
 * Rellena las bolas con un array de números
 * @param {number[]} nums
 */
function fillBallsWithNumbers(nums = []) {
  appState.balls.forEach((ball, idx) => {
    const val = typeof nums[idx] !== 'undefined' ? nums[idx] : null;
    if (typeof ball.setNumber === 'function') {
      ball.setNumber(val);
      // Dispatch input event so Ball's internal handlers run
      if (ball.input) {
        const ev = new Event('input', { bubbles: true });
        ball.input.dispatchEvent(ev);
      }
    }
  });
}

/**
 * Maneja generación de números (smart / omega)
 */
function handleGenerate(mode = 'smart') {
  try {
    const game = MathCore.createGame(appState.activeGame);
    if (!game || typeof game.generateRandom !== 'function') {
      console.warn('Generación no soportada para este juego');
      return;
    }
    const nums = game.generateRandom(mode);
    console.log(`Generados (${mode}):`, nums);
    fillBallsWithNumbers(nums);
  } catch (err) {
    console.error('Error en handleGenerate:', err);
  }
}

/**
 * Limpia las bolas y oculta resultados
 */
function handleClear() {
  appState.balls.forEach(ball => {
    if (typeof ball.setNumber === 'function') {
      ball.setNumber(null);
      if (ball.input) {
        const ev = new Event('input', { bubbles: true });
        ball.input.dispatchEvent(ev);
      }
    }
  });
  hideResults();
  hideError();
}

/**
 * Maneja el evento de Analizar
 */
async function handleAnalyze() {
  console.log('🔍 Iniciando análisis...');
  hideError();
  hideResults();

  try {
    // 1. Recoger valores de las bolas
    const numbers = appState.balls
      .map((ball, idx) => {
        const val = ball.getNumber();
        console.log(`  Ball ${idx + 1}: ${val}`);
        return val;
      })
      .filter(n => n !== null);

    // Debug: show parsed numbers before validation/analyze
    console.log('Números enviados a analizar:', numbers);
    console.log(`📊 Números ingresados: [${numbers}]`);

    // 2. Validar números con la lógica del juego
    const game = MathCore.createGame(appState.activeGame);
    const validationResult = game.validate(numbers);

    if (!validationResult.ok) {
      showError(validationResult.error);
      console.error('❌ Validación fallida:', validationResult.error);
      return;
    }
    console.log('✅ Validación exitosa');

    // 3. Recuperar datos históricos del juego
    console.log('📚 Recuperando datos históricos...');
    console.log('Intentando recuperar historial para:', appState.activeGame);
    const history = await DataLayer.store.getGameData(appState.activeGame);
    console.log('Historial recuperado:', history);
    if (!history || history.length === 0) {
      showError('No hay datos históricos cargados para este juego. Carga datos con el importador.');
      console.warn('⚠️ Sin datos históricos');
      return;
    }
    console.log(`✅ ${history.length} sorteos históricos encontrados`);

    // 4. Ejecutar análisis
    console.log('🧮 Ejecutando análisis...');
    const analysisResult = game.analyze(numbers, history);
    appState.analysisResult = analysisResult;
    console.log('✅ Análisis completado:', analysisResult);

    // 5. Mostrar resultados
    displayResults(analysisResult);

  } catch (err) {
    console.error('❌ Error durante análisis:', err);
    showError(`Error durante análisis: ${err.message}`);
  }
}

// ============================================
// UI HELPERS
// ============================================

/**
 * Muestra resultados del análisis usando ResultsDashboard
 */
function displayResults(analysis) {
  // Instantiate dashboard with container id and props (legacy-compatible)
  const dashboard = new ResultsDashboard('results-container', {
    analysisData: analysis
  });

  // Render and mount into the DOM
  dashboard.render();
  const mounted = dashboard.mount();
  if (!mounted) {
    console.warn('ResultsDashboard: mount failed, falling back to direct render');
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) resultsContainer.appendChild(dashboard.element);
  }

  // Initialize charts after DOM insertion
  setTimeout(() => {
    dashboard.afterMount();
  }, 0);

  const resultsContainer = document.getElementById('results-container');
  if (resultsContainer) resultsContainer.style.display = 'block';
  console.log('📊 ResultsDashboard montado y renderizado');
}

/**
 * Oculta contenedor de resultados
 */
function hideResults() {
  const resultsContainer = document.getElementById('results-container');
  if (resultsContainer) {
    resultsContainer.style.display = 'none';
  }
}

/**
 * Muestra mensaje de error
 */
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');

  if (!errorDiv || !errorText) return;

  errorText.textContent = message;
  errorDiv.style.display = 'block';
  console.error('🚨 Error mostrado al usuario:', message);
}

/**
 * Oculta mensaje de error
 */
function hideError() {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}

// ============================================
// BOOTSTRAP
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Exponer globalmente para debugging
if (typeof window !== 'undefined') {
  window.__SERENDIPIA_APP__ = {
    appState,
    MathCore,
    DataLayer,
    GAME_CONFIG
  };
  console.log('ℹ️ Global: window.__SERENDIPIA_APP__');
}
