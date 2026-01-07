# SERENDIPIA - SISTEMA DE DISEÑO (V38.2)

**Versión:** 38.2 (Marketing Edition)  
**Fecha:** 2026-01-06  
**Clasificación:** `[DESIGN-SYSTEM]`

---

## 1. IDENTIDAD VISUAL

### Propósito
Define la identidad visual coherente de Serendipia a través de colores, tipografía e iconografía. El sistema garantiza consistencia visual y reconocimiento de marca.

---

## 2. PALETA DE COLORES

### 2.1 Colores Corporativos (Variables CSS)

```css
:root {
  --seren-green: #0B2B26;      /* Verde profundo de Serendipia */
  --seren-gold: #C5A059;        /* Oro corporativo */
  --seren-bg: #F5F5F5;          /* Fondo principal */
  --text-main: #333;            /* Texto principal */
}
```

#### **Serendipia Green (`#0B2B26`)**
- **Uso:** Títulos principales, bordes destacados, elementos enfáticos
- **RGB:** rgb(11, 43, 38)
- **Psicología:** Confianza, equilibrio, naturalidad
- **Aplicaciones:**
  - Títulos de sección (`.section-title`)
  - Bordes left en tarjetas destacadas
  - Números en las bolas (inputs)
  - Fondos de headers

#### **Serendipia Gold (`#C5A059`)**
- **Uso:** Accents, bordes inferiores, elementos premium
- **RGB:** rgb(197, 160, 89)
- **Psicología:** Lujo, éxito, valor
- **Aplicaciones:**
  - Border-top del container principal (8px)
  - Border-bottom del marketing banner
  - Botones "OMEGA" (brillo especial)
  - Labels de frecuencia
  - Línea "Ideal" en gráficos

#### **Fondo Principal (`#F5F5F5`)**
- **Uso:** Fondo de página
- **RGB:** rgb(245, 245, 245)
- **Aplicaciones:** Body, espacios en blanco

#### **Texto Principal (`#333`)**
- **Uso:** Párrafos, textos normales
- **RGB:** rgb(51, 51, 51)

---

### 2.2 Semáforo de Estado (Status Colors)

#### **Rojo (`#ef5350` / `#c62828` / `#d32f2f`)**
```css
--range-red: #ef5350;       /* Rojo estándar (alerta) */
#ef5350                     /* Hot, crítico */
#c62828                     /* Rojo oscuro (peligro máximo) */
#d32f2f                     /* Rojo intenso (alternativo) */
```
- **Uso:** 
  - Zona ALTA en range slider
  - Estado "HOT" en frecuencia
  - Alertas críticas (`tip-danger`)
  - Fondos en `zone-red`
  - Botones destructivos

#### **Amarillo (`#fbc02d` / `#f57f17` / `#ff8f00`)**
```css
--range-yellow: #fbc02d;    /* Amarillo estándar (precaución) */
#fba526                     /* Amarillo media (Poisson) */
#ff8f00                     /* Oro/Naranja (TRIS) */
```
- **Uso:**
  - Zona MEDIA en range slider
  - Estado "MADURANDO" en Poisson
  - Alertas de precaución (`tip-warning`)
  - Fondos en `zone-yellow`

#### **Verde (`#388e3c` / `#2e7d32` / `#00e676` / `#81c784`)**
```css
--range-green: #388e3c;     /* Verde estándar (OK) */
#2e7d32                     /* Verde oscuro (bien) */
#00e676                     /* Verde brillante (Poisson maduro) */
#81c784                     /* Verde claro (highlight) */
```
- **Uso:**
  - Zona VERDE (Equilibrio) en range slider
  - Estado "LUZ VERDE" en validación
  - Alertas de éxito (`tip-success`)
  - Fondos en `zone-green`

#### **Azul (`#1565c0` / `#2196F3` / `#42a5f5`)**
```css
#1565c0                     /* Azul oscuro (primario, botones) */
#2196F3                     /* Azul estándar (info) */
#42a5f5                     /* Azul claro (Rezagados, cold) */
#0288d1                     /* Azul cian (info alternativo) */
```
- **Uso:**
  - Botón `.btn-financial`
  - Estado "COLD" en frecuencia
  - Info boxes (`tip-info`)
  - Línea de datos en gráficos (Suma Real)

---

### 2.3 Esquema de Colores por Componente

#### **Range Slider / Barra de Rango**

```
Gradiente: Rojo (0%) → Amarillo (pStartGreen%) → Verde (zoneMin% a zoneMax%) → Amarillo → Rojo (100%)

Ejemplo Melate:
┌─────────────────────────────────────────────┐
│ 🔴 Zona Baja │ 🟡 Transición │ 🟢 VERDE │ 🟡 │ 🔴 Zona Alta │
│ (21-119)     │               │ (120-220)│    │ (221-321)    │
└─────────────────────────────────────────────┘
  0%                                          100%
```

#### **Heatmap / Frecuencia en Tiempo Real**

```javascript
// .ball-freq-label (etiqueta de bola)
Por defecto: background: #999 (gris)

Si .visible.hot:
  background: #ef5350    /* Rojo: Caliente */

Si .visible.cold:
  background: #42a5f5    /* Azul: Rezagado */
```

#### **Poisson - Barra de Madurez**

```javascript
maturity = 0%:    transparent (sin barra)
maturity < 20%:   #ef5350      /* Rojo: Falta madurar */
maturity 21-79%:  #ffa726      /* Naranja: Madurando */
maturity >= 80%:  #00e676      /* Verde: ¡MADURO! */
```

---

## 3. TIPOGRAFÍA

### 3.1 Familias de Fuentes

```css
/* Primary Font Stack */
font-family: 'Montserrat', sans-serif;

/* Secondary Font Stack (Inspiración) */
font-family: 'Playfair Display', serif;
```

#### **Montserrat**
- **Fuente:** Google Fonts
- **Pesos disponibles:** 400 (Regular), 500 (Medium), 700 (Bold), 800 (ExtraBold)
- **Uso:** 
  - Body text, botones, labels, inputs
  - Toda la interfaz principal
  - Números en bolas
  - Títulos de secciones

#### **Playfair Display**
- **Fuente:** Google Fonts (serif)
- **Estilo:** Italic
- **Peso:** 500
- **Uso:**
  - Box de inspiración (`.inspiration-box`)
  - Textos decorativos y citas
  - Máximo 1-2 usos por página

---

### 3.2 Escala Tipográfica

| Uso | Familia | Tamaño | Peso | Line-Height | Casos |
|-----|---------|--------|------|-------------|-------|
| **Page Title** | Montserrat | 1.8em | 900 | 1.2 | `.print-title` |
| **Section Title** | Montserrat | 1.4em | 800 | 1.0 | `.section-title` |
| **Mark Title** (Marketing) | Montserrat | 1.4em | 800 | 1.0 | `.mark-title` |
| **Stat Subtitle** | Montserrat | 0.85em | 500 | 1.0 | `.ideal-ref` |
| **Button** | Montserrat | 1em | 700 | 1.0 | `.btn` (text-transform: uppercase) |
| **Input** | Montserrat | 1em | 700 | 1.0 | `.ball`, `.strict-input` |
| **Body** | Montserrat | 1em | 400 | 1.5 | `<p>`, div default |
| **Small Text** | Montserrat | 0.9em | 400 | 1.4 | `<small>` |
| **Tiny Text** | Montserrat | 0.75em-0.8em | 500 | 1.0 | `.radar-subtitle`, labels |

---

### 3.3 Características de Texto

#### **Text Transform**
- `.nav-btn`, `.btn`: `text-transform: uppercase`
- `.mark-title`: `text-transform: uppercase` + `letter-spacing: 1px`

#### **Letter Spacing**
- Títulos: `letter-spacing: 1px` a `2px`
- Normal: 0 (inherit)

#### **Font Styling**
- Inspiración: `font-style: italic`
- Subtítulos: `font-style: italic`

---

## 4. COMPONENTES UI

### 4.1 Las Bolas (The Balls)

Los inputs numéricos son el corazón visual de Serendipia.

#### **Estructura HTML**
```html
<div class="ball-wrapper">
  <input type="number" class="ball strict-input ordered-input" 
         data-max="56" data-len="2" id="m1" onkeyup="checkFreq('melate', this)">
  <div id="freq_m1" class="ball-freq-label">-</div>
</div>
```

#### **Estilos Base (`.ball`)**
```css
.ball {
  width: 65px;
  height: 65px;
  border-radius: 50%;                    /* Círculo perfecto */
  border: 2px solid #ccc;
  text-align: center;
  font-size: 26px;                       /* Números grandes */
  font-weight: 800;                      /* Bold */
  color: var(--seren-green);             /* Verde Serendipia */
  outline: none;
  transition: 0.2s;
  background: white;
  -moz-appearance: textfield;            /* Firefox: sin spinners */
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  z-index: 2;
}
```

#### **Estados de Interacción**

**Estado Normal:**
- Border: 2px solid #ccc
- Background: white
- Box-shadow: subtle (0 4px 6px rgba...)

**Estado Focus (`.ball:focus`)**
```css
.ball:focus {
  border-color: var(--seren-gold);    /* Border dorado */
  transform: scale(1.1);               /* Aumenta 10% */
  background: #fffde7;                 /* Amarillo muy claro */
}
```
- **Efecto:** Usuario sabe dónde está escribiendo
- **Transición:** 0.2s suave

**Estado HOT (Caliente)**
```css
.ball-freq-label.hot {
  background: #ef5350;                /* Rojo */
  color: white;
  animation: none;
}
```

**Estado COLD (Rezagado)**
```css
.ball-freq-label.cold {
  background: #42a5f5;                /* Azul */
  color: white;
  animation: none;
}
```

#### **Label de Frecuencia (`.ball-freq-label`)**

```css
.ball-freq-label {
  font-size: 0.75em;
  color: #fff;
  background: #999;                   /* Gris por defecto */
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: -10px;                  /* Flotante sobre la bola */
  z-index: 1;
  padding-top: 12px;
  font-weight: bold;
  min-width: 50px;
  text-align: center;
  transition: 0.3s;
  opacity: 0;                         /* Invisible hasta .visible */
}

.ball-freq-label.visible {
  opacity: 1;
  margin-top: -15px;
  padding-top: 18px;
}
```

**Comportamiento:**
- Muestra: `[n] veces` (contador de apariciones en historial)
- Aparece cuando usuario escribe (`.visible`)
- Color cambia a rojo/azul según frecuencia

---

### 4.2 Botones

#### **Botón Base (`.btn`)**
```css
.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 50px;                /* Muy redondeado */
  cursor: pointer;
  font-weight: 700;
  text-transform: uppercase;
  transition: 0.2s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn:hover {
  transform: translateY(-2px);        /* Levanta al hover */
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}
```

#### **Variantes de Botón**

| Clase | Color | Uso |
|-------|-------|-----|
| `.btn-analyze` | Verde Serendipia (`#0B2B26`) | Análisis principal |
| `.btn-financial` | Azul (`#1565c0`) | Proyección financiera TRIS |
| `.btn-smart` | Gris-blanco (gradiente) | Generador aleatorio |
| `.btn-omega` | Gradiente Dorado + Animación Glow | 👑 OMEGA Premium |
| `.btn-clear` | Gris (`#cfd8dc`) | Limpiar campos |
| `.btn-print` | Gris oscuro (`#546e7a`) | Imprimir |
| `.btn-voice` | Rojo (`#ef5350`) circular | Micrófono (voz) |

#### **Botón OMEGA Especial**

```css
.btn-omega {
  background: linear-gradient(135deg, #FFD700, #FDB931);
  color: #000;
  border: 2px solid #fff;
  animation: glow 2s infinite alternate;
  font-size: 1.1em;
}

@keyframes glow {
  from { box-shadow: 0 0 10px #FFD700; }
  to { box-shadow: 0 0 20px #FFD700, 0 0 10px white; }
}
```
- **Efecto:** Brillo dorado pulsante
- **Mensaje:** Premium, especial, atención
- **Animación:** 2s loop infinito

#### **Botón de Voz**

```css
.btn-voice {
  background: #ef5350;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;                 /* Círculo */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-left: 10px;
  cursor: pointer;
  transition: 0.3s;
  position: relative;
}

.btn-voice.listening {
  animation: pulse-red 1s infinite;
  background: #c62828;                /* Rojo oscuro */
}

@keyframes pulse-red {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```
- **Estado listening:** Pulsa rojo + animación scale

---

### 4.3 Range Slider / Barra de Rango

#### **Componentes**

```html
<div class="range-wrapper">
  <div class="range-marker-container" style="left: {posición}%">
    <div class="range-value-badge">{suma}</div>
  </div>
  <div class="range-container" style="background: linear-gradient(...)">
    <div class="range-segment"></div>
  </div>
  <div class="range-labels-container">
    <span class="range-label-min">Min: 21</span>
    <span class="range-label-abs" style="left: 30%">120</span>
    ...
  </div>
</div>
```

#### **Estilos**

```css
.range-container {
  height: 35px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  border: 1px solid #ccc;
  background: #ddd;                   /* Fallback */
}

.range-marker-container {
  position: absolute;
  top: -15px;
  height: 60px;
  width: 4px;
  background: black;
  border-radius: 2px;
  transition: left 1s ease-out;       /* Animación suave */
  z-index: 20;
}

.range-value-badge {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #000;
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 16px;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
```

**Gradiente Dinámico:**
```javascript
background: linear-gradient(to right, 
  var(--range-red) 0%, 
  var(--range-yellow) ${pStartGreen * 0.8}%, 
  var(--range-green) ${pStartGreen}%, 
  var(--range-green) ${pEndGreen}%, 
  var(--range-yellow) ${pEndGreen + (100-pEndGreen)*0.2}%, 
  var(--range-red) 100%)
```

---

### 4.4 Tarjetas de Estadísticas (Stat Card)

#### **Estructura**
```html
<div class="stat-card good">
  <span class="stat-title">Paridad</span>
  <div>3 Pares / 3 Impares</div>
  <div class="stat-subtitle">¡Excelente! % Ideal (Tendencia Real: 35%)</div>
  <span class="ideal-ref">Teórico Histórico: 3 Pares / 3 Impares (33%)</span>
</div>
```

#### **Estilos Base**
```css
.stat-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border-left: 6px solid #ccc;
  transition: 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.stat-subtitle {
  font-size: 0.9em;
  color: #555;
  margin-top: 8px;
  font-style: italic;
  border-top: 1px dashed rgba(0,0,0,0.1);
  padding-top: 6px;
}

.ideal-ref {
  font-size: 0.85em;
  color: #0277bd;
  font-weight: bold;
  display: block;
  margin-top: 4px;
}
```

#### **Variantes por Estado**

| Clase | Border | Background | Texto | Uso |
|-------|--------|-----------|-------|-----|
| `.good` | Verde (`#388e3c`) | `#e8f5e9` | Verde | Datos ideales |
| `.warn` | Amarillo (`#fbc02d`) | `#fffde7` | Naranja | Precaución |
| `.bad` | Rojo (`#ef5350`) | `#ffebee` | Rojo | Error/Riesgo |

---

### 4.5 Tip Boxes (Cajas de Consejo/Alerta)

#### **Estructura**
```html
<div class="tip-box tip-success">
  ✅ <strong>Terminaciones:</strong> Buena distribución.
</div>
```

#### **Estilos Base**
```css
.tip-box {
  background: #e3f2fd;
  padding: 15px;
  border-left: 5px solid #2196F3;
  border-radius: 4px;
  margin-top: 15px;
  margin-bottom: 15px;
}
```

#### **Variantes por Tipo**

| Clase | Color Fondo | Border | Símbolo | Uso |
|-------|------------|--------|---------|-----|
| `.tip-info` | `#e3f2fd` | `#0288d1` azul | ℹ️ | Información |
| `.tip-success` | `#e8f5e9` | `#2e7d32` verde | ✅ | Éxito/OK |
| `.tip-warning` | `#fff3e0` | `#fbc02d` amarillo | ⚠️ | Precaución |
| `.tip-danger` | `#ffebee` | `#c62828` rojo | 🔴 | Peligro crítico |

**Ejemplo Success:**
```css
.tip-box.tip-success {
  background: #e8f5e9;
  border-left-color: var(--range-green);
  color: #2e7d32;
}
```

---

### 4.6 Zona Verde / Audit Cards

#### **Estructura**
```html
<div class="zone-audit-grid">
  <div class="zone-audit-card zone-yellow">
    <span class="audit-val">25%</span>
    <small>Abajo</small>
  </div>
  <div class="zone-audit-card zone-green">
    <span class="audit-val">65%</span>
    <small>ZONA IDEAL</small>
  </div>
  <div class="zone-audit-card zone-red">
    <span class="audit-val">10%</span>
    <small>Arriba</small>
  </div>
</div>
```

#### **Estilos**
```css
.zone-audit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 15px;
  text-align: center;
  font-size: 0.9em;
}

.zone-audit-card {
  background: white;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 6px;
}

.zone-green {
  color: var(--range-green);
  border-color: var(--range-green);
  background: #e8f5e9;
}

.zone-yellow {
  color: #f57f17;
  border-color: var(--range-yellow);
  background: #fffde7;
}

.zone-red {
  color: #c62828;
  border-color: var(--range-red);
  background: #ffebee;
}

.audit-val {
  font-weight: 800;
  font-size: 1.2em;
  display: block;
}
```

---

### 4.7 Radar Boxes (Análisis Lateral)

#### **Estructura**
```html
<div class="radar-grid">
  <div class="radar-box">
    <div class="radar-head">🔥 Calientes</div>
    <small class="radar-subtitle">Números con mayor frecuencia reciente.</small>
    <div class="radar-list-vertical">
      <div class="radar-list-item hot">
        <strong>23</strong>
        (67% de sorteos)
      </div>
    </div>
  </div>
</div>
```

#### **Estilos**
```css
.radar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}

.radar-box {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
}

.radar-head {
  font-weight: bold;
  margin-bottom: 0px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 5px;
}

.radar-list-item {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  border-left: 3px solid #ccc;
  display: flex;
  justify-content: space-between;
}

.radar-list-item.hot {
  border-left-color: var(--range-red);
  background: #ffebee;
}

.radar-list-item.cold {
  border-left-color: #2196F3;
  background: #e3f2fd;
}
```

---

### 4.8 Gráficas (Chart.js)

#### **Contenedor**
```css
.chart-container {
  position: relative;
  margin-top: 40px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background: white;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
}

.chart-title {
  text-align: center;
  font-weight: 800;
  color: var(--seren-green);
  margin-bottom: 15px;
  font-size: 1.1em;
}
```

#### **Colores de Datasets (Pie Chart - Desempeño Histórico)**

```javascript
bgColors = [
  '#e0e0e0',  // 0-1 Aciertos (Gris)
  '#b0bec5',  // 2 Aciertos (Gris claro)
  '#ffe0b2',  // 3 Aciertos (Naranja claro)
  '#ffcc80',  // 4 Aciertos (Naranja)
  '#ef5350',  // 5 Aciertos (Rojo)
  '#c62828'   // 6 Aciertos (Rojo oscuro)
]
```

**Lógica:** Gradación de gris → colores cálidos → rojo (ganancia ↑)

#### **Línea de Bernoulli (Convergencia)**

```javascript
datasets: [
  {
    label: 'Limite Sup',
    data: bernoulliMax,
    borderColor: '#388e3c',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderWidth: 1,
    borderDash: [5, 5],                // Línea punteada
    pointRadius: 0,
    fill: '+2'
  },
  {
    label: 'Ideal',
    data: bernoulliIdeal,
    borderColor: '#C5A059',             // Dorado
    borderWidth: 2,
    pointRadius: 0,
    borderDash: [2, 2]                  // Línea puntillada fina
  },
  {
    label: 'Suma Real',
    data: bernoulliData,
    borderColor: '#1565c0',             // Azul
    borderWidth: 1,
    pointRadius: 1,
    pointHoverRadius: 6,
    fill: false
  },
  {
    label: '¡Premio Mayor!',
    data: winnerPoints,
    backgroundColor: 'red',
    borderColor: 'gold',
    borderWidth: 2,
    pointRadius: 8,                     // Punto grande rojo
    pointHoverRadius: 10,
    type: 'scatter'
  }
]
```

---

## 5. ESPACIADO E LAYOUT

### 5.1 Sistema de Espaciado

| Tamaño | Valor | Uso |
|--------|-------|-----|
| **xs** | 5px | Espacios mínimos entre elementos |
| **sm** | 10px | Padding pequeño |
| **md** | 15px | Padding estándar |
| **lg** | 20px | Padding importante |
| **xl** | 25px | Padding header |
| **2xl** | 30px | Padding sección |
| **3xl** | 40px | Padding brand header |

### 5.2 Grid System

```css
.input-row {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 25px 0;
  flex-wrap: wrap;
  align-items: flex-start;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.radar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}
```

---

## 6. ANIMACIONES

### 6.1 Transiciones

```css
/* Duración estándar */
transition: 0.2s;       /* Rápido: hover, focus */
transition: 0.3s;       /* Medio: visibility, color */
transition: 1s;         /* Lento: gráficos */
```

### 6.2 Keyframes

#### **Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.game-section.active {
  animation: fadeIn 0.5s;
}
```

#### **Glow (OMEGA Button)**
```css
@keyframes glow {
  from { box-shadow: 0 0 10px #FFD700; }
  to { box-shadow: 0 0 20px #FFD700, 0 0 10px white; }
}
```

#### **Pulse (Voz)**
```css
@keyframes pulse-red {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

#### **Pulse General (Mere Alert)**
```css
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 83, 80, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(239, 83, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 83, 80, 0); }
}
```

---

## 7. COMPONENTES ESPECIALES

### 7.1 Marketing Banner

```css
.marketing-banner {
  background: linear-gradient(135deg, #0B2B26 0%, #1a4d44 100%);
  color: white;
  padding: 20px;
  text-align: center;
  border-bottom: 4px solid var(--seren-gold);
  margin-bottom: 0;
}

.mark-title {
  font-size: 1.4em;
  font-weight: 800;
  color: var(--seren-gold);
  text-transform: uppercase;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.mark-highlight {
  color: #81c784;
  font-weight: 800;
}
```

### 7.2 Duplas / Pares (Cards)

```css
.dupla-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.dupla-card {
  background: white;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 6px;
  text-align: center;
}

.dupla-card.gold {
  background: #fff8e1;
  border-color: var(--seren-gold);
  border-width: 2px;
}

.dupla-pair {
  font-weight: 800;
  font-size: 1.1em;
  color: var(--seren-green);
  display: block;
}

.dupla-freq {
  font-size: 0.8em;
  color: #666;
}
```

### 7.3 Pascal Simulation Box

```css
.pascal-sim-box {
  background: #f3e5f5;
  border: 2px solid #ab47bc;
  border-radius: 8px;
  padding: 25px;
  margin-top: 30px;
  text-align: center;
}

.pascal-title {
  color: #6a1b9a;
  font-weight: 800;
  font-size: 1.3em;
  margin-bottom: 10px;
}

.pascal-results {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.pascal-card {
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 100px;
}

.pascal-card span {
  display: block;
  font-weight: bold;
  font-size: 1.4em;
  color: #4a148c;
}
```

### 7.4 TRIS Control Panel

```css
.tris-control-panel {
  display: flex;
  gap: 15px;
  background: #fffde7;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.tris-ctrl-grp {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 120px;
}

.tris-ctrl-grp label {
  font-size: 0.85em;
  font-weight: bold;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tris-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: white;
  padding: 10px;
  border-radius: 6px;
  border: 2px solid #a5d6a7;
}

.tris-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: var(--seren-green);
  cursor: pointer;
}
```

### 7.5 Convergencia Dashboard

```css
.conv-wrapper {
  margin-bottom: 25px;
}

.conv-section-title {
  font-size: 0.9em;
  font-weight: 700;
  color: #555;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-left: 4px solid #ccc;
  padding-left: 8px;
}

.conv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.conv-card {
  padding: 10px;
  text-align: center;
  border-radius: 6px;
  font-size: 0.85em;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.grid-machine .conv-card {
  background: #f5f5f5;
  color: #455a64;
  border-color: #cfd8dc;
}

.grid-machine .conv-center {
  background: #e3f2fd;
  color: #1565c0;
  border-color: #90caf9;
}

.grid-winners .conv-card.w-ideal {
  background: #fff8e1;
  color: #ff8f00;
  border-color: var(--seren-gold);
  border-width: 2px;
}

.conv-val {
  font-size: 1.3em;
  font-weight: 900;
  display: block;
}

.conv-sub {
  font-size: 0.75em;
  color: #666;
  margin-top: 3px;
  font-weight: 500;
}
```

---

## 8. RESPONSIVE DESIGN

### 8.1 Media Query Principal

```css
@media print {
  body { background: white; padding: 0; }
  .container { box-shadow: none; border: none; max-width: 100%; }
  .no-print { display: none !important; }
  .print-only-header { display: block !important; }
  canvas { max-width: 100% !important; height: auto !important; }
}
```

### 8.2 Flex Wrap Responsive

Todos los grids usan `flex-wrap: wrap` y `minmax()` en CSS Grid para adaptar automáticamente a móviles.

---

## 9. ACCESIBILIDAD

### 9.1 Colores y Contraste

- Texto principal: `#333` sobre `#F5F5F5` ✅ (Alto contraste)
- Botones: Colores sólidos con texto blanco/negro
- Semáforo: Usa colores + símbolos (🔴🟡🟢) para no depender solo del color

### 9.2 Focus States

Todos los inputs tienen `:focus` con cambio visual:
```css
.ball:focus {
  border-color: var(--seren-gold);
  transform: scale(1.1);
  background: #fffde7;
}
```

### 9.3 Font Sizes

Mínimo: 0.75em (12px en contexto)  
Máximo: 1.8em (body = 16px base)

---

## 10. PATRONES DE DISEÑO

### 10.1 Card-Based Layout

Toda información se presenta en tarjetas con:
- Border left de 4-6px
- Padding: 15-20px
- Border-radius: 6-8px
- Box-shadow sutil
- Hover: Levanta ligeramente

### 10.2 Semáforo Visual

**Tres niveles de información:**
1. 🟢 Verde = OK / Ideal / Maduro
2. 🟡 Amarillo = Precaución / Madurando
3. 🔴 Rojo = Peligro / Crítico / Falta

### 10.3 Numeración Destacada

Números grandes (26px, 800 weight) en inputs para fácil lectura.

### 10.4 Iconografía

- 🎱 Bolas
- 🔥 Caliente
- 🧊 Frío/Rezagado
- ✅ Éxito
- ⚠️ Precaución
- 🔴 Crítico
- 👑 Premium

---

## 11. GUÍA DE IMPLEMENTACIÓN

### 11.1 Checklist para Nuevos Componentes

- [ ] Usa colores de `--seren-green`, `--seren-gold` como primarios
- [ ] Implementa estados (normal, hover, focus, active)
- [ ] Añade transiciones (0.2s a 0.3s)
- [ ] Respeta el padding system
- [ ] Incluye border-left o border-top según jerarquía
- [ ] Usa Grid/Flex con `gap` en lugar de margins
- [ ] Implement focus states para accesibilidad
- [ ] Prueba en móvil (320px min)

### 11.2 Cambio de Colores Corporativos

Si se necesita actualizar la identidad:
```css
:root {
  --seren-green: [NUEVO_COLOR];
  --seren-gold: [NUEVO_COLOR];
}
```

Solo cambiar estas 2 variables afecta al 80% del sistema.

---

## 12. RECURSOS EXTERNOS

### 12.1 Librerías de Gráficos

- **Chart.js 4+** - Gráficos interactivos
- **chartjs-plugin-datalabels** - Labels en gráficos
- **chartjs-plugin-zoom** - Zoom interactivo en Bernoulli

### 12.2 Fuentes

- **Montserrat** - Google Fonts (400, 500, 700, 800)
- **Playfair Display** - Google Fonts (serif, italic)

### 12.3 Iconografía

- Emoji Unicode (🎱🔥🧊✅⚠️🔴👑)
- Font Awesome opcional para versiones futuras

---

## 13. CHANGELOG DE DISEÑO

| Versión | Cambios |
|---------|---------|
| **v35.0** | Colores base, tipografía, componentes esenciales |
| **v36.0** | Radar boxes, Poisson colors, análisis visual |
| **v37.0** | Gráficos Bernoulli, convergencia dashboard |
| **v38.0** | Duplas cards, TRIS panel control, Gato grid |
| **v38.2** | Marketing banner, real-time frequency labels, refinamientos UI |

---

**Fin del Documento - DESIGN.md**
