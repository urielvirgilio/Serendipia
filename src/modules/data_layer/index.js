/**
 * modules/data_layer/index.js
 * Barril de exportación del módulo data_layer
 * 
 * [PROTECTED-DATA] Este módulo maneja persistencia y parseo de datos.
 * Responsabilidad: IndexedDB, CSV parsing, almacenamiento local.
 * 
 * Ver ARCH.md sección "4.2.2 Módulo: data_layer" para detalles.
 * Ver LOGIC.md para estructura de datos esperados.
 */

import SerendipiaStore from './store.js';
import * as Parser from './parser.js';

const store = new SerendipiaStore();

export const DataLayer = {
  store: store,
  parser: Parser,
  
  /**
   * Inicializa la capa de datos
   * - Abre conexión a IndexedDB
   * - Crea esquema si es primera vez
   * - Retorna true si éxito
   * 
   * @returns {Promise<boolean>}
   */
  async initialize() {
    try {
      return await store.init();
    } catch (err) {
      console.error('❌ Failed to initialize DataLayer:', err);
      return false;
    }
  }
};

export default DataLayer;
