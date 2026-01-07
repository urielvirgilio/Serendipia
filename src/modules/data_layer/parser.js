/**
 * modules/data_layer/parser.js
 * Funciones de parseo de datos (CSV) con detección automática
 * 
 * [PROTECTED-DATA] Lógica pura de transformación de datos
 * Responsabilidad: Validar y transformar datos externos al formato Serendipia
 * 
 * Usa PapaParse (global: window.Papa)
 * Formato esperado de CSV (flexible):
 *   - Columnas con dígitos = números de sorteo
 *   - Columna con fecha = fecha del sorteo
 *   - Se detectan automáticamente
 */

/**
 * Parsea archivo CSV con detección automática de columnas
 * Funciona con múltiples formatos de CSV
 * 
 * Formato común:
 *   fecha,num1,num2,num3,num4,num5,num6[,num7]
 *   2024-01-01,5,12,25,38,45,55[,bonus]
 * 
 * @param {File|string} csvInput - Archivo o contenido CSV
 * @param {string} gameType - Tipo de juego ('melate', 'retro', 'chispazo')
 * @returns {Promise<Object>} { ok: boolean, draws?: Array, error?: string }
 * @throws {Error} Si PapaParse no está disponible
 */
export async function parseCSV(csvInput, gameType = 'melate') {
  if (typeof window === 'undefined' || !window.Papa) {
    throw new Error('PapaParse not available. Include PapaParse CDN in HTML.');
  }

  try {
    // Detectar si es File o string
    let csvContent = '';
    if (csvInput instanceof File) {
      csvContent = await csvInput.text();
    } else if (typeof csvInput === 'string') {
      csvContent = csvInput;
    } else {
      return { ok: false, error: 'Input must be File or string' };
    }

    // Parsear con PapaParse
    const parsed = window.Papa.parse(csvContent, {
      header: false,
      skipEmptyLines: true,
      dynamicTyping: true
    });

    if (parsed.errors && parsed.errors.length > 0) {
      return { 
        ok: false, 
        error: `CSV parsing error: ${parsed.errors[0].message}` 
      };
    }

    if (!parsed.data || parsed.data.length < 2) {
      return { ok: false, error: 'CSV must have header and at least 1 data row' };
    }

    // Detectar columnas
    const header = parsed.data[0];
    const { dateColIndex, numberColIndices, additionalColIndex } = _detectColumns(
      header,
      gameType
    );

    if (numberColIndices.length === 0) {
      return { 
        ok: false, 
        error: 'No numeric columns detected. Check CSV format.' 
      };
    }

    // Limpiar y validar datos
    const draws = [];
    for (let i = 1; i < parsed.data.length; i++) {
      const row = parsed.data[i];

      // Saltar filas vacías
      if (!row || row.length === 0) continue;
      if (row.every(cell => cell === null || cell === undefined || cell === '')) {
        continue;
      }

      try {
        // Extraer fecha
        const fechaRaw = dateColIndex !== -1 ? row[dateColIndex] : null;
        const fecha = _parseDate(fechaRaw) || new Date();

        // Extraer números de sorteo
        const nums = numberColIndices
          .map(idx => row[idx])
          .filter(val => val !== null && val !== undefined && val !== '')
          .map(val => parseInt(val, 10))
          .filter(val => !isNaN(val) && val > 0);

        // Extraer número adicional (Melate tiene 7mo número)
        const additional = additionalColIndex !== -1 ? 
          parseInt(row[additionalColIndex], 10) : null;

        // Validar que tenemos números suficientes
        if (nums.length < 2) continue;

        draws.push({
          fecha: fecha,
          nums: nums,
          additional: additional
        });
      } catch (err) {
        console.warn(`⚠️ Error parsing row ${i}:`, row, err);
        continue;
      }
    }

    if (draws.length === 0) {
      return { ok: false, error: 'No valid rows parsed from CSV' };
    }

    // Ordenar por fecha
    draws.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    console.log(`✅ Parsed ${draws.length} draws from CSV`);
    return { ok: true, draws: draws };
  } catch (err) {
    console.error('❌ CSV parsing error:', err);
    return { ok: false, error: err.message };
  }
}

/**
 * Detecta automáticamente qué columnas contienen fecha y números
 * 
 * @private
 * @param {Array} header - Primera fila (encabezados)
 * @param {string} gameType - Tipo de juego
 * @returns {Object} { dateColIndex, numberColIndices, additionalColIndex }
 */
function _detectColumns(header, gameType) {
  let dateColIndex = -1;
  const numberColIndices = [];
  let additionalColIndex = -1;

  const headerNorm = header.map(h => (typeof h === 'string' ? h.toLowerCase() : ''));

  // Buscar columna de fecha
  const datePatterns = ['fecha', 'date', 'day', 'día', 'sorteo'];
  for (let i = 0; i < headerNorm.length; i++) {
    if (datePatterns.some(p => headerNorm[i].includes(p))) {
      dateColIndex = i;
      break;
    }
  }

  // Si no encontró fecha, la primera columna es fecha
  if (dateColIndex === -1 && header.length > 1) {
    dateColIndex = 0;
  }

  // Buscar columnas de números (ignorar fecha, bonus, etc)
  const numberPatterns = ['num', 'ball', 'bola', 'número'];
  for (let i = 0; i < header.length; i++) {
    if (i === dateColIndex) continue;

    const headerLower = headerNorm[i];
    
    // Detectar si es número normal o adicional
    const isAdditional = headerLower.includes('bonus') || 
                        headerLower.includes('additional') ||
                        headerLower.includes('extra') ||
                        headerLower.includes('complementario');
    
    if (isAdditional) {
      additionalColIndex = i;
    } else if (numberPatterns.some(p => headerLower.includes(p)) ||
               /^(num|ball|n)\d+$/i.test(headerLower) ||
               headerLower.match(/^\d+$/) ||
               /[0-9]+/.test(headerLower)) {
      numberColIndices.push(i);
    }
  }

  // Si no encontró columnas nombradas, asume todo except primera es números
  if (numberColIndices.length === 0) {
    for (let i = 0; i < header.length; i++) {
      if (i !== dateColIndex) {
        numberColIndices.push(i);
      }
    }
  }

  return { dateColIndex, numberColIndices, additionalColIndex };
}

/**
 * Parsea diferentes formatos de fecha
 * 
 * @private
 * @param {*} dateRaw - Valor de fecha
 * @returns {Date|null} Fecha parseada o null
 */
function _parseDate(dateRaw) {
  if (!dateRaw) return null;

  // Si ya es Date
  if (dateRaw instanceof Date) return dateRaw;

  // String a Date
  if (typeof dateRaw === 'string') {
    const parsed = new Date(dateRaw);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  // Numeric (Excel timestamp)
  if (typeof dateRaw === 'number') {
    const excelDate = new Date((dateRaw - 25569) * 86400 * 1000);
    if (!isNaN(excelDate.getTime())) {
      return excelDate;
    }
  }

  return null;
}

/**
 * Simula un parseo de CSV desde string (para tests sin PapaParse)
 * 
 * @param {string} csvString - CSV como string simple
 * @returns {Promise<Object>} { ok, draws, error }
 */
export async function parseCSVSimple(csvString) {
  try {
    const lines = csvString.trim().split('\n').filter(line => line.length > 0);
    if (lines.length < 2) {
      return { ok: false, error: 'CSV must have header and data' };
    }

    const draws = [];
    // Saltar header, procesar data
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < 7) continue;

      // Parsear fecha
      const fecha = new Date(parts[0]);
      if (isNaN(fecha.getTime())) continue;

      // Parsear números
      const nums = parts.slice(1, 7)
        .map(n => parseInt(n, 10))
        .filter(n => !isNaN(n) && n > 0);

      if (nums.length === 6) {
        draws.push({
          fecha: fecha,
          nums: nums,
          additional: null
        });
      }
    }

    if (draws.length === 0) {
      return { ok: false, error: 'No valid rows parsed' };
    }

    return { ok: true, draws: draws };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Convierte draws históricos a formato de resumen estadístico
 * 
 * @param {Array} draws - Array de draws
 * @returns {Object} Estadísticas básicas
 */
export function summarizeDraws(draws) {
  if (!Array.isArray(draws) || draws.length === 0) {
    return {
      totalDraws: 0,
      dateRange: { from: null, to: null },
      numbersFrequency: {}
    };
  }

  const dates = draws.map(d => new Date(d.fecha)).sort((a, b) => a - b);
  const numberFreq = {};

  // Contar frecuencias
  for (const draw of draws) {
    for (const num of draw.nums) {
      numberFreq[num] = (numberFreq[num] || 0) + 1;
    }
  }

  return {
    totalDraws: draws.length,
    dateRange: {
      from: dates[0],
      to: dates[dates.length - 1]
    },
    numbersFrequency: numberFreq
  };
}

/**
 * Exporta análisis a formato CSV
 * 
 * @param {Object} analysis - Análisis realizado
 * @returns {string} CSV formateado
 */
export function exportAnalysisAsCSV(analysis) {
  // STUB - Implementación en siguiente fase
  return '';
}

/**
 * Exporta análisis a JSON
 * @param {Object} analysis
 * @returns {string}
 */
export function exportAnalysisAsJSON(analysis) {
  try {
    return JSON.stringify(analysis, null, 2);
  } catch (err) {
    return '';
  }
}

/**
 * Wrapper para parsear draws históricos.
 * Usa PapaParse si está disponible, sino usa parseCSVSimple como fallback.
 * @param {File|string} csvInput
 * @param {string} gameType
 * @returns {Promise<Object>} { ok, draws, error }
 */
export async function parseHistoricalDrawsCSV(csvInput, gameType = 'melate') {
  try {
    if (typeof window !== 'undefined' && window.Papa) {
      return await parseCSV(csvInput, gameType);
    }

    // Fallback: si es File, leemos texto y usamos parseCSVSimple
    if (csvInput instanceof File) {
      const txt = await csvInput.text();
      return await parseCSVSimple(txt);
    }

    if (typeof csvInput === 'string') {
      return await parseCSVSimple(csvInput);
    }

    return { ok: false, error: 'Input must be string or File' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export default {
  parseCSV,
  parseCSVSimple,
  parseHistoricalDrawsCSV,
  summarizeDraws,
  exportAnalysisAsJSON,
  exportAnalysisAsCSV
};
