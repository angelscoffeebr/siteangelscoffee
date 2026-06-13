/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1E2A38',        // azul-marinho
        'primary-dark': '#141C26',
        'primary-light': '#2C3E52',
        accent: '#C2A14D',         // dourado/latao
        'accent-dark': '#A8893B',
        sage: '#9DA98C',           // verde broto-de-fava
        background: '#F6F1E7',      // bege off-white
        surface: '#FCF9F3',        // creme claro
        ink: '#1E2A38',            // texto = navy
        muted: '#6B6256',          // texto secundario taupe
        divider: '#E4DCCB',
        deep: '#141C26',           // dark sections
      },
      fontFamily: {
        display: ['"Libre Caslon Display"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        '7xl': '4rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
