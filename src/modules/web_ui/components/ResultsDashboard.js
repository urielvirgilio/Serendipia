/**
 * modules/web_ui/components/ResultsDashboard.js
 * 
 * Componente ResultsDashboard
 * Transforma el JSON de análisis matemático en un reporte visual completo
 * Replica el diseño de la versión Legacy v38.2
 * 
 * [DESIGN-LOCKED] Basado en legacy/analisis_serendipia_v38_2_marketing.html
 * 
 * Responsabilidades:
 * - Renderizar secciones de diagnóstico
 * - Renderizar visualizaciones (Range Slider, Radar Charts)
 * - Inicializar gráficas Chart.js
 * - Mostrar tablas de resultados históricos
 */

import Component from './Component.js';

export default class ResultsDashboard extends Component {
  constructor(containerOrProps, maybeProps) {
    // Support two signatures:
    // new ResultsDashboard(props)
    // new ResultsDashboard(containerId, props)
    let props = {};
    if (typeof containerOrProps === 'string') {
      super({ props: maybeProps || {} });
      this.containerId = containerOrProps;
      props = maybeProps || {};
    } else {
      super({ props: containerOrProps || {} });
      this.containerId = (maybeProps && maybeProps.containerId) || null;
      props = containerOrProps || {};
    }
    this.chartInstances = {};
    this.mounted = false;
  }

  render() {
    const data = this.props.analysisData;
    
    if (!data || !data.valid) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'tip-box tip-danger';
      errorDiv.innerHTML = `<strong>⚠️ Error en Análisis:</strong> ${data?.error || 'Datos inválidos'}`;
      return errorDiv;
    }

    const container = document.createElement('div');
    container.className = 'space-y-8';
    container.id = 'results-dashboard';

    // Sección 1: Diagnóstico (Range Slider + Stats Cards)
    container.appendChild(this._renderDiagnostics(data));

    // Sección 2: Tablas de Historial (Match History)
    container.appendChild(this._renderHistoryTables(data));

    // Sección 3: Radar & Chemistry
    container.appendChild(this._renderRadarSection(data));

    // Sección 4: Contenedor para Gráficas (Chart.js Canvas)
    container.appendChild(this._renderChartsContainer(data));

    this.element = container;
    return container;
  }

  /**
   * Renderiza sección de diagnóstico con Range Slider y Stats Cards
   * Implementa lógica de alertas del Legacy (consecutivos, terminaciones, etc.)
   */
  _renderDiagnostics(data) {
    const section = document.createElement('div');
    section.className = 'diagnostic-section';

    // Título
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = '1. Diagnóstico de tu Jugada';
    section.appendChild(title);

    // ===== CALCULAR ALERTAS DINÁMICAMENTE (LÓGICA DEL LEGACY) =====
    const alerts = this._generateDynamicAlerts(data);

    // Mostrar Tip Boxes para cada alerta
    alerts.forEach(alert => {
      const tipBox = document.createElement('div');
      tipBox.className = `tip-box ${alert.cssClass}`;
      tipBox.innerHTML = alert.message;
      section.appendChild(tipBox);
    });

    // Range Slider para Suma de Números
    const rangeSection = this._renderRangeSlider(data);
    section.appendChild(rangeSection);

    // Stats Grid (Paridad, Suma, Primos)
    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';
    statsGrid.style.marginTop = '30px';

    // Tarjeta: Paridad (Pares / Impares)
    const parityStatus = this._evaluateParityStatus(data.evenCount, data.totalNumbers);
    const parityCard = this._createStatCard(
      'Paridad',
      `${data.evenCount || 0} Pares / ${(data.totalNumbers || 6) - (data.evenCount || 0)} Impares`,
      'Análisis de números pares vs impares',
      parityStatus
    );
    statsGrid.appendChild(parityCard);

    // Tarjeta: Suma Total
    const sumStatus = this._evaluateSumStatus(data.sum, data.zoneMin, data.zoneMax);
    const sumCard = this._createStatCard(
      'Suma Total',
      `${data.sum || 0}`,
      `Zona óptima: ${data.zoneMin}-${data.zoneMax}`,
      sumStatus
    );
    statsGrid.appendChild(sumCard);

    // Tarjeta: Números Primos
    const primeStatus = this._evaluatePrimeStatus(data.primeCount, data.totalNumbers);
    const primeCard = this._createStatCard(
      'Números Primos',
      `${data.primeCount || 0} de ${data.totalNumbers || 6}`,
      'Frecuencia de números primos',
      primeStatus
    );
    statsGrid.appendChild(primeCard);

    section.appendChild(statsGrid);

    return section;
  }

  /**
   * Genera alertas dinámicas basadas en análisis del Legacy
   * Implementa la lógica de líneas ~650-720 del Legacy
   * 
   * Alertas:
   * - Terminaciones: Si 3+ números comparten última terminación
   * - Consecutivos: Si hay números seguidos (riesgo)
   * - Patrones: Si hay secuencia aritmética obvia
   */
  _generateDynamicAlerts(data) {
    const alerts = [];

    if (!data.numbers || !Array.isArray(data.numbers)) {
      return alerts; // Sin números, sin alertas
    }

    const nums = data.numbers;

    // ===== ALERTA 1: TERMINACIONES =====
    // Legacy línea ~659-664
    const endings = nums.map(n => n % 10);
    const endingCounts = {};
    endings.forEach(x => endingCounts[x] = (endingCounts[x] || 0) + 1);
    const maxEndingRep = Math.max(...Object.values(endingCounts), 0);

    if (maxEndingRep >= 4) {
      alerts.push({
        cssClass: 'tip-danger',
        message: `🛑 <strong>ALERTA DE TERMINACIÓN:</strong> Tienes ${maxEndingRep} números con la misma terminación. Raro.`
      });
    } else if (maxEndingRep === 3) {
      alerts.push({
        cssClass: 'tip-warning',
        message: `⚠️ <strong>Precaución:</strong> Tienes ${maxEndingRep} números con la misma terminación.`
      });
    }

    // ===== ALERTA 2: PATRONES ARITMÉTICOS =====
    // Legacy línea ~708-710
    const diffs = [];
    for (let i = 0; i < nums.length - 1; i++) {
      diffs.push(nums[i + 1] - nums[i]);
    }
    
    const isArithmetic = diffs.length > 0 && diffs.every(d => d === diffs[0]);
    const isLinear = (nums[0] === 5 && nums[1] === 10) || 
                     (nums[0] === 1 && nums[1] === 2 && nums[2] === 3);

    if (isArithmetic || isLinear) {
      alerts.push({
        cssClass: 'tip-danger mere-alert',
        message: `🛑 <strong>ALERTA DE PATRÓN:</strong> Secuencia aritmética/linear obvia. Evita esto.`
      });
    }

    // ===== ALERTA 3: CONSECUTIVOS =====
    // Legacy línea ~703-707
    let consecutiveCountUser = 0;
    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i + 1] === nums[i] + 1) {
        consecutiveCountUser++;
      }
    }

    if (consecutiveCountUser === 0) {
      alerts.push({
        cssClass: 'tip-warning',
        message: `⚠️ <strong>Consecutivos:</strong> No tienes números seguidos. El 40% de ganadores los usan.`
      });
    }

    return alerts;
  }

  /**
   * Renderiza el Range Slider calibrado para el juego
   * COMPLETAMENTE DINÁMICO: Calcula gradiente, marcador y etiquetas basado en data recibida
   * 
   * Implementa la lógica del Legacy (líneas ~680-700 de analisis_serendipia_v38_2_marketing.html):
   * - Gradiente RGB (Rojo → Verde → Rojo) dinámico según zoneMin/zoneMax
   * - Marcador posicionado según sum actual
   * - Etiquetas: Min, ZoneMin, ZoneMax, Max con valores del data
   */
  _renderRangeSlider(data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'range-wrapper';

    // ===== DATOS DINÁMICOS DEL OBJETO DATA =====
    const minSum = data.minSum || 0;
    const maxSum = data.maxSum || 100;
    const zoneMin = data.zoneMin || minSum;
    const zoneMax = data.zoneMax || maxSum;
    const currentSum = data.sum || 0;

    // ===== CÁLCULO DEL GRADIENTE DINÁMICO =====
    // Basado en: Legacy v38.2, línea ~682-684
    // const rangeTotal = cfg.maxSum - cfg.minSum;
    // const pStartGreen = ((cfg.zoneMin - cfg.minSum) / rangeTotal) * 100;
    // const pEndGreen = ((cfg.zoneMax - cfg.minSum) / rangeTotal) * 100;
    
    const rangeTotal = maxSum - minSum;
    const pStartGreen = ((zoneMin - minSum) / rangeTotal) * 100;
    const pEndGreen = ((zoneMax - minSum) / rangeTotal) * 100;

    // Gradiente con transiciones suaves (amarillo en los bordes)
    // Color: Rojo (#ef5350) → Amarillo (#fbc02d) → Verde (#388e3c) → Amarillo → Rojo
    const gradientCSS = `linear-gradient(to right,
      #ef5350 0%,
      #fbc02d ${Math.max(0, pStartGreen - 10)}%,
      #388e3c ${pStartGreen}%,
      #388e3c ${pEndGreen}%,
      #fbc02d ${Math.min(100, pEndGreen + 10)}%,
      #ef5350 100%)`;

    // ===== POSICIÓN DEL MARCADOR (BANDERA NEGRA) =====
    // Basado en: Legacy v38.2, línea ~686
    // let sumPos = ((sum - cfg.minSum) / rangeTotal) * 100;
    
    let sumPos = ((currentSum - minSum) / rangeTotal) * 100;
    if (sumPos > 100) sumPos = 100;
    if (sumPos < 0) sumPos = 0;

    const marker = document.createElement('div');
    marker.className = 'range-marker-container';
    marker.style.left = `${sumPos}%`;
    marker.style.transition = 'left 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    marker.innerHTML = `<div class="range-value-badge">${currentSum}</div>`;
    wrapper.appendChild(marker);

    // ===== BARRA DE RANGO CON GRADIENTE =====
    const rangeContainer = document.createElement('div');
    rangeContainer.className = 'range-container';
    rangeContainer.style.background = gradientCSS;
    rangeContainer.innerHTML = '';
    wrapper.appendChild(rangeContainer);

    // ===== ETIQUETAS DE LÍMITES =====
    // Mostrar: Min, ZoneMin, ZoneMax, Max con valores dinámicos
    const labelsContainer = document.createElement('div');
    labelsContainer.className = 'range-labels-container';
    
    // Posición del ZoneMin (inicio zona verde)
    const zoneStartPos = pStartGreen;
    // Posición del ZoneMax (fin zona verde)
    const zoneEndPos = pEndGreen;

    labelsContainer.innerHTML = `
      <div class="range-label-left">Min: ${minSum}</div>
      <div class="range-label-zone" style="left:${zoneStartPos}%">
        <span class="zone-value">${zoneMin}</span>
      </div>
      <div class="range-label-zone" style="left:${zoneEndPos}%">
        <span class="zone-value">${zoneMax}</span>
      </div>
      <div class="range-label-right">Max: ${maxSum}</div>
    `;
    wrapper.appendChild(labelsContainer);

    // ===== MENSAJE DE ESTADO DINÁMICO =====
    // Basado en: Legacy v38.2, líneas ~688-691
    // if(sum < cfg.zoneMin) sumMsg = "⚠️ Zona Baja...";
    // else if(sum > cfg.zoneMax) sumMsg = "⚠️ Zona Alta...";
    // else sumMsg = `✅ ¡Excelente! Zona de Ganadores...`;
    
    let sumMsg = '';
    let statusClass = '';
    
    if (currentSum < zoneMin) {
      sumMsg = `⚠️ Zona Baja (${currentSum} < ${zoneMin}) - Riesgo Estadístico`;
      statusClass = 'status-bad';
    } else if (currentSum > zoneMax) {
      sumMsg = `⚠️ Zona Alta (${currentSum} > ${zoneMax}) - Riesgo Estadístico`;
      statusClass = 'status-bad';
    } else {
      sumMsg = `✅ ¡Excelente! Zona de Ganadores (${zoneMin}-${zoneMax})`;
      statusClass = 'status-good';
    }

    const msgDiv = document.createElement('div');
    msgDiv.className = `range-status-message ${statusClass}`;
    msgDiv.innerHTML = sumMsg;
    wrapper.appendChild(msgDiv);

    return wrapper;
  }

  /**
   * Calcula el estado de la suma (mensaje, icono, clase CSS)
   * [DEPRECATED] Esta lógica está ahora en _renderRangeSlider()
   * Se mantiene por compatibilidad si otros métodos la usan
   */
  _getSumStatus(data) {
    const sum = data.sum || 0;
    const zoneMin = data.zoneMin || 0;
    const zoneMax = data.zoneMax || 100;

    if (sum >= zoneMin && sum <= zoneMax) {
      return {
        message: `Tu suma (${sum}) está EN EQUILIBRIO - Zona Verde Óptima`,
        icon: '✅',
        className: 'status-good'
      };
    } else if (sum < zoneMin) {
      return {
        message: `Tu suma (${sum}) es BAJA - Fuera de zona verde`,
        icon: '⬇️',
        className: 'status-bad'
      };
    } else {
      return {
        message: `Tu suma (${sum}) es ALTA - Fuera de zona verde`,
        icon: '⬆️',
        className: 'status-bad'
      };
    }
  }

  /**
   * Crea una stat card individual con borde izquierdo, icono y estado visual
   */
  _createStatCard(title, value, subtitle, status = 'neutral') {
    const card = document.createElement('div');
    card.className = 'stat-card';
    
    // Mapear status a clase CSS y icono
    let statusClass = '';
    let statusIcon = '';
    if (status === 'good') {
      statusClass = 'stat-card-good';
      statusIcon = '✅';
    } else if (status === 'warn') {
      statusClass = 'stat-card-warn';
      statusIcon = '⚠️';
    } else if (status === 'bad') {
      statusClass = 'stat-card-bad';
      statusIcon = '❌';
    } else {
      statusClass = 'stat-card-neutral';
      statusIcon = 'ℹ️';
    }

    card.classList.add(statusClass);

    card.innerHTML = `
      <div class="stat-card-header">
        <span class="stat-title">${title}</span>
        <span class="stat-icon">${statusIcon}</span>
      </div>
      <div class="stat-value">${value}</div>
      <div class="stat-subtitle">${subtitle}</div>
    `;

    return card;
  }

  /**
   * Renderiza tablas de historial de coincidencias
   */
  _renderHistoryTables(data) {
    const section = document.createElement('div');
    section.className = 'history-section';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.style.marginTop = '30px';
    title.textContent = '2. Historial de Premios Exactos';
    section.appendChild(title);

    // Si no hay datos de coincidencias, mostrar placeholder
    const mh = data.matchHistory;
    const hasMatches = (() => {
      if (!mh) return false;
      if (Array.isArray(mh)) return mh.length > 0;
      // object with grouped arrays
      return Object.values(mh).some(v => Array.isArray(v) && v.length > 0);
    })();

    if (!hasMatches) {
      const placeholder = document.createElement('div');
      placeholder.className = 'tip-box tip-info';
      placeholder.innerHTML = '<strong>ℹ️ Información:</strong> No hay datos de coincidencias históricas cargadas. Importa un CSV con tu historial.';
      section.appendChild(placeholder);
      return section;
    }

    // Renderizar grupos de coincidencias (quintetas, cuartetas, tercias)
    const groups = this._groupMatches(data.matchHistory);
    const matchTitles = ['Quintetas', 'Cuartetas', 'Tercias'];

    for (const [level, groupData] of Object.entries(groups)) {
      if (groupData.length === 0) continue;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'match-group';

      const groupTitle = document.createElement('div');
      groupTitle.className = 'match-group-title';
      groupTitle.textContent = matchTitles[5 - parseInt(level)] || `Matches (${level})`;
      groupDiv.appendChild(groupTitle);

      const listDiv = document.createElement('div');
      listDiv.className = 'match-list-scroll';

      groupData.forEach((match) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'match-item';
        itemDiv.innerHTML = `
          <div class="match-header">
            <span class="match-nums">(${match.nums.join(', ')})</span>
            <span style="background:var(--seren-gold); padding:2px 8px; border-radius:10px; font-weight:bold;">${match.count} veces</span>
          </div>
          <div style="font-size:0.85em; color:#666; margin-bottom:5px; font-style:italic;">
            Sale 1 vez cada <strong>${match.avgGap}</strong> sorteos aprox.
          </div>
          <div class="match-dates-box">
            ${match.dates.map(d => `<span class="date-tag">${d}</span>`).join('')}
          </div>
        `;
        listDiv.appendChild(itemDiv);
      });

      groupDiv.appendChild(listDiv);
      section.appendChild(groupDiv);
    }

    return section;
  }

  /**
   * Agrupa las coincidencias por nivel (3, 4, 5)
   */
  _groupMatches(matchHistory) {
    const groups = { 5: [], 4: [], 3: [] };

    if (!matchHistory) return groups;

    // Helper to aggregate an array of records into normalized matches
    const aggregateArray = (arr, totalHistorical = 0) => {
      const map = new Map();
      arr.forEach(rec => {
        const nums = rec.nums || rec.drawNumbers || rec.matched || [];
        const sorted = Array.isArray(nums) ? nums.slice().sort((a,b)=>a-b) : [];
        const key = sorted.join(',');
        const entry = map.get(key) || { nums: sorted, count: 0, indexes: [], dates: [] };
        entry.count += 1;
        if (typeof rec.drawIndex === 'number') entry.indexes.push(rec.drawIndex);
        if (rec.date) entry.dates.push(rec.date);
        map.set(key, entry);
      });

      const out = [];
      for (const e of map.values()) {
        let avgGap = totalHistorical && e.count ? Math.round(totalHistorical / e.count) : 0;
        if (e.indexes.length > 1) {
          // compute average gap between occurrences
          e.indexes.sort((a,b)=>a-b);
          const diffs = [];
          for (let i = 1; i < e.indexes.length; i++) diffs.push(e.indexes[i] - e.indexes[i-1]);
          if (diffs.length) avgGap = Math.round(diffs.reduce((a,b)=>a+b,0) / diffs.length);
        }
        out.push({ nums: e.nums, count: e.count, avgGap, dates: e.dates });
      }
      // sort by count desc
      out.sort((a,b)=>b.count - a.count);
      return out;
    };

    // If matchHistory is an object with grouped arrays (tercia/cuarteta/quinteta/...)
    if (!Array.isArray(matchHistory) && typeof matchHistory === 'object') {
      const totalHistorical = (this.props.analysisData && this.props.analysisData.meta && this.props.analysisData.meta.historicalCount) || 0;
      const mapping = { tercia: 3, cuarteta: 4, quinteta: 5, sexteta: 6 };
      for (const key of Object.keys(matchHistory)) {
        const arr = matchHistory[key];
        if (!Array.isArray(arr) || arr.length === 0) continue;
        const level = mapping[key] || (parseInt(key, 10) || null);
        if (!level) continue;
        const aggregated = aggregateArray(arr, totalHistorical);
        if (groups[level]) groups[level] = groups[level].concat(aggregated);
      }
      return groups;
    }

    // Otherwise assume array of matches with .nums or .matched and possibly .matches count
    if (Array.isArray(matchHistory)) {
      const totalHistorical = (this.props.analysisData && this.props.analysisData.meta && this.props.analysisData.meta.historicalCount) || 0;
      // Normalize into records grouped by length
      const byLevel = { 3: [], 4: [], 5: [] };
      matchHistory.forEach(rec => {
        const nums = rec.nums || rec.drawNumbers || rec.matched || [];
        const level = (rec.matches || nums.length || 0);
        if (level >=3 && level <=5) {
          byLevel[level].push({ nums, drawIndex: rec.drawIndex, date: rec.date });
        }
      });
      // Aggregate each level
      for (const lvl of [5,4,3]) {
        groups[lvl] = aggregateArray(byLevel[lvl] || [], totalHistorical);
      }
      return groups;
    }

    return groups;
  }

  /**
   * Renderiza sección de Radar y Química
   */
  _renderRadarSection(data) {
    const section = document.createElement('div');
    section.className = 'radar-section';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.style.marginTop = '30px';
    title.textContent = '3. Análisis de Frecuencia y Química';
    section.appendChild(title);

    // Grid de radar boxes
    const radarGrid = document.createElement('div');
    radarGrid.className = 'radar-grid';

    // Hot Numbers (Calientes)
    if (data.hotNumbers && data.hotNumbers.length > 0) {
      const hotBox = document.createElement('div');
      hotBox.className = 'radar-box';
      hotBox.innerHTML = `
        <div class="radar-head">🔥 Números Calientes</div>
        <div class="radar-subtitle">Números frecuentes en los últimos 20 sorteos</div>
        <div class="radar-list-vertical">
          ${data.hotNumbers.map(n => `<div class="radar-list-item hot"><strong>${n.number}</strong><span>${n.frequency}% de sorteos</span></div>`).join('')}
        </div>
      `;
      radarGrid.appendChild(hotBox);
    }

    // Cold Numbers (Rezagados)
    if (data.coldNumbers && data.coldNumbers.length > 0) {
      const coldBox = document.createElement('div');
      coldBox.className = 'radar-box';
      coldBox.innerHTML = `
        <div class="radar-head">🧊 Números Rezagados</div>
        <div class="radar-subtitle">Números que no aparecen hace muchos sorteos</div>
        <div class="radar-list-vertical">
          ${data.coldNumbers.map(n => `<div class="radar-list-item cold"><strong>${n.number}</strong><span>Hace ${n.drawsAgo} sorteos</span></div>`).join('')}
        </div>
      `;
      radarGrid.appendChild(coldBox);
    }

    section.appendChild(radarGrid);

    return section;
  }

  /**
   * Renderiza contenedor para gráficas Chart.js
   */
  _renderChartsContainer(data) {
    const section = document.createElement('div');
    section.className = 'charts-section';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.style.marginTop = '30px';
    title.textContent = '4. Análisis Estadístico';
    section.appendChild(title);

    // Contenedor para las gráficas
    const chartsWrapper = document.createElement('div');
    chartsWrapper.style.display = 'grid';
    chartsWrapper.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    chartsWrapper.style.gap = '20px';

    // Gráfica 1: Distribución (Pie Chart)
    const chartContainer1 = document.createElement('div');
    chartContainer1.className = 'chart-container';
    chartContainer1.innerHTML = `
      <div class="chart-title">Distribución de Premios</div>
      <canvas id="distributionChart_${data.gameId}"></canvas>
    `;
    chartsWrapper.appendChild(chartContainer1);

    // Gráfica 2: Bernoulli (Line Chart)
    const chartContainer2 = document.createElement('div');
    chartContainer2.className = 'chart-container';
    chartContainer2.innerHTML = `
      <div class="chart-title">Convergencia Histórica</div>
      <canvas id="bernoulliChart_${data.gameId}"></canvas>
    `;
    chartsWrapper.appendChild(chartContainer2);

    section.appendChild(chartsWrapper);

    return section;
  }

  /**
   * Se ejecuta después de que el componente está en el DOM
   * Inicializa Chart.js y gráficas
   */
  afterMount() {
    const data = this.props.analysisData;
    if (!data) return;

    // Inicializar gráficas si existen canvas. Si Chart.js no está cargado, cargarlo dinámicamente desde CDN.
    const ensureCharts = () => {
      try {
        this._initDistributionChart(data);
        this._initBernoulliChart(data);
      } catch (err) {
        console.error('Error initializing charts:', err);
      }
    };

    if (typeof Chart === 'undefined') {
      // Try window.Chart first
      if (typeof window !== 'undefined' && window.Chart) {
        ensureCharts();
        return;
      }

      // Load Chart.js from CDN
      const existing = document.querySelector('script[data-chartjs-cdn]');
      if (existing) {
        existing.addEventListener('load', ensureCharts);
        existing.addEventListener('error', () => console.warn('Failed to load Chart.js from CDN'));
        return;
      }

      const script = document.createElement('script');
      script.setAttribute('data-chartjs-cdn', '1');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Chart.js loaded dynamically');
        ensureCharts();
      };
      script.onerror = (e) => { console.warn('❌ Failed to load Chart.js:', e); };
      document.head.appendChild(script);
      return;
    }

    ensureCharts();
  }

  /**
   * Inicializa gráfica de Distribución (Pie Chart)
   */
  _initDistributionChart(data) {
    const canvasId = `distributionChart_${data.gameId}`;
    const canvas = document.getElementById(canvasId);
    
    if (!canvas || typeof Chart === 'undefined') {
      console.warn(`⚠️ Chart.js no disponible o canvas ${canvasId} no encontrado`);
      return;
    }

    // Try to obtain distribution data from several possible fields
    const dist = data.prizeDistribution || data.frequency || data.analysis?.prizeDistribution || { low: 0, ideal: 0, high: 0 };
    const low = dist.low ?? 0;
    const ideal = dist.ideal ?? 0;
    const high = dist.high ?? 0;

    const chartData = {
      labels: ['Zona Baja', 'En Equilibrio', 'Zona Alta'],
      datasets: [{
        data: [low, ideal, high],
        backgroundColor: ['#ef5350', '#388e3c', '#fbc02d'],
        borderColor: ['#c62828', '#1b5e20', '#f57f17'],
        borderWidth: 2
      }]
    };

    if (this.chartInstances.distribution) {
      this.chartInstances.distribution.destroy();
    }

    this.chartInstances.distribution = new Chart(canvas, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  /**
   * Inicializa gráfica de Bernoulli (Line Chart)
   */
  _initBernoulliChart(data) {
    const canvasId = `bernoulliChart_${data.gameId}`;
    const canvas = document.getElementById(canvasId);
    
    if (!canvas || typeof Chart === 'undefined') {
      console.warn(`⚠️ Chart.js no disponible o canvas ${canvasId} no encontrado`);
      return;
    }

    // Use provided bernoulli series if available
    const series = data.bernoulli || data.bernoulliData || data.analysis?.bernoulli || [];
    const labels = series.map((s, idx) => s.label || s.date || `Sorteo ${idx + 1}`);
    const observed = series.map(s => (typeof s.y !== 'undefined' ? s.y : s.value ?? s.y ?? null)).map(v => v ?? 0);

    // Determine ideal line (zone) from config if present
    const idealVal = data.zoneMin && data.zoneMax ? Math.round((data.zoneMin + data.zoneMax) / 2) : (data.analysis?.idealSum || data.idealSum || null);
    const idealLine = idealVal ? labels.map(() => idealVal) : [];

    const chartData = {
      labels,
      datasets: [{
        label: 'Suma Observada',
        data: observed,
        borderColor: '#0B2B26',
        backgroundColor: 'rgba(11, 43, 38, 0.08)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    };

    if (idealLine.length > 0) {
      chartData.datasets.push({
        label: 'Zona Ideal',
        data: idealLine,
        borderColor: '#388e3c',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false
      });
    }

    if (this.chartInstances.bernoulli) {
      this.chartInstances.bernoulli.destroy();
    }

    this.chartInstances.bernoulli = new Chart(canvas, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Suma'
            }
          }
        }
      }
    });
  }

  /**
   * Evalúa el estado de la paridad (pares vs impares)
   * Retorna 'good', 'warn' o 'bad'
   */
  _evaluateParityStatus(evenCount, totalNumbers) {
    if (!evenCount || !totalNumbers) return 'neutral';
    
    const evenPct = evenCount / totalNumbers;
    // Ideal balance: 50/50, rango aceptable: 33%-67%
    if (evenPct >= 0.33 && evenPct <= 0.67) {
      return 'good'; // Balanced
    } else if (evenPct >= 0.17 && evenPct <= 0.83) {
      return 'warn'; // Slightly off-balance
    } else {
      return 'bad'; // Very imbalanced
    }
  }

  /**
   * Evalúa el estado de la suma
   * Retorna 'good' si está en zona, 'bad' si está fuera
   */
  _evaluateSumStatus(sum, zoneMin, zoneMax) {
    if (sum >= zoneMin && sum <= zoneMax) {
      return 'good';
    } else {
      return 'bad';
    }
  }

  /**
   * Evalúa el estado de números primos
   * Retorna 'good', 'warn' o 'bad'
   */
  _evaluatePrimeStatus(primeCount, totalNumbers) {
    if (!primeCount || !totalNumbers) return 'neutral';
    
    const primePct = primeCount / totalNumbers;
    // Ideal range: 25%-50% de primos
    if (primePct >= 0.25 && primePct <= 0.5) {
      return 'good';
    } else if (primePct >= 0.17 && primePct <= 0.67) {
      return 'warn';
    } else {
      return 'bad';
    }
  }

  /**
   * Limpia instancias de Chart.js
   */
  destroy() {
    Object.values(this.chartInstances).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.chartInstances = {};
  }
}
