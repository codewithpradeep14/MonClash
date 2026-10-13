/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0B12',
          secondary: '#111320',
          card: '#16192A',
          cardHover: '#1D2136',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        brand: {
          violet: '#836EF9', // True Monad electric iris
          purple: '#6D55E0',
          iris: '#9B7BFF',
          glow: 'rgba(131, 110, 249, 0.35)',
        },
        tactile: {
          mint: '#10B981',
          sage: '#34D399',
          emerald: '#059669',
        },
        positive: '#10B981',
        warning: '#F59E0B',
        negative: '#FF4D6D',
        accent: {
          gold: '#FBBF24',
          amber: '#F59E0B',
          coral: '#FF4D6D',
          sky: '#38BDF8',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'pill': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'pill-active': '0 4px 24px -2px rgba(131, 110, 249, 0.35), 0 0 0 1px rgba(131, 110, 249, 0.4)',
        'pill-mint': '0 4px 20px -2px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.3)',
        'tactile-card': '0 12px 36px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'tactile-card-hover': '0 20px 40px -10px rgba(131, 110, 249, 0.2), 0 0 0 1px rgba(131, 110, 249, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
        'ticker': 'ticker 22s linear infinite',
        'doodle-bob': 'doodleBob 3s ease-in-out infinite',
        'doodle-blink': 'doodleBlink 4s infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        doodleBob: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(1.5deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 8px rgba(131, 110, 249, 0.2)' },
          '100%': { boxShadow: '0 0 24px rgba(131, 110, 249, 0.5)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
