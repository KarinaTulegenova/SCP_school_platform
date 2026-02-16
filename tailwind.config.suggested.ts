import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5'
        },
        success: {
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669'
        }
      },
      borderRadius: {
        glass: '1.25rem'
      },
      boxShadow: {
        glass: '0 10px 30px rgba(15, 23, 42, 0.08)'
      },
      backdropBlur: {
        xs: '2px'
      },
      backgroundImage: {
        'soft-radial':
          'radial-gradient(circle at 12% 15%, rgba(99,102,241,.16), transparent 28%), radial-gradient(circle at 85% 10%, rgba(16,185,129,.12), transparent 26%)'
      }
    }
  },
  plugins: []
};

export default config;
