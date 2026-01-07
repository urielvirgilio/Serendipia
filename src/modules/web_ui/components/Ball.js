/**
 * modules/web_ui/components/Ball.js
 * Componente de bola de lotería
 * 
 * [DESIGN-LOCKED] Especificación en DESIGN.md sección "2.2 Componentes"
 * Visualización: Círculo 65px, border 2px
 * Estados: normal, focus, hot, cold
 * 
 * Ver DESIGN.md para detalles de estilos
 */

import Component from './Component.js';
import COLORS from '../../../config/colors.js';

export class Ball extends Component {
  constructor(options = {}) {
    super(options);
    this.props = {
      id: options.id || null, // ID for label uniqueness
      number: options.number || '',
      max: options.max || 56,
      frequency: options.frequency || 0,
      status: options.status || 'normal', // 'hot'|'cold'|'normal'
      onChange: options.onChange || null,
      autoFocusNext: options.autoFocusNext || null
    };
    this.input = null;
    this.freqLabel = null;
  }

  createElement() {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col items-center gap-1'; // New wrapper style

    // Circle input (maintains .ball class for existing styles)
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 2;
    input.className = 'ball'; // Keep base styles for the ball itself
    input.value = this.props.number !== '' ? String(this.props.number) : '';

    // Frequency label (new style from prompt)
    const label = document.createElement('div');
    label.id = `freq_${this.props.id}`;
    label.className = 'bg-gray-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm min-h-[20px] min-w-[50px] text-center transition-all duration-300 opacity-0';
    
    wrapper.appendChild(input);
    wrapper.appendChild(label);

    // Event handling (preserved from original)
    input.addEventListener('input', (e) => {
      const cleaned = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = cleaned;

      const num = cleaned === '' ? '' : parseInt(cleaned, 10);
      if (num !== '' && !isNaN(num) && num > this.props.max) {
        e.target.value = String(this.props.max);
      }

      if (typeof this.props.onChange === 'function') {
        this.props.onChange(e.target.value === '' ? null : parseInt(e.target.value, 10));
      }

      if (e.target.value.length === 2 && typeof this.props.autoFocusNext === 'function') {
        this.props.autoFocusNext();
      }
    });

    // Store references
    this.input = input;
    this.freqLabel = label;
    this.element = wrapper;

    return wrapper;
  }

  // Public API to get current number
  getNumber() {
    const v = this.input ? this.input.value : '';
    return v === '' ? null : parseInt(v, 10);
  }

  setNumber(n) {
    if (this.input) this.input.value = n === null ? '' : String(n);
  }

  setFrequency(freq) {
    this.props.frequency = freq;
    if (this.freqLabel) {
      if (freq > 0) {
        this.freqLabel.textContent = `x${freq}`;
        this.freqLabel.classList.add('visible');
        this.freqLabel.classList.remove('opacity-0');
      } else {
        this.freqLabel.textContent = '';
        this.freqLabel.classList.remove('visible');
        this.freqLabel.classList.add('opacity-0');
      }
    }
  }

  focus() {
    if (this.input) this.input.focus();
  }
}

export default Ball;
