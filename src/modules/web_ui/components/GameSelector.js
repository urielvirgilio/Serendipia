import Component from './Component.js';
import COLORS from '../../../config/colors.js';

export class GameSelector extends Component {
  constructor(options = {}) {
    super(options);
    this.props = {
      activeGame: options.activeGame || 'melate',
      games: options.games || ['melate', 'retro', 'chispazo'],
      onGameChange: options.onGameChange || null
    };
    this.buttons = [];
  }

  createElement() {
    const container = document.createElement('div');
    container.className = 'nav-tabs';

    this.props.games.forEach((g) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-btn';
      btn.textContent = g.charAt(0).toUpperCase() + g.slice(1);

      if (g === this.props.activeGame) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        this.setActive(g);
        if (typeof this.props.onGameChange === 'function') {
          this.props.onGameChange(g);
        }
      });

      this.buttons.push(btn);
      container.appendChild(btn);
    });

    this.element = container;
    return container;
  }

  setActive(gameId) {
    this.props.activeGame = gameId;
    // Update visual state
    this.buttons.forEach((btn) => {
      const label = btn.textContent.toLowerCase();
      if (label === gameId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

export default GameSelector;
