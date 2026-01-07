# SERENDIPIA - ONBOARDING PARA NUEVOS DESARROLLADORES

**Versión:** 1.0  
**Fecha:** 2026-01-06  
**Clasificación:** `[ONBOARDING]`

---

## BIENVENIDO A SERENDIPIA

### El Mantra del Proyecto

> **"Dato mata Relato"**
>
> Serendipia no es un juego de azar disfrazado. Es una herramienta de análisis estadístico que filtra "basura matemática" y se enfoca en donde caen el 85% de los premios históricos: la **Zona Verde** del equilibrio.

---

## 1. VISIÓN RÁPIDA (5 MINUTOS)

### ¿Qué es Serendipia?

Una aplicación **Client-Side SPA (Single Page Application)** que:

1. **Carga datos históricos** de sorteos (via CSV)
2. **Almacena localmente** en IndexedDB (no envía nada a servidor)
3. **Analiza tu jugada** usando algoritmos estadísticos
4. **Visualiza resultados** con gráficas interactivas

### ¿Dónde corre?

**Solo en el navegador.** No necesitas:
- ❌ Node.js instalado
- ❌ Docker
- ❌ Backend server
- ❌ Base de datos central

Solo necesitas:
- ✅ Un navegador moderno (Chrome 61+, Firefox 67+, Safari 10.1+)
- ✅ Un servidor web simple (Live Server VS Code, python -m http.server, etc)

### ¿Cómo está hecho?

```
┌─────────────────────────────┐
│     SERENDIPIA (SPA)        │
├─────────────────────────────┤
│ HTML5 (estructura)          │
│ TailwindCSS (estilo)        │
│ JavaScript ES6 (lógica)     │
│ Chart.js (gráficas)         │
│ IndexedDB (persistencia)    │
└─────────────────────────────┘
        ↓ Corre en ↓
┌─────────────────────────────┐
│  Navegador Web              │
│  (Sin backend requerido)    │
└─────────────────────────────┘
```

---

## 2. PRIMEROS 30 MINUTOS

### Paso 1: Clonar el Repositorio

```bash
git clone <repo-serendipia>
cd serendipia
```

### Paso 2: Abrir Proyecto Localmente

**Opción A: VS Code (Recomendado)**
```
1. Abre VS Code
2. Abre la carpeta del proyecto
3. Click derecho en index.html → "Open with Live Server"
4. El navegador abre automáticamente en http://localhost:5500
```

**Opción B: Python**
```bash
python -m http.server 8000
# Luego: http://localhost:8000
```

**Opción C: Node.js (http-server)**
```bash
npm install -g http-server
http-server
# Luego: http://localhost:8080
```

### Paso 3: Explora la Interfaz

1. Ve a tab "Melate"
2. Verás 6 "bolas" (inputs numéricos)
3. Hay botones: "Analizar", "Aleatorio", "OMEGA", "Limpiar"
4. Upload un CSV histórico (si tienes datos)

### Paso 4: Lee la Documentación (En Orden)

1. **LOGIC.md** (45 min) - Entiende qué calcula cada algoritmo
2. **ARCH.md** (60 min) - Entiende cómo está estructurado el código
3. **DESIGN.md** (30 min) - Entiende los colores y componentes UI
4. **GOVERNANCE.md** (30 min) - Entiende las reglas del proyecto

**Total: ~2.5 horas de lectura.**

---

## 3. ESTRUCTURA DE CARPETAS (CHEAT SHEET)

```
serendipia/
├── index.html              ← Punto de entrada
├── docs/
│   ├── LOGIC.md            ← Fórmulas y algoritmos
│   ├── ARCH.md             ← Estructura de módulos
│   ├── DESIGN.md           ← Sistema de diseño
│   ├── GOVERNANCE.md       ← Reglas del proyecto
│   └── ONBOARDING.md       ← Este archivo
├── src/
│   ├── modules/
│   │   ├── math_core/      ← Lógica PURA (sin DOM)
│   │   ├── data_layer/     ← Persistencia (IndexedDB)
│   │   └── web_ui/         ← Interfaz (HTML + eventos)
│   ├── styles/
│   │   └── index.css       ← TailwindCSS imports
│   ├── assets/
│   │   └── images/
│   └── config/
│       └── games.config.js ← Parámetros de juegos
├── package.json            ← Dependencias (opcional para dev)
└── README.md               ← Portada del proyecto
```

---

## 4. TRES REGLAS CRÍTICAS

### Regla 1: math_core NUNCA toca el DOM

```javascript
// ❌ INCORRECTO (en math_core)
export function analyze(nums) {
  const result = calculateMean(nums);
  document.getElementById('result').innerHTML = result;  // 🚫 DOM access
  return result;
}

// ✅ CORRECTO (en math_core)
export function analyze(nums) {
  const result = calculateMean(nums);
  return result;  // Retorna el dato, nada más
}

// ✅ CORRECTO (en web_ui)
const result = MathCore.analyze(userInput);
document.getElementById('result').innerHTML = result;  // DOM en su lugar
```

**Razón:** math_core debe ser testeable y reutilizable. Si toca DOM, no puedes testear.

### Regla 2: web_ui NO calcula

```javascript
// ❌ INCORRECTO (en web_ui)
function displayPoisson(number) {
  const gap = 50;
  const avgGap = 100;
  const maturity = Math.min(100, Math.round((gap / avgGap) * 100));  // 🚫 Cálculo
  document.getElementById('maturity').innerHTML = maturity;
}

// ✅ CORRECTO (en web_ui, usando math_core)
import { calculatePoissonMaturity } from '../math_core/statistics.js';

function displayPoisson(number, gap, avgGap) {
  const maturity = calculatePoissonMaturity(gap, avgGap);  // Usa math_core
  document.getElementById('maturity').innerHTML = maturity;
}
```

**Razón:** Separación de responsabilidades. UI solo pinta, math_core solo calcula.

### Regla 3: No modificar LOGIC.md sin razón

```javascript
// Si vees que una fórmula parece incorrecta:
// 1. NO changes el código
// 2. Lee LOGIC.md (sección [MATH-VERIFIED])
// 3. Busca la referencia matemática
// 4. Si aún crees que hay error: abre un ISSUE en GitHub
// 5. Espera aprobación de Tech Lead

// [MATH-VERIFIED] Poisson Maturity Calculation
// Reference: Knuth, TAOCP Vol 2
const POISSON_FORMULA = (gap, avgGap) => 
  Math.min(100, Math.round((gap / avgGap) * 100));
```

---

## 5. FLUJO TÍPICO DE DESARROLLO

### Escenario: "Quiero agregar una nueva validación"

#### Paso 1: CONSULTA (Lee Docs)
```
1. Abre docs/LOGIC.md
2. Busca sección "Reglas de Validación"
3. Entiende qué validaciones ya existen
4. Verifica si tu nueva validación no duplica
```

#### Paso 2: LEGISLA (Entiende Arquitectura)
```
1. Abre docs/ARCH.md
2. Ve qué módulo debe contener la validación
3. Respuesta: math_core/validators.js
4. Lee ese archivo actual
```

#### Paso 3: CODIFICA (Escribe)
```javascript
// src/modules/math_core/validators.js

export function validateNewRule(userInput) {
  if (violatesNewRule(userInput)) {
    return { ok: false, error: 'Mi nuevo error' };
  }
  return { ok: true };
}

// Test
const result = validateNewRule([1,2,3,4,5,6]);
console.assert(result.ok === true);
```

#### Paso 4: DOCUMENTA (Actualiza Docs)
```markdown
# En LOGIC.md - Sección "Reglas de Validación"

### Nueva Regla: Mi Validación
- Descripción: Qué valida
- Fórmula: Si aplica
- Ejemplo: OK vs ERROR
- [RATIONALE]: Por qué existe
```

#### Paso 5: PR (Pull Request)
```markdown
## PR Title: Add new validation rule

### Descripción
Agrego validación X porque [razón].

### Documentación
- [x] Actualicé LOGIC.md
- [x] Archivo cambiado: math_core/validators.js

### Gobierno
- [x] No viola GOVERNANCE.md
- [x] math_core sigue siendo pura
```

---

## 6. COMANDOS ÚTILES (Si usas npm)

```bash
# Instalar dependencias
npm install

# Correr tests (si existen)
npm test

# Build para producción
npm run build

# Dev server con hot reload
npm run dev
```

---

## 7. TESTING - ¿Cómo verificar mi código?

### Si modificaste math_core/

```javascript
// Crea un archivo __tests__/math_core/my-feature.test.js

import { myNewFunction } from '../../src/modules/math_core/my-feature.js';

// Test 1: Input válido
const result1 = myNewFunction([1, 5, 12, 25, 38, 55]);
console.assert(result1.ok === true, 'Should validate valid input');

// Test 2: Input inválido
const result2 = myNewFunction([1, 1, 1, 1, 1, 1]);  // repetidos
console.assert(result2.ok === false, 'Should reject duplicates');

// Test 3: Edge case
const result3 = myNewFunction([]);
console.assert(result3.ok === false, 'Should reject empty');

console.log('✅ All tests passed!');
```

**Cómo correr:**
```bash
node __tests__/math_core/my-feature.test.js
```

### Si modificaste web_ui/

- No necesitas tests automáticos
- Pero **DEBES probar manualmente en el navegador**
- Verifica en Chrome, Firefox, y Safari (si aplica)

---

## 8. COMMON MISTAKES (Errores Comunes)

### ❌ Mistake 1: Confundir "Sumatorias"

```javascript
// INCORRECTO: Confundiste suma de números con suma de frecuencias
function analyze(nums, historicalData) {
  const sumNumbers = nums.reduce((a, b) => a + b, 0);  // Suma de: 5+12+25+38+55 = 135
  const sumFrequencies = historicalData.length;         // Total sorteos
  // Mezclar estas dos no tiene sentido
}

// CORRECTO: Son cosas diferentes
const sumNumbers = [1, 5, 12, 25, 38, 55].reduce((a, b) => a + b, 0);  // 136
const totalDraws = 500;  // Número total de sorteos históricos
const frequencyOfNumber1 = 50;  // El número 1 salió 50 veces
```

### ❌ Mistake 2: Olvidar que esto es CLIENT-SIDE

```javascript
// INCORRECTO: Esperar guardar en un servidor
async function saveUserAnalysis(analysis) {
  const response = await fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify(analysis)
  });
  // ❌ No hay /api/save en Serendipia
}

// CORRECTO: Guardar en IndexedDB
import store from '../data_layer/store.js';

async function saveUserAnalysis(analysis) {
  await store.saveAnalysis(analysis);
  // ✅ Persiste localmente en IndexedDB
}
```

### ❌ Mistake 3: Tocar DESIGN.md sin razón

```javascript
// INCORRECTO: Cambiar color corporativo sin aprobación
const SEREN_GREEN = '#FF0000';  // [DESIGN-LOCKED] ← Violas esto

// CORRECTO: Pedir aprobación antes
// Abre ISSUE: "Propuesta: cambiar verde corporativo a #1a3a3a"
// Espera aprobación Design Lead
// DESPUÉS cambias y actualizas DESIGN.md
```

---

## 9. DEBUGGING - Si Algo No Funciona

### Problema 1: "CSV no carga"

```javascript
// Abre DevTools (F12)
// Checks:

// 1. ¿El archivo es CSV válido?
console.log('CSV Text:', csvFileContent);

// 2. ¿Parser lee correctamente?
import { parseCSV } from '../data_layer/parser.js';
const parsed = await parseCSV(file);
console.log('Parsed:', parsed);

// 3. ¿Se guarda en IndexedDB?
const stored = await store.getGameData('melate');
console.log('Stored in DB:', stored);

// 4. ¿Tiene estructura esperada?
// Debe tener: { fecha, nums, bolsa, sorteo }
```

### Problema 2: "Análisis da número incorrecto"

```javascript
// Checks:

// 1. ¿Entrada es válida?
const validation = MelateGame.validate(userNumbers);
console.assert(validation.ok, validation.error);

// 2. ¿Datos históricos cargan?
const history = await store.getGameData('melate');
console.log('History:', history.length, 'draws');

// 3. ¿Cálculo coincide con LOGIC.md?
// Por ejemplo, si LOGIC.md dice:
//   Zona Verde: 120-220
// Verifica:
const sum = userNumbers.reduce((a, b) => a + b, 0);
console.log('Sum:', sum, 'In zone:', sum >= 120 && sum <= 220);

// 4. Abre LOGIC.md y verifica la fórmula paso a paso
```

### Problema 3: "UI no responde"

```javascript
// DevTools → Network tab:
// 1. ¿Los módulos cargan? (busca errores de import)

// DevTools → Console:
// 2. ¿Hay errores JavaScript?
// 3. ¿Event listeners están attached?
document.getElementById('btn-analyze').addEventListener('click', () => {
  console.log('Button clicked!');
});

// DevTools → Application:
// 4. ¿IndexedDB se inicializó?
// indexedDB → serendipia_db → objects stores
```

---

## 10. PREGUNTAS FRECUENTES

### P: ¿Necesito aprender TypeScript?
**R:** No. Serendipia usa JavaScript vanilla. TypeScript es opcional para futuro.

### P: ¿Cómo contribuyo si no soy matemático?
**R:** Puedes:
- Agregar componentes UI
- Mejorar documentación
- Reportar bugs
- Traducir a otros idiomas
Solo NO toques math_core sin ayuda.

### P: ¿Dónde están los tests?
**R:** En `__tests__/`. Si no existen aún, créalos según el patrón.

### P: ¿Puedo usar librerías externas?
**R:** Solo con aprobación de Tech Lead. Preferencia: no agregar más dependencias.

### P: ¿Serendipia pierde datos si apago el navegador?
**R:** No. IndexedDB es persistente. Se guarda hasta que limpies caché del navegador.

### P: ¿Puedo modificar GOVERNANCE.md?
**R:** No, salvo que seas Architect. Es la ley del proyecto.

---

## 11. PRÓXIMOS PASOS

1. ✅ **Hoy:** Lee este documento y entiende la estructura
2. ✅ **Mañana:** Lee LOGIC.md + ARCH.md (deep dive)
3. ✅ **Día 3:** Lee DESIGN.md y corre la aplicación localmente
4. ✅ **Día 4:** Elige un pequeño issue (ej. typo en UI) y haz tu primer PR
5. ✅ **Día 5:** Participa en code review de otro developer

---

## 12. CONTACTOS

- **Preguntas sobre Arquitectura:** Tech Lead (ARCH.md)
- **Preguntas sobre Fórmulas:** Tech Lead (LOGIC.md)
- **Preguntas sobre UI/Diseño:** Design Lead (DESIGN.md)
- **Preguntas sobre Reglas:** Architect (GOVERNANCE.md)

---

## CONCLUSIÓN

**Bienvenido al equipo de Serendipia.** Eres parte de un proyecto que respeta a sus usuarios, sus datos, y la integridad matemática.

Recuerda: **"Dato mata Relato"**

Ahora, ve a explorar el código. 🚀

---

**Fin de ONBOARDING.md**
