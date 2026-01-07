/**
 * modules/web_ui/index.js
 * Barril de exportación del módulo web_ui
 * 
 * [PROTECTED] Este módulo maneja la interfaz de usuario.
 * Responsabilidad: Componentes, eventos, visualización, DOM.
 * 
 * RESTRICCIÓN: NO realiza cálculos matemáticos.
 * Ver ARCH.md sección "2.4 Módulo: web_ui" para detalles.
 */

import Component from './components/Component.js';
import Ball from './components/Ball.js';
import GameSelector from './components/GameSelector.js';
import State from './state.js';

export const WebUI = {
  Component,
  Ball,
  GameSelector,
  state: new State(),
  
  // Método raíz para inicializar UI
  async initialize() {
    console.log('[WebUI] Inicializando interfaz de usuario...');
    // STUB - Implementación en siguiente fase
    // Renderizar componentes iniciales
    return true;
  },
  
  // Método para renderizar la app
  async render() {
    console.log('[WebUI] Renderizando aplicación...');
    // STUB - Implementación en siguiente fase
    return true;
  }
};

export default WebUI;
