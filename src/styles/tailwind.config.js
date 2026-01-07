/* Tailwind CSS Configuration
 * 
 * Configuración mínima para Serendipia
 * En desarrollo: TailwindCSS cargado desde CDN en index.html
 * En producción: Usar build tool (Vite, etc)
 * 
 * Ver DESIGN.md para paleta de colores corporativos
 */

module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        'seren-green': '#0B2B26',
        'seren-gold': '#C5A059',
        'semaphore-red': '#E63946',
        'semaphore-yellow': '#F4A261',
        'semaphore-green': '#2A9D8F',
        'neutral': {
          '50': '#FAFAFA',
          '100': '#F5F5F5',
          '200': '#E0E0E0',
          '300': '#CCCCCC',
          '400': '#999999',
          '500': '#666666',
          '600': '#535353',
          '700': '#404040',
          '800': '#2D2D2D',
          '900': '#1A1A1A',
        }
      },
      fontFamily: {
        'primary': ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'display': ['Playfair Display', 'serif']
      },
      spacing: {
        'xs': '0.25rem',  // 4px
        'sm': '0.5rem',   // 8px
        'md': '1rem',     // 16px
        'lg': '1.5rem',   // 24px
        'xl': '2rem',     // 32px
        '2xl': '3rem',    // 48px
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        'full': '9999px',
      }
    }
  },
  plugins: [],
};
