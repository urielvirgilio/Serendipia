/**
 * modules/data_layer/store.js
 * IndexedDB Wrapper - Persistencia de sorteos
 * 
 * [PROTECTED-DATA] Maneja toda interacción con IndexedDB
 * Responsabilidad: CRUD de datos de sorteos, transacciones seguras
 * 
 * Estructura:
 *   Database: serendipia_db
 *   Stores:
 *     - games: { keyPath: 'gameType', indexes: ['gameType', 'date'] }
 *     - draws: { keyPath: 'id', indexes: ['gameType', 'date'] }
 *     - config: { keyPath: 'key' }
 * 
 * Ver ARCH.md sección "4.2.2 data_layer" para detalles.
 */

class SerendipiaStore {
  constructor() {
    this.DB_NAME = 'serendipia_db';
    this.DB_VERSION = 1;
    this.STORES = {
      GAMES: 'games',        // keyPath: gameType
      DRAWS: 'draws',        // keyPath: id
      CONFIG: 'config'       // keyPath: key
    };
    
    this.db = null;
    this._initialized = false;
  }

  /**
   * Inicializa la base de datos
   * Crea stores si no existen
   * 
   * @returns {Promise<boolean>} true si inicialización fue exitosa
   * @throws {Error} Si hay problema abriendo DB
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      // Error al abrir
      request.onerror = () => {
        console.error('❌ IndexedDB init error:', request.error);
        reject(new Error(`Failed to open IndexedDB: ${request.error}`));
      };

      // Éxito al abrir
      request.onsuccess = () => {
        this.db = request.result;
        this._initialized = true;
        console.log('✅ IndexedDB initialized:', this.DB_NAME);
        resolve(true);
      };

      // Upgrade necesario (primera vez o versión nueva)
      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store: games
        // Guarda arrays de sorteos por tipo de juego
        if (!db.objectStoreNames.contains(this.STORES.GAMES)) {
          const gamesStore = db.createObjectStore(this.STORES.GAMES, {
            keyPath: 'gameType'
          });
          gamesStore.createIndex('gameType', 'gameType', { unique: false });
          gamesStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          console.log('📦 Created store: games');
        }

        // Store: draws
        // Guarda sorteos individuales con ID único
        if (!db.objectStoreNames.contains(this.STORES.DRAWS)) {
          const drawsStore = db.createObjectStore(this.STORES.DRAWS, {
            keyPath: 'id',
            autoIncrement: true
          });
          drawsStore.createIndex('gameType', 'gameType', { unique: false });
          drawsStore.createIndex('date', 'date', { unique: false });
          console.log('📦 Created store: draws');
        }

        // Store: config
        // Guarda configuración y metadata
        if (!db.objectStoreNames.contains(this.STORES.CONFIG)) {
          db.createObjectStore(this.STORES.CONFIG, { keyPath: 'key' });
          console.log('📦 Created store: config');
        }
      };
    });
  }

  /**
   * Guarda array de sorteos para un juego
   * 
   * @param {string} gameType - Tipo de juego: 'melate', 'retro', 'chispazo', etc
   * @param {Array} draws - Array de sorteos con estructura: { fecha, nums, additional }
   * @returns {Promise<Object>} Objeto guardado con metadata
   * @throws {Error} Si DB no está inicializada o si hay error de escritura
   */
  async saveGameData(gameType, draws) {
    if (!this._initialized) {
      throw new Error('Store not initialized. Call init() first.');
    }

    if (!Array.isArray(draws)) {
      throw new Error('draws must be an array');
    }

    const gameData = {
      gameType: gameType.toLowerCase(),
      draws: draws,
      count: draws.length,
      updatedAt: new Date().toISOString(),
      firstDate: draws.length > 0 ? draws[0].fecha : null,
      lastDate: draws.length > 0 ? draws[draws.length - 1].fecha : null
    };

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([this.STORES.GAMES], 'readwrite');
        const store = transaction.objectStore(this.STORES.GAMES);
        const request = store.put(gameData);

        request.onsuccess = () => {
          console.log(`✅ Saved ${gameData.count} draws for ${gameType}`);
          resolve(gameData);
        };

        request.onerror = () => {
          console.error('❌ Error saving game data:', request.error);
          reject(new Error(`Failed to save game data: ${request.error}`));
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Recupera array de sorteos para un juego
   * 
   * @param {string} gameType - Tipo de juego
   * @returns {Promise<Array|null>} Array de sorteos o null si no existe
   * @throws {Error} Si hay error de lectura
   */
  async getGameData(gameType) {
    if (!this._initialized) {
      throw new Error('Store not initialized. Call init() first.');
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([this.STORES.GAMES], 'readonly');
        const store = transaction.objectStore(this.STORES.GAMES);
        const request = store.get(gameType.toLowerCase());

        request.onsuccess = () => {
          const result = request.result;
          if (result) {
              console.log(`✅ Retrieved ${result.count} draws for ${gameType}`);
              resolve(result.draws || []);
            } else {
              console.log(`⚠️ No data found for ${gameType}`);
              // Normalize to empty array to avoid callers receiving null
              resolve([]);
            }
        };

        request.onerror = () => {
          console.error('❌ Error retrieving game data:', request.error);
          reject(new Error(`Failed to retrieve game data: ${request.error}`));
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Borra todos los datos de un juego
   * 
   * @param {string} gameType - Tipo de juego a borrar
   * @returns {Promise<boolean>} true si se borró exitosamente
   * @throws {Error} Si hay error de eliminación
   */
  async clearGameData(gameType) {
    if (!this._initialized) {
      throw new Error('Store not initialized. Call init() first.');
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([this.STORES.GAMES], 'readwrite');
        const store = transaction.objectStore(this.STORES.GAMES);
        const request = store.delete(gameType.toLowerCase());

        request.onsuccess = () => {
          console.log(`🗑️ Cleared data for ${gameType}`);
          resolve(true);
        };

        request.onerror = () => {
          console.error('❌ Error clearing game data:', request.error);
          reject(new Error(`Failed to clear game data: ${request.error}`));
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Obtiene metadata de todos los juegos almacenados
   * 
   * @returns {Promise<Array>} Array de objetos { gameType, count, updatedAt, ... }
   */
  async getAllGameMetadata() {
    if (!this._initialized) {
      throw new Error('Store not initialized. Call init() first.');
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([this.STORES.GAMES], 'readonly');
        const store = transaction.objectStore(this.STORES.GAMES);
        const request = store.getAll();

        request.onsuccess = () => {
          const results = request.result;
          const metadata = results.map(item => ({
            gameType: item.gameType,
            count: item.count,
            updatedAt: item.updatedAt,
            firstDate: item.firstDate,
            lastDate: item.lastDate
          }));
          resolve(metadata);
        };

        request.onerror = () => {
          reject(new Error(`Failed to get metadata: ${request.error}`));
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Verifica si el store está inicializado
   * @returns {boolean}
   */
  isInitialized() {
    return this._initialized;
  }

  /**
   * Cierra la conexión a la base de datos
   */
  close() {
    if (this.db) {
      this.db.close();
      this._initialized = false;
      console.log('🔒 IndexedDB connection closed');
    }
  }
}

export default SerendipiaStore;
