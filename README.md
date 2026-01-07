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
│   ├── data_layer/ (persistencia IndexedDB)
│   └── web_ui/ (interfaz visual)
├── Chart.js 4+ (gráficas interactivas)
└── IndexedDB (persistencia local 50MB+)

Dependencias Mínimas
├── chart.js
├── chartjs-plugin-zoom
├── papaparse (CSV parsing)
└── idb (IndexedDB wrapper)
```

### Arquitectura
```
┌─────────────────────────────────┐
│  math_core/ (Lógica Pura)      │
│  - Sin DOM                      │
│  - 100% Testeable               │
│  - Verificado matemáticamente   │
└─────────────────────────────────┘
           ↓ usada por ↓
┌─────────────────────────────────┐
│  data_layer/ (Persistencia)     │
│  - IndexedDB                    │
│  - CSV Parsing                  │
│  - Agnóstico a UI               │
└─────────────────────────────────┘
           ↓ usada por ↓
┌─────────────────────────────────┐
│  web_ui/ (Interfaz)             │
│  - Solo pinta                   │
│  - Maneja eventos               │
│  - Usa lógica de math_core      │
└─────────────────────────────────┘
```

---

## 📚 DOCUMENTACIÓN

Todos los detalles están documentados:

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
