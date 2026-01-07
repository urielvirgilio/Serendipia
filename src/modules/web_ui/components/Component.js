/**
 * modules/web_ui/components/Component.js
 * Clase base para todos los componentes de UI
 * 
 * [PROTECTED] Implementa Component Pattern
 * Ver ARCH.md sección "3.1 Component Pattern"
 * 
 * Todos los componentes (Ball, Button, Card, etc) heredan de esta clase.
 */

export class Component {
  constructor(options = {}) {
    this.element = null;
    this.props = options.props || {};
    this.state = options.state || {};
    this.children = [];
  }
  
  /**
   * Renderiza el componente
   * Debe ser sobrescrito en subclases
   * 
   * @returns {HTMLElement} Elemento DOM del componente
   */
  render() {
    if (!this.element) {
      this.element = this.createElement();
    }
    return this.element;
  }
  
  /**
   * Crea el elemento DOM
   * Debe ser implementado en subclases
   * 
   * @returns {HTMLElement} Elemento creado
   */
  createElement() {
    // STUB - Subclases implementan lógica específica
    return document.createElement('div');
  }
  
  /**
   * Actualiza las propiedades del componente
   * 
   * @param {Object} newProps - Nuevas propiedades
   */
  setProps(newProps) {
    this.props = { ...this.props, ...newProps };
    this.update();
  }
  
  /**
   * Actualiza el estado interno del componente
   * 
   * @param {Object} newState - Nuevo estado
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.update();
  }
  
  /**
   * Re-renderiza el componente
   */
  update() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.replaceChild(this.render(), this.element);
    }
  }
  
  /**
   * Agrega un evento al componente
   * 
   * @param {string} eventName - Nombre del evento (click, input, etc)
   * @param {Function} handler - Función manejadora
   */
  on(eventName, handler) {
    if (this.element) {
      this.element.addEventListener(eventName, handler);
    }
  }
  
  /**
   * Monta el componente en un contenedor del DOM
   * 
   * @param {HTMLElement|string} container - Selector o elemento
   */
  mount(container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    
    if (container) {
      container.appendChild(this.render());
    }
  }
  
  /**
   * Desmonta el componente del DOM
   */
  unmount() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
  
  /**
   * Retorna información legible del componente
   * 
   * @returns {string} Descripción del componente
   */
  toString() {
    return `Component(${this.constructor.name})`;
  }
}

export default Component;
