/**
 * modules/web_ui/components/ResultsDashboard.js
 * 
 * Componente ResultsDashboard
 * Transforma el JSON de análisis matemático en un reporte visual completo
 * Replica el diseño de la versión Legacy v38.2
 */

import Component from './Component.js';

export default class ResultsDashboard extends Component {
  constructor(containerOrProps, maybeProps) {
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
   * Renderiza la sección de diagnóstico COMPLETA, replicando el diseño Legacy.
   * Orquesta la llamada a sub-renderizadores para cada componente visual.
   */
  _renderDiagnostics(data) {
    const diagnostics = data.diagnostics || {};

    const section = document.createElement('div');
    section.className = 'diagnostic-section';

    const title = document.createElement('h2');
    title.className = 'text-2xl font-extrabold text-seren-green mb-6 border-b-4 border-seren-gold pb-2';
    title.textContent = '1. Diagnóstico de tu Jugada';
    section.appendChild(title);
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'space-y-6';

    contentWrapper.innerHTML = `
      ${this._renderTopAlerts(diagnostics)}
      ${this._renderRangeSlider(diagnostics)}
      ${this._renderAuditGrid(diagnostics)}
      ${this._renderStatsCards(diagnostics)}
      ${this._renderBottomAlerts(diagnostics)}
    `;
    
    section.appendChild(contentWrapper);
    return section;
  }

  /**
   * Genera las alertas superiores (Repetición, Consecutivos, Terminaciones).
   */
  _renderTopAlerts(diagnostics) {
    const alerts = [];

    const rep = diagnostics.repetition || {};
    if (rep.hasRepetition) {
      alerts.push(`<div class="tip-box tip-success">✅ <strong>Repetición:</strong> Incluyes números del sorteo anterior (${(rep.numbers || []).join(', ')}).</div>`);
    } else {
      alerts.push(`<div class="tip-box tip-warning">📉 <strong>Repetición:</strong> No reciclas números del sorteo anterior.</div>`);
    }

    const cons = diagnostics.consecutive || {};
    if (cons.hasConsecutive) {
      alerts.push(`<div class="tip-box tip-success">✅ <strong>Consecutivos:</strong> ¡Bien! El <strong>${cons.historicalPct || 40}%</strong> de ganadores los usan.</div>`);
    } else {
      alerts.push(`<div class="tip-box tip-warning">⚠️ <strong>Consecutivos:</strong> No tienes. El <strong>${cons.historicalPct || 40}%</strong> de ganadores los usan.</div>`);
    }
    
    const term = diagnostics.terminations || {};
    let termMsg = '✅ <strong>Terminaciones:</strong> Buena distribución.';
    let termClass = 'tip-success';
    if (term.maxRep >= 4) {
      termMsg = `🛑 <strong>ALERTA DE TERMINACIÓN:</strong> Tienes 4 o más números con la misma terminación.`;
      termClass = 'tip-danger';
    } else if (term.maxRep === 3) {
      termMsg = `⚠️ <strong>Precaución:</strong> Tienes 3 números con la misma terminación.`;
      termClass = 'tip-warning';
    }
    alerts.push(`<div class="tip-box ${termClass}">${termMsg}</div>`);

    return alerts.join('');
  }

  /**
   * Renderiza el Range Slider para la suma de la combinación.
   */
  _renderRangeSlider(diagnostics) {
    const sum = diagnostics.sum || {};
    const minSum = sum.min || 21;
    const maxSum = sum.max || 321;
    const zoneMin = sum.zoneMin || 120;
    const zoneMax = sum.zoneMax || 220;
    const currentSum = sum.value || 0;

    const rangeTotal = maxSum - minSum;
    const pStartGreen = rangeTotal > 0 ? ((zoneMin - minSum) / rangeTotal) * 100 : 0;
    const pEndGreen = rangeTotal > 0 ? ((zoneMax - minSum) / rangeTotal) * 100 : 0;

    const gradientCSS = `linear-gradient(to right, #ef5350, #fbc02d ${pStartGreen - 5}%, #388e3c ${pStartGreen}%, #388e3c ${pEndGreen}%, #fbc02d ${pEndGreen + 5}%, #ef5350)`;
    
    let sumPos = rangeTotal > 0 ? ((currentSum - minSum) / rangeTotal) * 100 : 0;
    sumPos = Math.max(0, Math.min(100, sumPos));

    let sumMsg = `✅ ¡Excelente! Zona de Ganadores (${zoneMin}-${zoneMax}).`;
    if (currentSum < zoneMin) sumMsg = `⚠️ Zona Baja (Riesgo Estadístico).`;
    else if (currentSum > zoneMax) sumMsg = `⚠️ Zona Alta (Riesgo Estadístico).`;
    
    return `
      <div class="range-wrapper">
        <div class="range-marker-container" style="left: ${sumPos}%; transform: translateX(-50%);">
          <div class="range-value-badge">${currentSum}</div>
        </div>
        <div class="range-container" style="background: ${gradientCSS};"></div>
        <div class="range-labels-container">
          <span class="range-label-left">Min: ${minSum}</span>
          <span class="range-label-abs" style="left:${pStartGreen}%">${zoneMin}</span>
          <span class="range-label-abs" style="left:${pEndGreen}%">${zoneMax}</span>
          <span class="range-label-right">Max: ${maxSum}</span>
        </div>
        <div class="text-center mt-4 font-bold text-seren-green">${sumMsg}</div>
      </div>
    `;
  }

  /**
   * Renderiza la barra de auditoría con porcentajes fijos.
   */
  _renderAuditGrid() {
    return `
      <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs sm:text-sm">
        <div class="bg-yellow-100 text-yellow-800 p-2 sm:p-3 rounded-lg border-2 border-yellow-300">
          <div class="font-black text-base sm:text-xl">11%</div>
          <div class="font-semibold">Abajo</div>
        </div>
        <div class="bg-green-100 text-green-800 p-2 sm:p-3 rounded-lg border-2 border-green-400">
          <div class="font-black text-base sm:text-xl">84%</div>
          <div class="font-semibold">ZONA IDEAL</div>
        </div>
        <div class="bg-red-100 text-red-800 p-2 sm:p-3 rounded-lg border-2 border-red-300">
          <div class="font-black text-base sm:text-xl">5%</div>
          <div class="font-semibold">Arriba</div>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza las tarjetas de estadísticas de Paridad y Primos.
   */
  _renderStatsCards(diagnostics) {
    const parity = diagnostics.parity || {};
    const primes = diagnostics.primes || {};
    
    const parityStatus = parity.status || 'warn'; // good, warn, bad
    const parityBg = { good: 'bg-green-50', bad: 'bg-red-50', warn: 'bg-yellow-50' }[parityStatus];
    const parityBorder = { good: 'border-green-500', bad: 'border-red-500', warn: 'border-yellow-500' }[parityStatus];
    
    const primeStatus = primes.status || 'good';
    const primeBg = { good: 'bg-green-50', bad: 'bg-red-50', warn: 'bg-yellow-50' }[primeStatus];
    const primeBorder = { good: 'border-green-500', bad: 'border-red-500', warn: 'border-yellow-500' }[primeStatus];

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Parity Card -->
        <div class="p-4 rounded-lg border-l-8 ${parityBorder} ${parityBg} shadow-sm">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-bold text-gray-800">Paridad</h3>
            <span class="text-xl">${ {good: '✅', warn: '⚠️', bad: '❌'}[parityStatus] }</span>
          </div>
          <p class="text-2xl font-black text-gray-900">${parity.even || 0} Pares / ${parity.odd || 0} Impares</p>
          <p class="text-xs font-bold text-gray-500 mt-2">${parityStatus === 'good' ? '¡Equilibrio ideal!' : `Riesgo (Tendencia Real: ${parity.trendPct || 'N/A'}%)`}</p>
          <p class="text-xs text-blue-600 font-semibold mt-1">Teórico Histórico: 3 Pares / 3 Impares</p>
        </div>

        <!-- Primes Card -->
        <div class="p-4 rounded-lg border-l-8 ${primeBorder} ${primeBg} shadow-sm">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-bold text-gray-800">Primos</h3>
             <span class="text-xl">${ {good: '✅', warn: '⚠️', bad: '❌'}[primeStatus] }</span>
          </div>
          <p class="text-2xl font-black text-gray-900">${primes.count || 0} Primos</p>
          <p class="text-xs font-bold text-gray-500 mt-2">${primeStatus === 'good' ? '¡Bien! Cantidad sana.' : 'Precaución.'}</p>
          <p class="text-xs text-gray-500 mt-1 truncate">Primos: ${primes.list || '2, 3, 5, 7, 11...'}</p>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza las alertas inferiores (Luz Verde, Estrategia de Mezcla).
   */
  _renderBottomAlerts(diagnostics) {
    const structure = diagnostics.structure || {};
    const mix = diagnostics.mix || {};

    const alerts = [];
    
    if (structure.clean) {
        alerts.push(`<div class="tip-box tip-success">🟢 <strong>LUZ VERDE:</strong> Estructura limpia de repeticiones graves.</div>`);
    } else {
        alerts.push(`<div class="tip-box tip-danger">🛑 <strong>ALERTA DE ESTRUCTURA:</strong> ${structure.message || 'Esta combinación contiene 4 o más números que ya salieron juntos.'}</div>`);
    }

    alerts.push(`<div class="tip-box tip-info">💡 <strong>Estrategia de Mezcla:</strong> Combina "Calientes" (Inercia) con "Rezagados" (Presión). Tu jugada tiene <strong>🔥 ${mix.hot || 0} Calientes</strong> y <strong>🧊 ${mix.cold || 0} Rezagados</strong>.</div>`);
    
    return alerts.join('');
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

    const mh = data.matchHistory;
    const hasMatches = (mh && Object.values(mh).some(v => Array.isArray(v) && v.length > 0));

    if (!hasMatches) {
      const placeholder = document.createElement('div');
      placeholder.className = 'tip-box tip-info';
      placeholder.innerHTML = '<strong>ℹ️ Información:</strong> No se encontraron coincidencias en el historial cargado.';
      section.appendChild(placeholder);
      return section;
    }

    const groups = this._groupMatches(mh, data.meta.historicalCount);
    const matchTitles = { 5: 'Quintetas', 4: 'Cuartetas', 3: 'Tercias' };

    for (const level of [5, 4, 3]) {
      const groupData = groups[level];
      if (!groupData || groupData.length === 0) continue;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'match-group';

      const groupTitle = document.createElement('div');
      groupTitle.className = 'match-group-title';
      groupTitle.textContent = matchTitles[level];
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

  _groupMatches(matchHistory = {}, totalHistorical = 0) {
    const groups = { 5: [], 4: [], 3: [] };
    const mapping = { quinteta: 5, cuarteta: 4, tercia: 3 };

    for (const key in matchHistory) {
        const level = mapping[key];
        if (!level || !groups[level]) continue;
        
        const aggregated = new Map();
        matchHistory[key].forEach(match => {
            const numsKey = match.nums.sort((a, b) => a - b).join(',');
            if (!aggregated.has(numsKey)) {
                aggregated.set(numsKey, { nums: match.nums, count: 0, dates: [] });
            }
            const entry = aggregated.get(numsKey);
            entry.count++;
            entry.dates.push(match.date);
        });

        const sortedMatches = Array.from(aggregated.values()).sort((a,b) => b.count - a.count);
        sortedMatches.forEach(match => {
            match.avgGap = match.count > 0 ? Math.round(totalHistorical / match.count) : 0;
            match.dates.sort((a,b) => new Date(b) - new Date(a));
        });
        
        groups[level] = sortedMatches;
    }
    return groups;
  }

  _renderRadarSection(data) {
    const section = document.createElement('div');
    const diagnostics = data.diagnostics || {};
    const hot = diagnostics.hotNumbers || [];
    const cold = diagnostics.coldNumbers || [];

    section.innerHTML = `
      <h2 class="section-title" style="margin-top: 30px;">3. Radar de Frecuencia</h2>
      <div class="radar-grid">
        <div class="radar-box">
          <div class="radar-head">🔥 Números Calientes</div>
          <div class="radar-subtitle">Más frecuentes en los últimos sorteos.</div>
          <div class="radar-list-vertical">
            ${hot.map(n => `<div class="radar-list-item hot"><strong>${n.number}</strong><span>${n.frequency || 'N/A'}%</span></div>`).join('') || '<div class="text-sm text-gray-500">No hay datos.</div>'}
          </div>
        </div>
        <div class="radar-box">
          <div class="radar-head">🧊 Números Rezagados</div>
          <div class="radar-subtitle">Llevan más tiempo sin aparecer.</div>
          <div class="radar-list-vertical">
            ${cold.map(n => `<div class="radar-list-item cold"><strong>${n.number}</strong><span>${n.drawsAgo || 'N/A'} sorteos</span></div>`).join('') || '<div class="text-sm text-gray-500">No hay datos.</div>'}
          </div>
        </div>
      </div>
    `;
    return section;
  }

  _renderChartsContainer(data) {
    const section = document.createElement('div');
    section.innerHTML = `
      <h2 class="section-title" style="margin-top: 30px;">4. Visualización Estadística</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="chart-container">
          <h3 class="chart-title">Distribución de Premios</h3>
          <canvas id="distributionChart_${data.gameId}"></canvas>
        </div>
        <div class="chart-container">
          <h3 class="chart-title">Convergencia Histórica</h3>
          <canvas id="bernoulliChart_${data.gameId}"></canvas>
        </div>
      </div>
    `;
    return section;
  }

  afterMount() {
    this._initCharts();
    this.mounted = true;
  }
  
  _initCharts() {
    if (typeof Chart === 'undefined' || !this.props.analysisData) return;
    this._initDistributionChart(this.props.analysisData);
    this._initBernoulliChart(this.props.analysisData);
  }

  _initDistributionChart(data) {
    const canvasId = `distributionChart_${data.gameId}`;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    if (this.chartInstances.distribution) this.chartInstances.distribution.destroy();
    
    const dist = data.diagnostics.prizeDistribution || { low: 1, ideal: 1, high: 1 };

    this.chartInstances.distribution = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Zona Baja', 'Zona Ideal', 'Zona Alta'],
        datasets: [{
          data: [dist.low, dist.ideal, dist.high],
          backgroundColor: ['#fbc02d', '#388e3c', '#ef5350'],
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' }}}
    });
  }

  _initBernoulliChart(data) {
    const canvasId = `bernoulliChart_${data.gameId}`;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (this.chartInstances.bernoulli) this.chartInstances.bernoulli.destroy();
    
    const series = data.diagnostics.convergence || [];
    
    this.chartInstances.bernoulli = new Chart(canvas, {
      type: 'line',
      data: {
        labels: series.map(p => p.draw),
        datasets: [{
          label: 'Suma del Sorteo',
          data: series.map(p => p.sum),
          borderColor: '#0B2B26',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: false } },
        plugins: { legend: { display: false } }
      }
    });
  }

  destroy() {
    Object.values(this.chartInstances).forEach(chart => chart && chart.destroy());
    this.chartInstances = {};
    this.mounted = false;
  }
}