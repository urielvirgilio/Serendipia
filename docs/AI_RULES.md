# AI_RULES.md - REGLAS DURAS PARA AGENTES IA (Evitar Alucinaciones)

**Versión:** 1.0  
**Framework:** Kybern v5.1  
**Clasificación:** `[HARD-CONSTRAINTS]`

---

## ⚠️ DIRECTIVA FUNDAMENTAL

```
ROL: CONSTRUCTOR TÉCNICO
LIBERTAD: Alta en implementación
RESTRICCIÓN: Absoluta en invención de reglas

NO inventas reglas de lotería.
NO invencias API que no existe.
NO ignoras GOVERNANCE.md.
NO modificas documentación sin orden explícita.

¿DUDAS? PREGUNTAS. NO ADIVINAS.
```

---

## REGLA 1: FUENTE ÚNICA DE VERDAD

### Antes de Cualquier Cambio - CONSULTA docs/

```
PASO 1: ¿Existe la característica documentada?
   → SÍ: Lee docs/, respeta lo que dice
   → NO: Abre ISSUE, propone, espera aprobación

PASO 2: ¿Coincide el código con docs/?
   → SÍ: Está bien (por ahora)
   → NO: Código está obsoleto, actualiza código + docs

PASO 3: ¿Necesito inventar algo?
   → SÍ → ALTO. NO INVENTES. Abre ISSUE.
   → NO → Procede.
```

### docs/ Folder - Jerarquía de Autoridad

```
[1] GOVERNANCE.md     ← La ley (INALTERADA)
[2] LOGIC.md          ← Fórmulas [MATH-VERIFIED]
[3] ARCH.md           ← Estructura de módulos
[4] DESIGN.md         ← Paleta [DESIGN-LOCKED]
[5] ONBOARDING.md     ← Para humanos (referencia)
[6] README.md         ← Marketing
[7] AGENTS.md         ← Para vos (referencia)
[8] AI_RULES.md       ← Este archivo (referencia)

Conflicto entre código y docs → docs GANA.
Conflicto entre archivo y GOVERNANCE → GOVERNANCE GANA.
```

**NUNCA ignores documentación porque "creo que está mal".**

---

## REGLA 2: NO INVENTAS FORMULAS

### Detección de Alucinación #1: Cálculo Nuevo

**Síntoma:**
```
"Creo que debería calcular la media geométrica de las diferencias"
"Voy a agregar un score de 'sincronización planetaria'"
"Voy a usar Fibonacci para predecir el próximo draw"
```

**Respuesta Correcta:**
```
❌ NO. Detuviste la alucinación.

✅ En lugar de eso:
   - Abre ISSUE: "[FEATURE] Propuesta: nuevo cálculo XYZ"
   - Explica justificación matemática
   - Incluye referencias bibliográficas
   - Espera aprobación Tech Lead
   - DESPUÉS codificas
```

### Algoritmos Documentados (ÚNICOS Permitidos)

```
[PERMITIDOS - Ya documentados en LOGIC.md]
1. Frequency Analysis (Hot/Cold/Medium)
2. Poisson Maturity Distribution
3. Law of Thirds (Terminal Digits)
4. Bernoulli Convergence (Green Zone)
5. Validation Rules (Range, Duplicates, etc)

[PROHIBIDOS - No documentados]
X. Cualquier otro cálculo
X. Cualquier "mejora" no autorizada
X. Cualquier "optimización" que cambie resultado

Si necesitas nuevo algoritmo:
→ Abre ISSUE
→ Proporciona fórmula matemática
→ Proporciona base teórica
→ Espera aprobación
→ DESPUÉS lo implementas y documentes
```

---

## REGLA 3: NO MODIFICAS DOCUMENTACIÓN sin Orden Explícita

### Detección de Alucinación #2: Cambio No Autorizado

**Síntoma:**
```
Me dicen: "Asegúrate de que LOGIC.md sea correcto"
Yo pienso: "Voy a actualizar LOGIC.md porque veo que falta algo"
YO CORRO: git commit -am "Updated LOGIC.md"
```

**RESULTADO:** 🚨 ALUCINACIÓN DETECTADA

**Respuesta Correcta:**
```
Instrucción: "Asegúrate que LOGIC.md sea correcto"

Acción CORRECTA:
1. Leo LOGIC.md entero
2. Verifico que sea consistente con código
3. Si encuentro inconsistencia:
   → Corro el código y confirmo
   → Abro ISSUE: "LOGIC.md está incorrecto en línea X"
   → Espero aprobación para cambiar
   → DESPUÉS hago el cambio

Acción INCORRECTA:
1. Cambio LOGIC.md porque "creo que sé"
2. Comiteo sin aprobación
3. Espero que nadie se dé cuenta
```

### Archivos [PROTECTED]

```
NUNCA modificas SIN orden explícita:

[PROTECTED] docs/GOVERNANCE.md
   → Arquitecto solo
   
[PROTECTED] docs/LOGIC.md (secciones [MATH-VERIFIED])
   → Tech Lead solo
   
[PROTECTED] docs/DESIGN.md (colores [DESIGN-LOCKED])
   → Design Lead solo
   
[PROTECTED] src/ (código con [PROTECTED-LOGIC])
   → Arquitecto/Tech Lead solo

PUEDES actualizar:
✅ docs/ONBOARDING.md (si es mejora pedagógica)
✅ docs/README.md (si es corrección)
✅ docs/AGENTS.md (si es clarificación)
```

**Si necesitas cambiar [PROTECTED]:**
1. Abre ISSUE con justificación detallada
2. Etiqueta apropiadamente
3. Espera APROBACIÓN EXPLÍCITA
4. DESPUÉS aplicas cambio
5. Documentas en commit message: "[APPROVED] Cambio XYZ por [Rol] en Issue #N"

---

## REGLA 4: ESTRUCTURA DE CARPETAS - Ley Inmutable

```
✅ ESTRUCTURA CORRECTA:

Serendipia/
├── docs/
│   ├── LOGIC.md           [PROTECTED - MATH-VERIFIED]
│   ├── DESIGN.md          [PROTECTED - DESIGN-LOCKED]
│   ├── ARCH.md            [Protected - ARCHITECTURE]
│   ├── GOVERNANCE.md      [PROTECTED - LEY]
│   ├── ONBOARDING.md      ✅ Editable
│   ├── README.md          ✅ Editable
│   ├── AGENTS.md          ✅ Referencia
│   └── AI_RULES.md        ✅ Referencia
├── src/
│   └── modules/
│       ├── math_core/     ← Lógica pura, NO DOM
│       ├── data_layer/    ← Persistencia IndexedDB
│       └── web_ui/        ← Componentes, NO cálculos
├── __tests__/
│   ├── math_core/
│   └── web_ui/
├── index.html             ← Punto de entrada
├── style.css              ← Estilos globales
├── main.js                ← Inicializador
└── package.json           (SI NO HAY BACKEND)

❌ ESTRUCTURA INCORRECTA:

Serendipia/
├── src/
│   ├── utils.js           (Falta estructura modular)
│   ├── app.js
│   └── magic.js           (Nombre no descriptivo)
├── Untitled-1.js          (Archivos sueltos = NUNCA)
└── test_mi_codigo.html    (Tests fuera de __tests__)

NUNCA:
❌ Crees archivos en root sin justificación
❌ Creas carpetas "utils" o "lib" inconsistentes
❌ Pones código en index.html
❌ Creas archivos temporales
```

**Si necesitas nueva carpeta:**
1. Verifica que ARCH.md no la incluya ya
2. Abre ISSUE: "[ARCH] Nueva carpeta propuesta: XYZ"
3. Explica responsabilidad
4. Espera aprobación
5. DESPUÉS la creas y documentes en ARCH.md

---

## REGLA 5: NO MODIFIQUES SRC/ Sin Respetar ARCH.md

### Detección de Alucinación #3: Código Freelance

**Síntoma:**
```
Necesito agregar función que calcula "probabilidad de ganancia"
Creo archivo src/probabilidad.js (INCORRECTO)
Debería ser src/modules/math_core/probabilidad.js (CORRECTO)

Necesito guardar análisis del usuario
Creo src/storage.js (INCORRECTO)
Debería ser src/modules/data_layer/user_analysis.js (CORRECTO)

Necesito mostrar gráfico
Creo src/chart.js (INCORRECTO)
Debería ser src/modules/web_ui/charts.js (CORRECTO)
```

**Respuesta Correcta:**
```
Antes de crear CUALQUIER archivo en src/:

Pregúntate:
1. ¿A qué módulo pertenece? (math_core / data_layer / web_ui)
2. ¿Qué responsabilidad tiene?
3. ¿Está ya documentado en ARCH.md?

Si NO está en ARCH.md:
→ Abre ISSUE: "[ARCH] Nuevo módulo propuesto"
→ Espera aprobación
→ DESPUÉS codificas

Si SÍ está en ARCH.md:
→ Respeta la ubicación exacta
→ Respeta la responsabilidad definida
→ Escribe tests
→ Codifica
```

### Responsabilidades Por Módulo (NO NEGOCIABLE)

```
[math_core/]
✅ PUEDES: Funciones puras, cálculos, validaciones
❌ NO PUEDES: Acceso a DOM, HTTP, localStorage

[data_layer/]
✅ PUEDES: IndexedDB, CSV parsing, persistencia
❌ NO PUEDES: Cálculos de lógica, acceso a DOM

[web_ui/]
✅ PUEDES: Componentes, eventos, DOM, visualización
❌ NO PUEDES: Cálculos matemáticos, lógica

Si tu código viola esto → Rechazado. Refactoriza.
```

---

## REGLA 6: GAME_CONFIG - Inmutable sin Cambio Documentado

### Detección de Alucinación #4: Inventar Parámetros de Juego

**Síntoma:**
```
Veo que Melate tiene maxNumber: 56
Pienso "Voy a agregar minNumber: 1"
Cambio GAME_CONFIG sin documentación
Comiteo
```

**RESULTADO:** 🚨 JUEGO MODIFICADO SIN APROBACIÓN

**Respuesta Correcta:**
```
ANTES de tocar GAME_CONFIG:

1. Abre LOGIC.md
   → Lee sección "Game Configurations"
   → Entiende qué es cada parámetro
   → Entiende por qué está ese valor

2. Si necesitas cambiar un parámetro:
   → Abre ISSUE: "[GAME-CONFIG] Cambio propuesto: XYZ"
   → Justificación matemática/regulatoria
   → Impacto en algoritmos
   → Espera aprobación Tech Lead

3. DESPUÉS de aprobación:
   → Cambias GAME_CONFIG
   → Cambias LOGIC.md
   → Ejecutas TODOS los tests
   → Creas PR con [APPROVED] en mensaje
```

### GAME_CONFIG Actual (REFERENCIA)

```javascript
const GAME_CONFIG = {
  melate: {
    name: "Melate",
    positions: 6,
    maxNumber: 56,
    // ... más parámetros
  },
  retro: { /* ... */ },
  chispazo: { /* ... */ },
  tris: { /* ... */ },
  gato: { /* ... */ }
};
```

**Cambios a GAME_CONFIG requieren:**
- [ ] ISSUE abierto
- [ ] Justificación documentada
- [ ] Tech Lead aprobación
- [ ] LOGIC.md actualizado
- [ ] Tests pasados
- [ ] Commit message incluye [APPROVED]

---

## REGLA 7: NO AGREGAS DEPENDENCIAS sin Aprobación

### Detección de Alucinación #5: Npm Freelance

**Síntoma:**
```
Necesito una librería para "optimización"
Corro: npm install lodash

O peor aún:
Agrego manualmente en package.json sin consultar
```

**RESULTADO:** 🚨 DEPENDENCIA NO APROBADA

**Respuesta Correcta:**
```
Necesito librería X

Paso 1: Consulta ARCH.md
   → ¿Qué librerías están autorizadas?
   → Chart.js, PapaParse, etc.

Paso 2: Si X no está autorizada:
   → Abre ISSUE: "[DEPS] Propuesta: agregar librería X"
   → Justifica: ¿por qué es necesaria?
   → Impacto: ¿cuánta complejidad agrega?
   → Alternativa: ¿hay solución sin librería?

Paso 3: Espera aprobación Tech Lead

Paso 4: DESPUÉS de aprobación:
   → Actualiza package.json
   → Actualiza ARCH.md
   → Crea commit con [APPROVED]
```

### Librerías Autorizadas (Ya Incluidas)

```
✅ Chart.js 4.x     - Visualización de gráficos
✅ PapaParse        - Parsing CSV
✅ TailwindCSS      - Framework CSS (CDN dev, build prod)
✅ Vitest           - Testing framework
✅ Playwright       - E2E testing

❌ Lodash           - Demasiado pesada
❌ jQuery           - No necesaria
❌ Moment.js        - Usa Date nativo
❌ Axios            - No hay backend
❌ Next.js, React   - No es arquitectura cliente
```

---

## REGLA 8: PRUEBAS - Obligatorias para math_core

### Detección de Alucinación #6: Código sin Validación

**Síntoma:**
```
Escribo función nueva
"Es muy simple, no necesita tests"
Comiteo sin tests
```

**RESULTADO:** 🚨 CÓDIGO NO VERIFICADO

**Respuesta Correcta:**
```
REGLA: math_core requiere tests (100% coverage)

Paso 1: Escribe función
   function analyze(nums) {
     // ...
   }

Paso 2: Escribe tests INMEDIATAMENTE
   const result1 = analyze([1,5,12,25,38,55]);
   console.assert(result1.ok === true);

Paso 3: Ejecuta tests
   node __tests__/math_core/tu-función.test.js
   
Paso 4: Si tests fallan
   → Debuggea
   → Arregla código
   → Repite paso 3

Paso 5: Si tests pasan
   → Crea PR con tests incluidos

SIN TESTS = SIN MERGE
```

### Test Template

```javascript
// __tests__/math_core/mi-función.test.js

import { miFunción } from '../../src/modules/math_core/mi-función.js';

// Test 1: Caso normal
{
  const result = miFunción([1, 5, 12, 25, 38, 55]);
  console.assert(result.ok === true, 'Test 1 failed: Input válido');
}

// Test 2: Caso vacío
{
  const result = miFunción([]);
  console.assert(result.ok === false, 'Test 2 failed: Debe rechazar vacío');
}

// Test 3: Caso con números fuera de rango
{
  const result = miFunción([1, 5, 12, 25, 38, 999]);
  console.assert(result.ok === false, 'Test 3 failed: Fuera de rango');
}

console.log('✅ Todos los tests pasaron');
```

---

## REGLA 9: COMENTARIOS MATEMÁTICOS - Obligatorios

### Detección de Alucinación #7: Código Misterioso

**Síntoma:**
```javascript
// ❌ PROHIBIDO
const maturity = Math.min(100, Math.round((gap / avgGap) * 100));

// ¿Qué es esto? ¿De dónde salió?
// ¿Qué significa maturity?
// ¿Por qué divide gap / avgGap?
```

**Respuesta Correcta:**
```javascript
// ✅ OBLIGATORIO
/**
 * Poisson Maturity Calculation
 * 
 * Fórmula: MATURITY(%) = min(100, ⌊(GapsSinceDrawn / AvgHistoricalGap) × 100⌋)
 * 
 * Justificación: [MATH-VERIFIED]
 *   Basado en distribución de Poisson para eventos aleatorios.
 *   Un gap es "maduro" cuando alcanza 100% del promedio histórico.
 * 
 * Referencia: LOGIC.md - Sección 2.2 "Análisis de Poisson"
 * 
 * Ejemplo:
 *   gap = 20 (hace 20 draws que no sale este número)
 *   avgGap = 15 (histórico promedio)
 *   maturity = (20/15) × 100 = 133% → capped a 100%
 */
const maturity = Math.min(100, Math.round((gap / avgGap) * 100));
```

**REGLA:**
```
Cada función en math_core DEBE tener:
- Nombre descriptivo
- Comentario de función (qué hace)
- Fórmula matemática (si aplica)
- [MATH-VERIFIED] tag
- Referencia a LOGIC.md
- Ejemplo si es complejo
```

---

## REGLA 10: VERSIONAMIENTO - Commits Limpios

### Detección de Alucinación #8: Commits Crípticos

**Síntoma:**
```
git log muestra:
  "fixed stuff"
  "idk what this does"
  "trying something"
  "WIP"
  "asfasdfsf"
```

**Respuesta Correcta:**
```
Commits deben ser DESCRIPTIVOS:

✅ BUENO:
  "Add Poisson maturity calculation to math_core"
  "[FEATURE] Implement frequency analysis with heatmap"
  "[FIX] Edge case in Law of Thirds for single digit"
  "[DOCS] Update LOGIC.md with new validation rule"
  "[APPROVED] Change GAME_CONFIG per Issue #42"

❌ MALO:
  "fixed"
  "stuff"
  "wip"
  "asdfsdf"
  "plz work"
```

**Formato:**
```
[TAG] Descripción

Tags:
[FEATURE] - Nuevas funcionalidades
[FIX] - Correcciones de bugs
[DOCS] - Cambios en documentación
[REFACTOR] - Mejora de código sin cambio funcional
[APPROVED] - Cambio aprobado (incluye Issue #N)
[TECH-DEBT] - Mejora de arquitectura
```

---

## PROTOCOLO ANTI-ALUCINACIÓN

### Cuando Dudas - ALTO

**Situación:**
```
Me piden: "Optimiza la búsqueda de números frecuentes"

Yo pienso:
  - ¿Está documentada la búsqueda en LOGIC.md?
  - ¿Qué significa "optimizar"?
  - ¿Es cambio funcional o solo performance?
  - ¿Necesito mantener resultados compatibles?
```

**Acción Correcta:**
```
ANTES de cualquier código:
1. Abre ISSUE: "[CLARIFICATION] Qué significa optimizar búsqueda"
2. Describe lo que entiendes
3. Proporciona alternativas
4. Espera respuesta
5. DESPUÉS codificas
```

**NO ADIVINES. PREGUNTAS.**

### Verificación de Integridad Pre-Commit

```
Antes de hacer commit, responde:

[ ] ¿Consulté docs/ antes de codificar?
[ ] ¿Mi código respeta ARCH.md?
[ ] ¿Si es math_core, escribí tests?
[ ] ¿Si cambio fórmula, tienen [MATH-VERIFIED]?
[ ] ¿Si cambio color, tienen [DESIGN-LOCKED]?
[ ] ¿Mi commit message es descriptivo?
[ ] ¿No inventé nada no documentado?
[ ] ¿No violé GOVERNANCE.md?

Si respuesta es "NO" a cualquiera:
→ DETENTE
→ Abre ISSUE
→ Espera aprobación
→ DESPUÉS continúas
```

---

## TABLA RÁPIDA: ¿Puedo Hacer Esto?

| Acción | ¿Sí? | Proceso |
|--------|------|---------|
| Agregar función a math_core | ✅ | Codifica, test, PR |
| Cambiar fórmula existente | ❌ | ISSUE → Aprobación → Código |
| Agregar componente UI | ✅ | Codifica, actualiza DESIGN.md, PR |
| Cambiar color oficial | ❌ | ISSUE → Aprobación → Código |
| Refactorizar módulo | ⚠️ | ISSUE primero si es grande |
| Agregar librería npm | ❌ | ISSUE → Aprobación → Código |
| Crear archivo en src/ | ⚠️ | Consulta ARCH.md, respeta estructura |
| Modificar LOGIC.md | ❌ | ISSUE → Aprobación → Código |
| Modificar GOVERNANCE.md | ❌ | Solo Architect |
| Escribir tests | ✅ | Siempre, para math_core |

---

## RESUMEN FINAL

```
┌─────────────────────────────────────────────────────┐
│                REGLAS FUNDAMENTALES                 │
│                                                     │
│ 1. docs/ es VERDAD ÚNICA                            │
│ 2. NO INVENTAS fórmulas                             │
│ 3. NO MODIFICAS docs/ sin aprobación                │
│ 4. RESPETAS ARCH.md (estructura fija)               │
│ 5. GAME_CONFIG es SAGRADO                           │
│ 6. DEPENDENCIAS requieren aprobación                │
│ 7. math_core requiere tests                         │
│ 8. CÓDIGO requiere comentarios matemáticos          │
│ 9. COMMITS son descriptivos                         │
│ 10. DUDAS = PREGUNTAS (no adivinanzas)              │
│                                                     │
│ Si violas estas: Código RECHAZADO.                  │
│ Si dudas: ISSUE PRIMERO, código DESPUÉS.            │
└─────────────────────────────────────────────────────┘
```

**Eres un Constructor. Construye dentro de las reglas. Siempre.**

---

Fin de AI_RULES.md
