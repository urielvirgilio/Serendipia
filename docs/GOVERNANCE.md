# SERENDIPIA - GOVERNANCE & PROTOCOLS

**Versión:** 1.0 (Nexus Protocol)  
**Fecha:** 2026-01-06  
**Clasificación:** `[GOVERNANCE]`  
**Status:** Activo

---

## PREÁMBULO

Este documento establece las reglas de gobernanza para el proyecto **Serendipia**. Todos los desarrolladores (humanos e IA) deben adherirse a estas normas. No es una guía de estilo, es una **ley del proyecto**.

### Visión Fundamental
> "Dato mata Relato. La lógica matemática debe ser verificable, inmutable y testeable."

---

## 1. PROTOCOLO NEXUS - ESTRUCTURA MANDATORIA

### 1.1 División en Tres Reinos

```
src/modules/
├── math_core/      [REINO DE LA VERDAD]
├── data_layer/     [REINO DE LA PERSISTENCIA]
└── web_ui/         [REINO DE LA VISUALIZACIÓN]
```

**Cada reino tiene responsabilidades inalienables:**

| Reino | Responsabilidad | Prohibición |
|-------|-----------------|------------|
| **math_core** | Cálculos puros, validación, algoritmos | NO tocar DOM. NO hacer I/O. NO mutar global state |
| **data_layer** | Lectura/escritura IndexedDB, parsing CSV | NO hacer cálculos lógicos. NO renderizar HTML |
| **web_ui** | Renderizado, manejo de eventos, UX | NO calcular fórmulas. NO lógica de negocio |

**Violación = Refactor obligatorio.**

### 1.2 Regla de Oro Suprema

```
┌─────────────────────────────────────────────────────────┐
│ LA LÓGICA MATEMÁTICA ES PURA Y NO TOCA EL DOM.         │
│ LA INTERFAZ NO CALCULA NADA, SOLO PINTA.               │
│                                                         │
│ Estas líneas son INVIOLABLES.                          │
└─────────────────────────────────────────────────────────┘
```

**Corolarios:**

1. `math_core/` NUNCA importa de `web_ui/`
2. `web_ui/` SOLO importa funciones puras de `math_core/`
3. `data_layer/` es agnóstico a ambos (es una interfaz)

---

## 2. ARQUEOLOGÍA DE CAMBIOS - "Consulta -> Legisla -> Codifica"

### 2.1 Ciclo de Decisión

```
1. CONSULTA
   ↓
   Lee LOGIC.md (¿Qué dice la matemática?)
   Lee DESIGN.md (¿Qué dice el diseño?)
   Lee ARCH.md (¿Qué dice la arquitectura?)
   ↓

2. LEGISLA
   ↓
   ¿Viola alguna regla de GOVERNANCE.md?
   ¿Necesita etiqueta [PROTECTED]?
   ¿Afecta a math_core? → Necesita test
   ↓

3. CODIFICA
   ↓
   Escribe código adhiriendo a todas las normas
   Ejecuta tests si es math_core
   Crea PR con descripción de cambios
```

### 2.2 Matriz de Autorización

| Cambio | Requiere Review | Requiere Test | Requiere Etiqueta |
|--------|-----------------|---------------|-------------------|
| Agregar función a `math_core/` | ✅ Sí | ✅ Sí | ✅ Si es crítica |
| Agregar componente UI a `web_ui/` | ✅ Sí | ❌ No | ❌ No |
| Modificar fórmula Poisson | ✅ SÍ (BLOQUEADO) | ✅ SÍ | ✅ [MATH-VERIFIED] |
| Cambiar paleta de colores | ✅ Sí | ❌ No | ✅ [DESIGN-UPDATED] |
| Agregar endpoint (futuro backend) | ✅ SÍ | ✅ SÍ | ✅ [LEGACY-COMPAT] |

---

## 3. PROTOCOLO DE PRESERVACIÓN - ETIQUETAS CRÍTICAS

### 3.1 Etiquetas de Inmutabilidad

```javascript
// [MATH-VERIFIED] - Fórmula verificada contra literatura matemática
// No cambiar sin prueba matemática rigurosa
function calculatePoissonMaturity(gap, avgGap) {
  // [MATH-VERIFIED] Poisson Distribution - Knuth, "TAOCP Vol 2"
  return Math.min(100, Math.round((gap / avgGap) * 100));
}

// [PROTECTED-LOGIC] - Lógica de negocio crítica
// Cambios requieren aprobación de Product
function validateMelateNumbers(nums) {
  // [PROTECTED-LOGIC] Regla: 6 números, rango 1-56, sin repeticiones
  if (nums.length !== 6) throw new Error('Se requieren 6 números');
  // ...
}

// [DESIGN-LOCKED] - Color corporativo
// Cambios requieren aprobación de Brand/Design
const SEREN_GREEN = '#0B2B26'; // [DESIGN-LOCKED]
const SEREN_GOLD = '#C5A059';  // [DESIGN-LOCKED]

// [LEGACY-COMPAT] - Compatible con versión anterior
// Cambios pueden romper compatibilidad
function parseCSV(file) {
  // [LEGACY-COMPAT] v38.2 legacy parsers depend on this signature
  // ...
}
```

### 3.2 Matriz de Etiquetas

| Etiqueta | Significado | Autoridad | Acción Requerida |
|----------|-------------|-----------|-----------------|
| `[MATH-VERIFIED]` | Fórmula verificada matemáticamente | Tech Lead | No cambiar sin prueba |
| `[PROTECTED-LOGIC]` | Lógica de negocio crítica | Product | Aprobación requerida |
| `[DESIGN-LOCKED]` | Identidad visual | Design Lead | No cambiar sin aprob. |
| `[LEGACY-COMPAT]` | Compatible con v38.2 | Architect | Documentar cambios rotos |
| `[PERF-CRITICAL]` | Código de performance | Tech Lead | Benchmarks requeridos |
| `[SECURITY-CRITICAL]` | Seguridad | Tech Lead | Audit requerido |
| `[TODO-REFACTOR]` | Refactor pendiente | Desarrollador | No agregar features |

---

## 4. CONFIGURACIÓN TÉCNICA - ESTÁNDARES OBLIGATORIOS

### 4.1 Stack Prohibido y Permitido

**PERMITIDO:**
```
✅ HTML5 (semántico)
✅ CSS3 + TailwindCSS (utility-first)
✅ JavaScript ES6 Modules (nativo del navegador)
✅ Chart.js 4+ (gráficas interactivas)
✅ PapaParse (CSV parsing)
✅ IndexedDB (persistencia)
✅ Web APIs (Fetch, File, Storage, Audio)
```

**PROHIBIDO:**
```
❌ React, Vue, Angular, Svelte
❌ Node.js build tools (excepto para dev tooling)
❌ Webpack, Babel, PostCSS (excepto TailwindCSS CLI)
❌ Python, Docker, Docker Compose
❌ Backend frameworks (Express, Django, Flask)
❌ TypeScript (sin aprobación de Tech Lead)
❌ jQuery, Lodash, underscore.js
❌ Global variables en window scope
```

**RAZÓN:** Serendipia es un Client-Side Monolith. Mantener simpleza = mantenibilidad.

### 4.2 Convenciones de Nombres

```javascript
// math_core functions: camelCase + sufijo función
calculateMean()              // ✅
computePoisson()             // ✅
calculateMean_OLD()          // ❌ Usa comentario, no versiones

// Classes: PascalCase
class GameStrategy { }        // ✅
class MelateGame { }          // ✅
class UI_Component { }        // ❌ Use UIComponent

// Constants: UPPER_SNAKE_CASE
const HOT_THRESHOLD = 0.12    // ✅
const PRIMES = [2,3,5,7,...]  // ✅
const hotThreshold = 0.12     // ❌ Use UPPER_SNAKE_CASE

// Private methods: _camelCase (convención, no enforced)
_validateInput()              // ✅
#validateInput()              // ✅ Modern private fields

// Component files: PascalCase.js
Ball.js                       // ✅
RangeSlider.js                // ✅
ballInput.js                  // ❌ Use PascalCase

// Utility/Helper files: camelCase.js
helpers.js                    // ✅
mathHelpers.js                // ✅
```

### 4.3 Estructura de Importes

```javascript
// Correcto: Importar lo necesario
import { calculateMean } from '../math_core/statistics.js';

// Incorrecto: Importar todo el módulo
import * as math from '../math_core/statistics.js';

// Correcto: Agrupar importes
import { GameStrategy } from './GameStrategy.js';
import { MelateGame } from './MelateGame.js';
import { GAME_CONFIG } from '../../config/games.config.js';

// Incorrecto: Importes dispersos
import GameStrategy from './GameStrategy.js';
import MelateGame from './games/MelateGame.js';
import config from '../../game-config.js';
```

---

## 5. CONTROL DE CAMBIOS - VERSIONING & CHANGELOG

### 5.1 Versionado Semántico

```
MAJOR.MINOR.PATCH-VARIANT

Ejemplo: 2.1.0-nexus (Versión 2, Minor 1, Patch 0, Variant Nexus)

MAJOR: Cambio arquitectónico (v1 = legacy, v2 = nexus)
MINOR: Feature nueva sin romper compatibilidad
PATCH: Bug fix
VARIANT: nexus (cliente), legacy (viejo monolito)
```

### 5.2 Changelog Format

```markdown
## [2.1.0-nexus] - 2026-01-15

### Added
- Feature X [FEATURE-ID-123]

### Changed
- Updated color palette [DESIGN-LOCKED]

### Fixed
- Bug in Poisson calculation [MATH-VERIFIED] [PR-456]

### Security
- Fixed XSS vulnerability in CSV parser [SECURITY-CRITICAL]

### Breaking Changes
- Removed `legacyCSVFormat()` - use `parseCSV()` instead [LEGACY-COMPAT]
```

---

## 6. ROLES Y AUTORIDADES

### 6.1 Matriz de Aprobaciones

| Rol | Autoridad | Decide sobre |
|-----|-----------|-------------|
| **Architect** | Máxima | Cambios ARCH.md, protocolo Nexus |
| **Tech Lead** | Alta | Cambios math_core, performance |
| **Product Lead** | Alta | Cambios en reglas de juego [PROTECTED-LOGIC] |
| **Design Lead** | Alta | Cambios DESIGN.md, identidad visual |
| **Developer** | Media | Features nuevas, bug fixes |
| **Junior Dev** | Baja | Código siguiendo normas, ask questions |

### 6.2 Pull Request Checklist

```markdown
## PR Template

### Descripción
[ ] Qué cambio hago

### Tipo de Cambio
- [ ] Bug fix (no breaking change)
- [ ] Feature nueva (backwards-compatible)
- [ ] Breaking change
- [ ] Documentación

### Gobierno
- [ ] Consulté docs/ antes de codificar
- [ ] No violé ninguna regla GOVERNANCE.md
- [ ] Si toqué math_core: incluyo tests
- [ ] Si toqué DESIGN.md: incluyo evidencia visual

### Etiquetas Requeridas
- [ ] [MATH-VERIFIED] si toqué fórmulas
- [ ] [PROTECTED-LOGIC] si toqué reglas de juego
- [ ] [DESIGN-LOCKED] si toqué colores
- [ ] [BREAKING-CHANGE] si rompo compatibilidad

### Tests
- [ ] Unit tests (si math_core)
- [ ] Manual testing (si web_ui)
- [ ] Verificación de docs (todos)

### Sign-off
- [ ] Architect review (si architecture)
- [ ] Tech Lead review (si math_core)
- [ ] Design Lead review (si DESIGN.md)
```

---

## 7. DOCUMENTACIÓN COMO FUENTE DE VERDAD

### 7.1 Jerarquía de Autoridad

```
1. GOVERNANCE.md (esta documento)
   ↓ Define las reglas del juego
   ↓
2. LOGIC.md
   ↓ Define qué calcula cada algoritmo
   ↓
3. ARCH.md
   ↓ Define cómo está estructurado
   ↓
4. DESIGN.md
   ↓ Define cómo se ve
   ↓
5. Código fuente
   ↓ Implementa lo anterior
```

**Si hay conflicto entre código y docs: docs gana. Refactor el código.**

### 7.2 Actualización de Documentación

Cuando cambies:
- **LOGIC.md:** Si cambia fórmula, algoritmo, o validación
- **ARCH.md:** Si cambia estructura de módulos o patrón de diseño
- **DESIGN.md:** Si cambia UI, colores, o componentes
- **GOVERNANCE.md:** Si cambia una regla de proyecto (raro)

**Nunca actualices docs DESPUÉS de codificar. Actualiza ANTES y usa como contrato.**

---

## 8. QUALITY GATES - UMBRALES DE ACEPTACIÓN

### 8.1 Criterios de Aceptación

```
Para que un PR sea mergeado:

- ✅ Código adhiere a GOVERNANCE.md
- ✅ Código adhiere a ARCH.md
- ✅ Código adhiere a DESIGN.md
- ✅ Si math_core: tests pasen 100%
- ✅ Si web_ui: no rompe regresión visual
- ✅ Documentación actualizada
- ✅ Aprobación de autoridad correspondiente
```

### 8.2 Test Coverage (Si aplica math_core)

```
Mínimo requerido: 80% coverage

- 100% coverage: Funciones críticas [MATH-VERIFIED]
- 90% coverage: Validación de entrada
- 80% coverage: Helpers y utilidades
```

---

## 9. INCIDENT RESPONSE - CUANDO ALGO SE ROMPE

### 9.1 Severidades

| Severidad | Descripción | Acción |
|-----------|-------------|--------|
| **CRÍTICO** | Fórmula matemática incorrecta | Revertir + hotfix + audit |
| **ALTO** | Feature no funciona | Hotfix inmediato + root cause |
| **MEDIO** | UX broken | Fix en próximo sprint |
| **BAJO** | Typo, minor UX issue | Incluir en próximo PR |

### 9.2 Protocolo de Revertir

```
1. Si detectas incidente CRÍTICO:
   - Revertir PR inmediatamente
   - Notificar Tech Lead
   - No mergear hasta root cause

2. Root cause analysis:
   - ¿Violó GOVERNANCE.md?
   - ¿No pasó tests?
   - ¿No siguió checklist?

3. Prevención:
   - Actualizar checklist
   - Agregar test para futura
   - Documentar lección aprendida
```

---

## 10. ANEXOS

### 10.1 Checklist de Cumplimiento

```markdown
## Cumplimiento de GOVERNANCE - Auto-Audit

- [ ] Mi código respeta la división math_core/data_layer/web_ui
- [ ] math_core/ no importa web_ui
- [ ] web_ui no contiene lógica matemática
- [ ] Seguí convenciones de nombres
- [ ] Agregué etiquetas [PROTECTED] si es necesario
- [ ] Actualicé documentación correspondiente
- [ ] Pasé tests (si math_core)
- [ ] Verifiqué contra DESIGN.md (si UI)
```

### 10.2 Contactos de Autoridad

```
Architect:   [TBD - Tech Lead de Proyecto]
Tech Lead:   [TBD - Responsable math_core]
Product:     [TBD - Dueño del producto]
Design:      [TBD - Design system owner]
```

---

## CONCLUSIÓN

**Serendipia es un proyecto responsable que maneja datos sensibles de usuarios.** Esta gobernanza garantiza que:

1. **Integridad Matemática:** Los algoritmos son verificables y no cambian accidentalmente
2. **Mantenibilidad:** La arquitectura modular previene spaghetti code
3. **Escalabilidad:** Nuevos desarrolladores pueden onboarding rápidamente
4. **Seguridad:** Los cambios pasan por review antes de merging

**Cada línea de código es un compromiso con esta gobernanza.**

---

**Fin de GOVERNANCE.md**
