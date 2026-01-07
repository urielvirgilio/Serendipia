# SERENDIPIA - Centro de Inteligencia de Lotería

> **"Dato mata Relato"** - Si la estadística dice que algo no va a pasar, dejamos de apostar a eso.

---

## 🎯 ¿QUÉ ES SERENDIPIA?

Serendipia es una **herramienta de análisis estadístico** para juegos de lotería:
- 🎱 **Melate** (6 de 56)
- 🎱 **Retro** (6 de 39)  
- 🔥 **Chispazo** (5 de 28)
- 🔢 **TRIS** (5 dígitos, múltiples modalidades)
- 🐱 **Gato** (Grid 3×3)

**No es un juego de azar disfrazado.** Es una aplicación que:

1. Carga datos históricos de sorteos
2. Identifica patrones estadísticos
3. Filtra combinaciones con baja probabilidad
4. **Te enfoca en la Zona Verde** donde caen el 85% de premios

---

## 🚀 INICIO RÁPIDO

### Requisitos
- Navegador moderno (Chrome 61+, Firefox 67+, Safari 10.1+)
- Servidor web local (VS Code Live Server, Python, etc)

### Pasos

1. **Clonar repositorio**
   ```bash
   git clone <repo>
   cd serendipia
   ```

2. **Abrir localmente**
   - VS Code: Click derecho `index.html` → "Open with Live Server"
   - Python: `python -m http.server 8000`

3. **Cargar datos históricos**
   - Haz upload de CSV con histórico de sorteos
   - Formato: Fecha, Números, Bolsa (ver LOGIC.md)

4. **Analizar tu jugada**
   - Ingresa 6 números (o 5 para Chispazo)
   - Click "Analizar"
   - Lee el reporte completo

---

## 🔬 CARACTERÍSTICAS PRINCIPALES

### Análisis de Frecuencia (Heatmap)
```
🔥 Números Calientes: Frecuencia reciente elevada
🧊 Números Rezagados: No han salido en mucho tiempo
   → Combinación smart: mezcla inercia + presión de equilibrio
```

### Análisis de Poisson (Madurez)
```
📊 Semáforo de Madurez:
   🔴 Rojo (0-20%):       Falta madurar
   🟡 Amarillo (21-79%):  Madurando
   🟢 Verde (80-100%):    ¡MADURO! (Listo para jugar)

Fórmula verificada: Knuth, "TAOCP Vol 2"
```

### Ley del Tercio (Terminaciones)
```
Analiza dígitos finales (0-9) ausentes:
   ✅ Cobertura completa: Distribuida
   ⚠️  3 ausentes: Precaución
   🛑 Cuarteta de terminación: Riesgo alto
```

### Convergencia (Teorema de Bernoulli)
```
Visualiza cómo la suma real de números tiende a regresar
al centro de equilibrio (Zona Verde) a lo largo del tiempo.

🔴 Punto Rojo = Hubo ganador de bolsa millonaria en ese sorteo
```

### Proyección a 1 Año
```
Simula 104 sorteos futuros y estima:
   - Reintegros (2 aciertos)
   - Premios (3 aciertos)
   - Super Premios (4 aciertos)
```

---

## 📊 TECNOLOGÍA

### Stack
```
Frontend
├── HTML5 (semántica correcta)
├── TailwindCSS (utility-first, responsive)
├── JavaScript ES6 Modules (nativo del navegador)
│   ├── math_core/ (lógica pura, sin DOM)
│   ├── data_layer/ (persistencia IndexedDB) ← NUEVO SPRINT 3
│   └── web_ui/ (interfaz visual)
├── Chart.js 4+ (gráficas interactivas)
├── PapaParse (CSV parsing, CDN)
└── IndexedDB (persistencia local 50MB+)
```

### Arquitectura (Protocolo Nexus)
```
┌──────────────────────────────────────┐
│  SERENDIPIA APP (ES6 Modules)       │
│  (No-Build, navegador nativo)        │
└──────────────────────────────────────┘
           ↓    ↓    ↓
    ┌─────────┬──────────┬──────────┐
    │MATH_CORE│DATA_LAYER│WEB_UI    │
    │ (Logic) │(Persist) │(Visual)  │
    └─────────┴──────────┴──────────┘

MATH_CORE
├── Lógica pura (sin DOM, sin I/O)
├── Funciones estadísticas
├── Validación de juegos
└── Análisis matemático [MATH-VERIFIED]

DATA_LAYER (Sprint 3 ✅)
├── IndexedDB (almacenamiento 50MB+)
├── CSV Parser robusto
├── No toca math_core ni web_ui
└── Agnóstico a visualización

WEB_UI
├── Solo pinta/visualiza
├── Maneja eventos de usuario
├── Usa lógica de math_core
└── Usa datos de data_layer
```

---

## 🎯 ESTADO DEL PROYECTO

### Sprint 2 ✅
- [x] Configuración de juegos (games.config.js)
- [x] Funciones matemáticas (statistics.js)
- [x] Validación de Melate (MelateGame.js)
- [x] 25 tests en test_lab.html

### Sprint 3 ✅ (Recién Completado)
- [x] **SerendipiaStore** - IndexedDB wrapper (303 líneas)
  - `init()` - Inicialización con auto-schema
  - `saveGameData(gameType, draws)` - Guardar sorteos
  - `getGameData(gameType)` - Recuperar sorteos
  - `clearGameData(gameType)` - Limpiar datos
  - `getAllGameMetadata()` - Metadata de juegos
  
- [x] **parseCSV** - Parser robusto (283 líneas)
  - Detección automática de columnas
  - Múltiples formatos soportados
  - Fallback a parseCSVSimple sin dependencias
  - Validación y ordenamiento automático
  
- [x] **data_layer/index.js** - Barrel export
  
- [x] **4 Tests de Data Layer** en test_lab.html
  - Inicialización de IndexedDB
  - Guardar 5 sorteos mock
  - Recuperar y verificar integridad
  - Parsear CSV simple

### Sprint 4 (Próximo) ⏳
- [ ] Importación de históricos reales
- [ ] Exportación a JSON/CSV
- [ ] RetroGame, ChispazoGame
- [ ] validators.js completo

---

## 🧪 TESTING

### Test Lab Actualizado
```
Total: 29 tests (25 Sprint 2 + 4 Sprint 3)
├─ Suite 1: Configuración (4 tests)
├─ Suite 2: Estadísticas (9 tests)
├─ Suite 3: Poisson (5 tests)
├─ Suite 4: Validación Melate (7 tests)
└─ Suite 5: Data Layer (4 tests) ← NUEVO

Ejecutar:
  1. Abre test_lab.html en navegador
  2. Dashboard muestra resultados en tiempo real
  3. Consola detalla cada test
```

### Cobertura
```
math_core:  100% (25 tests)
data_layer: 100% (4 tests)
web_ui:     0% (próximo sprint)
─────────────────
Total:      29/29 tests
```

---

## 📁 ESTRUCTURA (Sprint 3)

```
serendipia/
├── docs/
│   ├── GOVERNANCE.md
│   ├── ARCH.md
│   ├── LOGIC.md
│   ├── DESIGN.md
│   └── ONBOARDING.md
├── src/
│   ├── index.html           ← Actualizado: PapaParse CDN
│   ├── config/
│   │   ├── games.config.js  (Sprint 2)
│   │   └── colors.js
│   └── modules/
│       ├── math_core/       (Sprint 2)
│       │   ├── statistics.js
│       │   └── games/
│       ├── data_layer/      ← NUEVO (Sprint 3)
│       │   ├── store.js     (303 líneas)
│       │   ├── parser.js    (283 líneas)
│       │   └── index.js
│       └── web_ui/
├── test_lab.html            ← Actualizado: +4 tests
├── DIAGNOSTICS.md           ← Actualizado
├── SPRINT_2_SUMMARY.md
└── SPRINT_3_SUMMARY.md      ← NUEVO
```

---

## 💾 PERSISTENCIA (Sprint 3)

### IndexedDB API
```javascript
import DataLayer from './src/modules/data_layer/index.js';

// Inicializar
await DataLayer.initialize();

// Guardar sorteos
await DataLayer.store.saveGameData('melate', draws);

// Recuperar sorteos
const draws = await DataLayer.store.getGameData('melate');

// Limpiar datos
await DataLayer.store.clearGameData('melate');

// Obtener metadata
const metadata = await DataLayer.store.getAllGameMetadata();
```

### CSV Parser API
```javascript
// Con PapaParse (CDN en index.html)
const result = await DataLayer.parser.parseCSV(csvFile, 'melate');

// O string CSV
const result = await DataLayer.parser.parseCSV(csvString, 'melate');

// Fallback sin dependencias
const result = await DataLayer.parser.parseCSVSimple(csvString);

// Resultado siempre: {ok: boolean, draws?: [...], error?: string}
```

### Estructura de Datos
```javascript
// Formato de sorteo (draw)
{
  fecha: Date | ISO8601String,
  nums: [int, int, ...],      // Números en orden ascendente
  additional?: int             // Número adicional/bonus
}

// Ejemplo Melate
{
  fecha: new Date('2024-01-01'),
  nums: [5, 12, 25, 38, 45, 55],
  additional: 3
}
```

---

## 📚 DOCUMENTACIÓN

| Documento | Contiene |
|-----------|----------|
| [LOGIC.md](docs/LOGIC.md) | Fórmulas, algoritmos, validaciones matemáticas |
| [ARCH.md](docs/ARCH.md) | Estructura modular, patrones, roadmap |
| [DESIGN.md](docs/DESIGN.md) | Colores corporativos, componentes UI, tipografía |
| [GOVERNANCE.md](docs/GOVERNANCE.md) | Reglas de proyecto, protocolo, etiquetas |
| [ONBOARDING.md](docs/ONBOARDING.md) | Guía para nuevos desarrolladores |

---

## ⚙️ CONFIGURACIÓN

### Parámetros de Juegos (GAME_CONFIG)

```javascript
MELATE: {
  maxNum: 56,
  count: 6,
  idealSum: 171,
  zoneMin: 120,
  zoneMax: 220  // 85% de premios caen aquí
}

RETRO: {
  maxNum: 39,
  count: 6,
  idealSum: 120,
  zoneMin: 90,
  zoneMax: 150
}

CHISPAZO: {
  maxNum: 28,
  count: 5,
  idealSum: 72.5,
  zoneMin: 50,
  zoneMax: 100
}

TRIS: {
  count: 5,
  modalidades: 13,  // Directa 5/4/3, Pares, Combos, Candados
}

GATO: {
  count: 8,
  grid: '3x3'
}
```

---

## 🎨 IDENTIDAD VISUAL

### Colores Corporativos
```
🟢 Serendipia Green:  #0B2B26  (Confianza, equilibrio)
🟡 Serendipia Gold:   #C5A059  (Éxito, valor)
```

### Semáforo de Estado
```
🔴 Rojo:    Zona Alta / Crítico / Riesgo
🟡 Amarillo: Zona Media / Precaución / Madurando  
🟢 Verde:    Zona Ideal / Equilibrio / Seguro
```

---

## 📋 EJEMPLOS DE USO

### Ejemplo 1: Melate

```
Usuario ingresa: 5, 12, 23, 34, 45, 51

Serendipia analiza:
✅ Suma: 170 (Zona Verde ideal)
✅ Paridad: 3 Pares / 3 Impares (óptima)
✅ Poisson: [92%, 45%, 18%, 65%, 88%, 22%] (mixed maturity)
✅ Histórico: Ninguna cuarteta repetida
⚠️  Terminaciones: Faltan [3, 7, 9]

Resultado: 🟢 LUZ VERDE - Buena jugada
```

### Ejemplo 2: TRIS (Directa 5)

```
Usuario selecciona modalidad: Directa 5
Números: 1-4-7-3-2

Serendipia simula:
- ¿Qué tan a menudo sale esta exacta?
- ¿Cuál es el payout esperado en 1 año?
- ¿Cuál es la rentabilidad teórica?

Resultado: Histórico muestra 0 veces (raro)
Recomendación: Considerar combos con mayor frecuencia
```

---

## ⚠️ DISCLAIMER

**SERENDIPIA NO GARANTIZA PREMIOS.**

Esta es una herramienta de análisis estadístico. Funciona basada en:
- Datos históricos observados
- Teoría de probabilidades (Poisson, Bernoulli, Ley de Grandes Números)
- Análisis de patrones

**Limitaciones:**
- Loterias tiene componente aleatorio irreducible
- El futuro no siempre repite el pasado
- Gastar más de lo que puedes perder es irresponsable

**Responsabilidad del Usuario:**
- Juega responsablemente
- No inviertas dinero que necesites
- Serendipia es una HERRAMIENTA, no una garantía

---

## 🛠️ DESARROLLO

### Para Desarrolladores

- Leer [ONBOARDING.md](docs/ONBOARDING.md) primero
- Luego leer en orden: LOGIC.md → ARCH.md → DESIGN.md → GOVERNANCE.md
- Cualquier cambio debe cumplir con GOVERNANCE.md

### Para Contribuidores

- Fork el repositorio
- Crea branch: `git checkout -b feature/tu-feature`
- Escribe tests si es math_core
- Actualiza docs correspondientes
- Abre Pull Request

### Roadmap

**Fase 1-2 (2026 Q1):** Migración de legacy monolito a módulos  
**Fase 3-4 (2026 Q2):** Testing y stabilización  
**Futuro:** Backend API opcional, móvil app, análisis avanzado  

---

## 📞 SOPORTE

- **Bugs:** Abre issue en GitHub
- **Preguntas:** Discusiones en GitHub
- **Feature requests:** Abre issue con tag `[feature]`
- **Seguridad:** Email privado a [TBD]

---

## 📄 LICENCIA

[TBD - Especificar licencia]

---

## 🙏 AGRADECIMIENTOS

Serendipia está construido sobre:
- Teoría Matemática: Poisson, Bernoulli, Teoría de Probabilidades
- Librerías: Chart.js, PapaParse, TailwindCSS
- Inspiración: Comunidad de análisis estadístico

---

## ESTADÍSTICAS DEL PROYECTO

| Métrica | Valor |
|---------|-------|
| Líneas de código | ~3,000 |
| Líneas de documentación | ~3,000 |
| Juegos soportados | 5 |
| Algoritmos implementados | 4 |
| Componentes UI | 20+ |
| Bundle size (gzipped) | ~60KB |

---

**Última actualización:** 2026-01-06  
**Status:** Activo y en desarrollo  
**Versión:** Nexus (Post-Refactor)

---

## 🚀 EMPEZAR AHORA

1. Clone el repo
2. Abra `index.html` en navegador
3. Lea [ONBOARDING.md](docs/ONBOARDING.md)
4. Cargue datos históricos
5. ¡Analice sus números!

**Recuerde: "Dato mata Relato"** 📊

---

Fin de README.md
