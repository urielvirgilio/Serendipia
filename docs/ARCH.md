# SERENDIPIA - ARQUITECTURA OBJETIVO (PROTOCOLO NEXUS)

**Versión:** Nexus (Post-Refactor)  
**Fecha:** 2026-01-06  
**Estado:** Blueprint  
**Clasificación:** `[ARCHITECTURE]`

---

## 1. VISIÓN GENERAL

### Propósito
Define la arquitectura modular para transformar Serendipia de un **monolito HTML único** a una **aplicación JavaScript modular escalable**, manteniendo la misma lógica de negocio y experiencia visual.

### Principios de Diseño
- **Separación de Responsabilidades:** Lógica (math_core) ≠ Datos (data_layer) ≠ Interfaz (web_ui)
- **Sin Dependencias Externas Críticas:** Funciona sin build tool (ES6 modules nativos)
- **Client-Side First:** Toda la inteligencia en el navegador (IndexedDB para persistencia)
- **Testeable:** Módulos puros (sin side effects) fácil de unit-test

---

## 2. TOPOLOGÍA (CLIENT-SIDE MONOLITH)

### 2.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    SERENDIPIA APP                          │
│                   (HTML5 + ES6 Modules)                    │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌──────────┐    ┌──────────────┐    ┌────────────┐
    │  WEB_UI  │    │  DATA_LAYER  │    │ MATH_CORE  │
    │  (View)  │    │  (Persist)   │    │  (Logic)   │
    └──────────┘    └──────────────┘    └────────────┘
        │                   │                   │
   Components          IndexedDB          Statistics
   Charts                Parser            Games
   Styles               Store            Algorithms
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                   ┌────────────────┐
                   │  Browser APIs  │
                   │  DOM, Storage  │
                   └────────────────┘
```

### 2.2 Características de Topología

| Aspecto | Valor | Justificación |
|---------|-------|---------------|
| **Tipo** | Client-Side SPA | No requiere servidor backend |
| **Renderizado** | CSR (Client-Side Rendering) | HTML5 + DOM API |
| **Persistencia** | IndexedDB | Storage permanente 50MB+ |
| **Estilado** | TailwindCSS (CDN/Build) | Utility-first, responsive |
| **Modularidad** | ES6 Modules | Nativo, sin bundler requerido |
| **Package Manager** | npm (opcional) | Para dev tools solamente |

---

## 3. STACK TECNOLÓGICO

### 3.1 Frontend Stack

```
┌─────────────────────────────────────┐
│  HTML5                              │
│  - Semántica correcta               │
│  - Estructura responsive            │
│  - Data attributes para JS hooks    │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  TailwindCSS (v3+)                  │
│  - CDN: cdn.tailwindcss.com (dev)   │
│  - Build: Tailwind CLI (prod)       │
│  - Utility classes para UI          │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│  JavaScript ES6 Modules             │
│  - import/export nativo             │
│  - No bundler (browser resuelve)    │
│  - Tree-shaking manual              │
└─────────────────────────────────────┘
```

### 3.2 Librerías Externas (Mínimas)

| Librería | Versión | Propósito | Alternativa |
|----------|---------|----------|------------|
| **Chart.js** | 4+ | Gráficas (Poisson, Bernoulli) | D3.js (más pesado) |
| **chartjs-plugin-zoom** | 2.0.1+ | Zoom interactivo en gráficos | Manual con wheel events |
| **PapaParse** | 5.3.0+ | Parsear CSVs | FileReader API + manual |
| **idb** | 8+ | Wrapper IndexedDB async | IndexedDB API (verboso) |
| **HammerJS** | 2.0.8 | Gestos touch (opcional) | Pointer events API |

**Decisión:** Todas las librerías son opcionales. Versión minimalista usa solo Chart.js.

### 3.3 API del Navegador

```javascript
// Sin necesidad de librerías
- DOM API (querySelector, addEventListener, etc)
- Fetch API (si se agrega backend en futuro)
- IndexedDB (persistencia local)
- File API (para CSV uploads)
- Web Audio API (speech recognition)
- LocalStorage (session data ligera)
```

---

## 4. ESTRUCTURA DE MÓDULOS

### 4.1 Árbol de Directorios

```
src/
├── index.html                 # Punto de entrada HTML
├── styles/
│   ├── tailwind.config.js     # Config de Tailwind
│   └── index.css              # Imports de Tailwind
├── modules/
│   ├── math_core/
│   │   ├── index.js           # Export principal
│   │   ├── statistics.js      # Funciones matemáticas puras
│   │   ├── distributions.js   # Poisson, Normal, etc.
│   │   ├── games/
│   │   │   ├── GameStrategy.js    # Clase base (patrón Strategy)
│   │   │   ├── MelateGame.js      # Lógica específica Melate
│   │   │   ├── RetroGame.js       # Lógica específica Retro
│   │   │   ├── ChispazoGame.js    # Lógica específica Chispazo
│   │   │   ├── TrisGame.js        # Lógica específica TRIS
│   │   │   └── GatoGame.js        # Lógica específica Gato
│   │   └── validators.js      # Reglas de validación
│   │
│   ├── data_layer/
│   │   ├── index.js           # Export principal
│   │   ├── parser.js          # CSV parser wrapper
│   │   ├── store.js           # IndexedDB wrapper
│   │   ├── schema.js          # Database schema
│   │   └── types.ts (opcional)# TypeScript definitions
│   │
│   ├── web_ui/
│   │   ├── index.js           # Export principal
│   │   ├── main.js            # App controller / orquestador
│   │   ├── state.js           # State management (ligero)
│   │   ├── components/
│   │   │   ├── Ball.js        # Componente bola (input)
│   │   │   ├── Button.js      # Componente botón
│   │   │   ├── Card.js        # Componente tarjeta
│   │   │   ├── RangeSlider.js # Barra de rango
│   │   │   ├── TipBox.js      # Cajas de alerta
│   │   │   ├── RadarBox.js    # Radar de análisis
│   │   │   └── GamePanel.js   # Panel de juego (Melate, Retro, etc.)
│   │   ├── charts/
│   │   │   ├── PieChart.js    # Gráfico de premios
│   │   │   ├── BernoulliChart.js # Convergencia
│   │   │   ├── FrequencyHeatmap.js # Heatmap frecuencias
│   │   │   └── PoissonBar.js  # Barra de madurez
│   │   ├── layouts/
│   │   │   ├── Dashboard.js   # Layout principal
│   │   │   └── ReportView.js  # Vista de reporte
│   │   └── styles/
│   │       ├── components.css # Estilos de componentes
│   │       └── responsive.css # Media queries
│   │
│   └── utils/
│       ├── constants.js       # Configuración de juegos
│       ├── helpers.js         # Funciones auxiliares
│       └── logger.js          # Logging simple
│
├── assets/
│   ├── images/
│   │   └── logo_serendipia.png
│   └── icons/
│       └── favicon.ico
│
└── config/
    ├── games.config.js       # GAME_CONFIG (de legacy)
    └── colors.js             # Paleta de colores
```

### 4.2 Archivos Clave Descriptos

#### **4.2.1 math_core/index.js** (Lógica Pura)

```javascript
// Export principal de toda la lógica matemática

import { calculateMean, calculatePoisson, etc } from './statistics.js';
import GameStrategy from './games/GameStrategy.js';
import MelateGame from './games/MelateGame.js';
import RetroGame from './games/RetroGame.js';
// ... más juegos

export const MathCore = {
  // Funciones estadísticas
  statistics: { calculateMean, calculatePoisson, /* ... */ },
  
  // Factory de juegos
  createGame(gameName) {
    const games = {
      'melate': MelateGame,
      'retro': RetroGame,
      'chispazo': ChispazoGame,
      'tris': TrisGame,
      'gato': GatoGame
    };
    return new games[gameName]();
  }
};
```

**Características:**
- ✅ Sin DOM
- ✅ Sin side effects
- ✅ 100% testeable
- ✅ Reutilizable en Node.js (si futura API)

#### **4.2.2 data_layer/store.js** (Persistencia)

```javascript
// Wrapper amigable para IndexedDB

class SerendipiaStore {
  constructor() {
    this.db = null;
    this.dbName = 'serendipia_db';
    this.version = 1;
  }

  async init() {
    // Abre base de datos
    // Crea object stores si no existen
    return this.db;
  }

  async saveGameData(gameName, csvData) {
    // Guarda: { game: 'melate', data: [...], timestamp: Date }
    // En object store: 'games'
  }

  async getGameData(gameName) {
    // Retorna datos históricos de Melate, Retro, etc.
  }

  async getAllGames() {
    // Retorna todos los juegos cargados
  }

  async deleteGame(gameName) {
    // Elimina datos de un juego
  }

  async exportAsJSON() {
    // Descarga backup de toda la DB
  }
}

export default new SerendipiaStore();
```

**Ventajas sobre LocalStorage:**
- Soporta 50MB+ (vs 5-10MB localStorage)
- API async (no bloquea main thread)
- Transacciones
- Índices para búsquedas rápidas

#### **4.2.3 web_ui/main.js** (Orquestador / App Controller)

```javascript
// Componedor principal que conecta capas

import { MathCore } from '../math_core/index.js';
import store from '../data_layer/store.js';
import { renderGamePanel, renderResults } from './components/index.js';

class SerendipiaApp {
  constructor() {
    this.currentGame = null;
    this.currentData = null;
  }

  async init() {
    // 1. Inicializar IndexedDB
    await store.init();
    
    // 2. Renderizar UI inicial
    this.renderUI();
    
    // 3. Attach event listeners
    this.attachEventListeners();
  }

  async analyzeGame(gameName, userNumbers) {
    // 1. Obtener datos históricos
    const gameData = await store.getGameData(gameName);
    
    // 2. Validar entrada (math_core)
    const game = MathCore.createGame(gameName);
    const validation = game.validate(userNumbers);
    if (!validation.ok) {
      showError(validation.error);
      return;
    }
    
    // 3. Realizar análisis (math_core)
    const analysis = game.analyze(userNumbers, gameData);
    
    // 4. Renderizar resultados (web_ui)
    renderResults(analysis);
  }

  async uploadCSV(gameName, file) {
    // 1. Parsear CSV
    const parsed = await parseCSV(file);
    
    // 2. Guardar en IndexedDB
    await store.saveGameData(gameName, parsed);
    
    // 3. Actualizar UI
    this.refreshGamePanel();
  }

  attachEventListeners() {
    // Botones, inputs, tabs, etc.
    document.querySelector('#btn-analyze').addEventListener('click', () => {
      // ...
    });
  }

  renderUI() {
    // Renderizar pantalla inicial
  }
}

const app = new SerendipiaApp();
window.addEventListener('DOMContentLoaded', () => app.init());
```

---

## 5. PATRONES DE DISEÑO

### 5.1 Strategy Pattern (Juegos)

#### **Propósito**
Cada juego (Melate, TRIS, Gato) tiene reglas diferentes. Strategy encapsula las diferencias y proporciona interfaz común.

#### **Clase Base: GameStrategy**

```javascript
// math_core/games/GameStrategy.js

export class GameStrategy {
  constructor(config) {
    this.config = config; // { maxNum, count, idealSum, zoneMin, zoneMax, ... }
  }

  // Métodos abstractos (deben ser implementados por subclases)
  
  validate(numbers) {
    /**
     * Valida entrada de usuario
     * @returns { ok: boolean, error?: string }
     */
    throw new Error('Must implement validate()');
  }

  analyze(userNumbers, historicalData) {
    /**
     * Realiza análisis completo
     * @returns { ... análisis resultado }
     */
    throw new Error('Must implement analyze()');
  }

  calculateZoneDistribution(historicalData) {
    /**
     * Calcula % de sumas en cada zona
     * @returns { low: %, ideal: %, high: % }
     */
    throw new Error('Must implement calculateZoneDistribution()');
  }

  calculateFrequency(historicalData) {
    /**
     * Calcula frecuencia de cada número
     * @returns { [num]: count, ... }
     */
    throw new Error('Must implement calculateFrequency()');
  }

  // Método concreto compartido
  calculatePoissonMaturity(number, frequency, totalDraws) {
    // Implementación de Poisson (mismo para todos)
    const avgGap = totalDraws / frequency;
    const currentGap = this.config.lastSeen[number] || 0;
    return Math.min(100, Math.round((currentGap / avgGap) * 100));
  }
}
```

#### **Subclase Concreta: MelateGame**

```javascript
// math_core/games/MelateGame.js

import { GameStrategy } from './GameStrategy.js';
import { GAME_CONFIG } from '../../config/games.config.js';

export class MelateGame extends GameStrategy {
  constructor() {
    super(GAME_CONFIG.melate);
  }

  validate(numbers) {
    // Validar que sean 6 números
    if (numbers.length !== 6) {
      return { ok: false, error: 'Se requieren 6 números' };
    }

    // Validar rango 1-56
    for (const num of numbers) {
      if (num < 1 || num > 56) {
        return { ok: false, error: `${num} está fuera de rango (1-56)` };
      }
    }

    // Validar sin repeticiones
    if (new Set(numbers).size !== 6) {
      return { ok: false, error: 'No puedes repetir números' };
    }

    // Validar orden ascendente
    for (let i = 0; i < 5; i++) {
      if (numbers[i] >= numbers[i + 1]) {
        return { ok: false, error: 'Números deben ir en orden ascendente' };
      }
    }

    return { ok: true };
  }

  analyze(userNumbers, historicalData) {
    // Lógica de análisis específica Melate
    const modernDB = historicalData.filter(d => {
      const year = new Date(d.fecha).getFullYear();
      return year >= 2008; // Era moderna
    });

    const sum = userNumbers.reduce((a, b) => a + b, 0);
    const evenCount = userNumbers.filter(n => n % 2 === 0).length;
    const primeCount = userNumbers.filter(n => PRIMES.includes(n)).length;

    const distribution = this.calculateZoneDistribution(modernDB);
    const frequency = this.calculateFrequency(modernDB);
    const maturityScores = userNumbers.map(n => 
      this.calculatePoissonMaturity(n, frequency[n], modernDB.length)
    );

    return {
      sum,
      evenCount,
      primeCount,
      zoneStatus: this.getZoneStatus(sum),
      distribution,
      maturity: maturityScores,
      historicalMatches: this.findHistoricalMatches(userNumbers, modernDB)
    };
  }

  calculateZoneDistribution(historicalData) {
    let lowCount = 0, idealCount = 0, highCount = 0;
    
    historicalData.forEach(draw => {
      const sum = draw.nums.reduce((a, b) => a + b, 0);
      
      if (sum < this.config.zoneMin) lowCount++;
      else if (sum > this.config.zoneMax) highCount++;
      else idealCount++;
    });

    const total = historicalData.length;
    return {
      low: Math.round((lowCount / total) * 100),
      ideal: Math.round((idealCount / total) * 100),
      high: Math.round((highCount / total) * 100)
    };
  }

  // ... más métodos específicos
}
```

#### **Ventajas del Strategy Pattern**

| Aspecto | Beneficio |
|---------|----------|
| **DRY** | Código común en `GameStrategy`, sin duplicación |
| **Extensibilidad** | Nuevo juego = nueva clase + extend GameStrategy |
| **Testabilidad** | Cada clase se prueba independientemente |
| **Mantenibilidad** | Cambios en Melate no afectan Retro |
| **Polimorfismo** | `MathCore.createGame()` retorna interface común |

### 5.2 Component Pattern (UI)

#### **Componente Base**

```javascript
// web_ui/components/Component.js

export class Component {
  constructor(selector, data = {}) {
    this.selector = selector;
    this.element = document.querySelector(selector);
    this.data = data;
  }

  render() {
    throw new Error('Must implement render()');
  }

  update(newData) {
    this.data = { ...this.data, ...newData };
    this.render();
  }

  addEventListener(event, handler) {
    if (this.element) {
      this.element.addEventListener(event, handler);
    }
  }

  setData(key, value) {
    this.data[key] = value;
    this.render();
  }
}
```

#### **Componente Concreto: Ball**

```javascript
// web_ui/components/Ball.js

import { Component } from './Component.js';

export class Ball extends Component {
  constructor(selector, { max = 56, game = 'melate' } = {}) {
    super(selector, { max, game, frequency: 0 });
  }

  render() {
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'ball';
    input.setAttribute('data-max', this.data.max);
    input.setAttribute('data-game', this.data.game);

    const label = document.createElement('div');
    label.className = 'ball-freq-label';
    label.textContent = this.data.frequency > 0 ? `${this.data.frequency}x` : '-';

    this.element.innerHTML = '';
    this.element.appendChild(input);
    this.element.appendChild(label);
  }

  getFrequency() {
    return parseInt(this.element.querySelector('input').value);
  }
}
```

### 5.3 State Management (Ligero)

```javascript
// web_ui/state.js

class AppState {
  constructor() {
    this.state = {
      currentGame: null,
      userInput: {},
      analysisResult: null,
      gameHistories: {}
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  getState() {
    return this.state;
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const appState = new AppState();
```

---

## 6. FLUJO DE DATOS

### 6.1 Flujo Completo de Análisis

```
┌─────────────────┐
│  Usuario INPUT  │
│ (6 números)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  WEB_UI.InputComponent  │  ← Captura input
│  (DOM → State)          │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  MATH_CORE.validate()       │  ← Valida (sin DOM)
│  (Strategy Pattern)         │
└────────┬────────────────────┘
         │
    OK? / ERROR
    │   │
    │   ▼ (Error)
    │  showError()
    │
    ▼ (OK)
┌─────────────────────────────┐
│  DATA_LAYER.getGameData()   │  ← Carga histórico
│  (IndexedDB)                │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  MATH_CORE.analyze()        │  ← Realiza análisis
│  (Poisson, Frecuencia, etc) │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  WEB_UI.renderResults()     │  ← Renderiza resultado
│  (DOM ← Analysis)           │
└─────────────────────────────┘
```

### 6.2 Flujo de Carga de Datos

```
┌───────────────┐
│  Upload CSV   │
└───────┬───────┘
        │
        ▼
┌────────────────────┐
│  DATA_LAYER.parse()│  ← PapaParse
│  (CSV → JSON)      │
└────────┬───────────┘
         │
         ▼
┌────────────────────────┐
│  MATH_CORE.validate()  │  ← Valida datos
│  (Verificar estructura)│
└────────┬───────────────┘
         │
    OK? / ERROR
    │   │
    │   ▼ (Error)
    │  showError()
    │
    ▼ (OK)
┌────────────────────────┐
│  DATA_LAYER.store()    │  ← IndexedDB
│  (Persist CSV)         │
└────────┬───────────────┘
         │
         ▼
┌──────────────────────┐
│  WEB_UI.showSuccess()│  ← Feedback
└──────────────────────┘
```

---

## 7. DEPENDENCIAS Y LIBRERÍAS

### 7.1 Matriz de Dependencias

```
WEB_UI
├─ Components (DOM API nativo)
├─ Charts (Chart.js 4+)
│  └─ chartjs-plugin-zoom 2.0.1+
├─ Styles (TailwindCSS CDN/Build)
└─ main.js (orquestador)
   └─ DATA_LAYER
      ├─ store.js (IndexedDB API)
      ├─ parser.js (PapaParse 5.3.0+)
      └─ MATH_CORE
         ├─ statistics.js (sin deps)
         ├─ games/ (sin deps)
         └─ validators.js (sin deps)

UTILS
├─ constants.js (config sin deps)
└─ helpers.js (sin deps)
```

### 7.2 Versiones Mínimas

```json
{
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "@tailwindcss/typography": "^0.5.0"
  },
  "dependencies": {
    "chart.js": "^4.4.0",
    "chartjs-plugin-zoom": "^2.0.1",
    "papaparse": "^5.4.0",
    "idb": "^8.0.0"
  }
}
```

**Nota:** En desarrollo se usa CDN para Chart.js, PapaParse. En producción, buildear con Vite o esbuild.

---

## 8. CONFIGURACIÓN (CONFIG)

### 8.1 games.config.js

```javascript
// config/games.config.js

export const GAME_CONFIG = {
  melate: {
    name: 'Melate',
    maxNum: 56,
    count: 6,
    minSum: 21,
    maxSum: 321,
    idealSum: 171,
    zoneMin: 120,
    zoneMax: 220,
    guaranteedMinimum: 30000000,
    idealEvenText: '3 Pares / 3 Impares (33% Teórico)',
    idealPrimes: [1, 2, 3]
  },
  retro: {
    name: 'Retro',
    maxNum: 39,
    count: 6,
    minSum: 21,
    maxSum: 219,
    idealSum: 120,
    zoneMin: 90,
    zoneMax: 150,
    guaranteedMinimum: 5000000,
    idealEvenText: '3 Pares / 3 Impares (33% Teórico)',
    idealPrimes: [1, 2, 3]
  },
  chispazo: {
    name: 'Chispazo',
    maxNum: 28,
    count: 5,
    minSum: 15,
    maxSum: 130,
    idealSum: 72.5,
    zoneMin: 50,
    zoneMax: 100,
    guaranteedMinimum: 0,
    idealEvenText: '2 Pares / 3 Impares (32% Teórico)',
    idealPrimes: [1, 2, 3]
  },
  tris: {
    name: 'TRIS',
    count: 5,
    maxNum: 9,
    modalidades: {
      direct5: { label: 'Directa 5', prize: 50000, cost: 1 },
      // ... más modalidades
    }
  },
  gato: {
    name: 'Gato',
    count: 8,
    maxNum: 5,
    // Grid 3x3
  }
};

export const CONSTANTS = {
  PRIMES: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53],
  HOT_THRESHOLD: 0.12,        // 12%
  COLD_THRESHOLD: 0.08,       // 8%
  POISSON_MATURE: 0.80,       // 80%
  DB_NAME: 'serendipia_db',
  DB_VERSION: 1
};
```

---

## 9. CICLO DE VIDA DE LA APLICACIÓN

### 9.1 Inicialización

```
1. HTML Loads
   └─> index.html
       └─> script type="module" src="./modules/web_ui/main.js"

2. main.js Executes
   └─> new SerendipiaApp()
       ├─> app.init()
           ├─> await store.init()  // Abre IndexedDB
           ├─> app.renderUI()       // Renderiza HTML inicial
           └─> app.attachEventListeners()  // Binds events

3. App Ready
   └─> User puede interactuar
```

### 9.2 Análisis de Jugada

```
1. User ingresa 6 números
2. Presiona "Analizar"
3. Event listener llama: app.analyzeGame('melate', [1,5,12,25,38,55])
4. Flujo interno:
   ├─> Validar (MATH_CORE)
   ├─> Cargar histórico (DATA_LAYER)
   ├─> Analizar (MATH_CORE)
   └─> Renderizar (WEB_UI)
5. Mostrar resultados
```

---

## 10. TESTING STRATEGY

### 10.1 Unit Tests (MATH_CORE)

```javascript
// __tests__/math_core/statistics.test.js

import { calculateMean, calculatePoisson } from '../../src/modules/math_core/statistics.js';

describe('Statistics Module', () => {
  test('calculateMean([1,2,3]) === 2', () => {
    expect(calculateMean([1, 2, 3])).toBe(2);
  });

  test('calculatePoisson with maturity calculation', () => {
    const result = calculatePoisson(10, 50, 500);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });
});
```

**Test Runner:** Vitest (compatible con ES6 modules)

### 10.2 Integration Tests (Strategy Pattern)

```javascript
// __tests__/math_core/games.test.js

import { MelateGame } from '../../src/modules/math_core/games/MelateGame.js';

describe('MelateGame', () => {
  let game;

  beforeEach(() => {
    game = new MelateGame();
  });

  test('validate() rejects 5 numbers', () => {
    const result = game.validate([1, 2, 3, 4, 5]);
    expect(result.ok).toBe(false);
  });

  test('validate() accepts valid 6 numbers', () => {
    const result = game.validate([1, 5, 12, 25, 38, 55]);
    expect(result.ok).toBe(true);
  });

  test('analyze() returns complete result object', () => {
    const historicalData = [{ nums: [1, 5, 12, 25, 38, 55], fecha: '2024-01-01' }];
    const result = game.analyze([1, 5, 12, 25, 38, 55], historicalData);
    
    expect(result).toHaveProperty('sum');
    expect(result).toHaveProperty('evenCount');
    expect(result).toHaveProperty('zoneStatus');
  });
});
```

### 10.3 E2E Tests (Selenium/Playwright)

```javascript
// __tests__/e2e/upload-and-analyze.test.js

import { chromium } from 'playwright';

describe('E2E: Upload CSV and Analyze', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  test('User can upload Melate CSV and analyze', async () => {
    // Simula upload de archivo
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-data/melate-sample.csv');

    // Espera confirmación
    await page.locator('#statusMelate').waitFor({ state: 'visible' });
    await expect(page.locator('#statusMelate')).toContainText('✅ Listo');

    // Ingresa números y analiza
    await page.locator('#m1').fill('5');
    await page.locator('#m2').fill('12');
    // ... llenar otros
    
    await page.locator('button:has-text("Analizar")').click();

    // Verificar resultados
    await page.locator('.section-title:has-text("Diagnóstico")').waitFor();
  });
});
```

---

## 11. ROADMAP DE MIGRACIÓN (FASE 1-3)

### 11.1 Fase 1: Preparación (Semana 1-2)

- [ ] Crear estructura de directorios
- [ ] Setup de ES6 modules sin bundler
- [ ] Migrar GAME_CONFIG a modules
- [ ] Setup de IndexedDB schema
- [ ] Setup de tests (Vitest)

### 11.2 Fase 2: Core Modules (Semana 3-4)

- [ ] Migrar math_core/statistics.js
- [ ] Implementar GameStrategy base
- [ ] Migrar MelateGame, RetroGame (aplicar Strategy)
- [ ] Implementar data_layer/store.js (IndexedDB)
- [ ] Implementar data_layer/parser.js (PapaParse)
- [ ] Unit tests para math_core

### 11.3 Fase 3: UI Components (Semana 5-6)

- [ ] Crear web_ui/components base
- [ ] Migrar Ball, Button, Card, RangeSlider
- [ ] Implementar TailwindCSS styling
- [ ] Migrar Chart.js wrappers
- [ ] Implementar main.js (orquestador)
- [ ] E2E tests

### 11.4 Fase 4: Integración y Pulido (Semana 7-8)

- [ ] Integración completa
- [ ] Performance testing
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Documentación de código
- [ ] Deploy a producción

---

## 12. CONSIDERACIONES TÉCNICAS

### 12.1 Performance

```javascript
// Lazy loading de módulos
const chartModule = await import('./modules/web_ui/charts/BernoulliChart.js');

// Tree-shaking: Solo importar lo necesario
import { calculateMean } from './math_core/statistics.js';
// No: import * as stats from './math_core/statistics.js'

// Debounce en event listeners
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Uso en input
document.querySelector('input').addEventListener('input', debounce((e) => {
  updateFrequencyLabel(e.target);
}, 300));
```

### 12.2 Bundle Size (Goal: < 200KB gzipped)

```
Base (HTML5, CSS Tailwind): ~50KB
Chart.js + plugins: ~80KB
PapaParse: ~20KB
App code (modules): ~30KB
────────────────────────────
Total: ~180KB (sin gzip)
      ~60KB (gzipped)
```

### 12.3 Compatibilidad de Navegadores

```
Requerimientos:
- ES6 Modules nativos: Chrome 61+, Firefox 67+, Safari 10.1+, Edge 79+
- IndexedDB: Todos los navegadores modernos
- Fetch API: Chrome 42+, Firefox 39+, Safari 10.1+
- File API: Amplio soporte

No soportar: IE 11 (EOL)
```

---

## 13. SEGURIDAD

### 13.1 Cliente-Side

- ✅ No hay secretos en cliente
- ✅ Validación en cliente (UX) + servidor (si futura API)
- ✅ CSP (Content Security Policy) headers
- ✅ No usar eval()
- ✅ Sanitizar DOM (textContent vs innerHTML)

```javascript
// ❌ Evitar
element.innerHTML = userInput; // XSS risk

// ✅ Hacer
element.textContent = userInput; // Safe
```

### 13.2 Persistencia

```javascript
// IndexedDB es por origin (mismo navegador, mismo origin)
// No hay acceso a datos de otros sitios
// Cifrado: Considerar en futuro si usuario agrega API key
```

---

## 14. DEPLOYMENT

### 14.1 Estructura de Deployment

```
dist/
├── index.html          (entrada)
├── styles/
│   └── index.css       (Tailwind compilado)
├── modules/            (todo el src/modules)
├── assets/
│   ├── images/
│   └── icons/
└── config/            (constantes)
```

### 14.2 Build Process

```bash
# Development
npm run dev    # Tailwind JIT, Vite dev server

# Production
npm run build  # Tailwind purge, minify JS
npm run serve  # Preview final bundle
```

### 14.3 Hosting Opciones

- **Static:** GitHub Pages, Vercel, Netlify (gratuito)
- **Self-hosted:** Apache, Nginx
- **CDN:** Cloudflare, Akamai

---

## 15. COMPARATIVA: LEGACY vs NEXUS

| Aspecto | Legacy (Actual) | Nexus (Nuevo) | Ventaja |
|---------|-----------|---------------|---------|
| **Tipo** | HTML monolítico | Módulos ES6 | Mantenibilidad ↑ |
| **Lógica** | Inline en `<script>` | math_core/ separado | Testabilidad ↑ |
| **Datos** | LocalStorage (5MB) | IndexedDB (50MB+) | Capacidad ↑ |
| **Styling** | CSS inline en `<style>` | TailwindCSS externo | Escalabilidad ↑ |
| **Componentes** | Código repetido | Component class | Reutilización ↑ |
| **Dependencias** | Hardcoded en HTML | package.json | Control ↑ |
| **Testing** | Imposible | Vitest + E2E | Calidad ↑ |
| **Docs** | Ninguna | Completa | Onboarding ↓ |

---

## 16. GLOSARIO DE ARQUITECTURA

| Término | Definición |
|---------|-----------|
| **SPA** | Single Page Application: una sola HTML renderizada dinámicamente |
| **CSR** | Client-Side Rendering: renderizado en el navegador |
| **Strategy Pattern** | Encapsula algoritmos intercambiables (juegos) |
| **Component Pattern** | Encapsula UI reusable con estado y métodos |
| **IndexedDB** | Database local del navegador (NoSQL, async) |
| **Module** | Archivo JS con import/export (ES6 native) |
| **ES6 Modules** | Sistema de módulos nativo del navegador (`import`, `export`) |
| **Tree-shaking** | Eliminar código no utilizado en build |
| **Lazy Loading** | Cargar módulos dinámicamente cuando se necesitan |
| **Build Tool** | Vite, esbuild, Webpack (compila modules) |

---

## 17. CONTACTO Y MANTENIMIENTO

**Arquitecto:** Serendipia Development Team  
**Última Revisión:** 2026-01-06  
**Siguiente Revisión:** Post-Fase 2 Migration

---

**Fin del Documento - ARCH.md**
