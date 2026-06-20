export default {
  content: ['./src/**/*.{html,js,tsx}'],
  theme: {
    extend: {
      colors: {
        'base-100': 'rgb(var(--mx-bg-rgb) / <alpha-value>)',
        'base-200': 'rgb(var(--mx-hover-rgb) / <alpha-value>)',
        'base-300': 'rgb(var(--mx-line-rgb) / <alpha-value>)',
        'base-content': 'rgb(var(--mx-ink-rgb) / <alpha-value>)',
        'primary': 'rgb(var(--mx-accent-rgb) / <alpha-value>)',
        'primary-content': '#ffffff',
        'secondary': 'rgb(var(--mx-muted-rgb) / <alpha-value>)',
        'accent': 'rgb(var(--mx-accent-rgb) / <alpha-value>)',
        'success': '#22c55e',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#38bdf8',
      },
    },
  },
  plugins: [],
};
