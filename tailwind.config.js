/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        'paper-deep': 'var(--color-paper-deep)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        muted: 'var(--color-muted)',
        faint: 'var(--color-faint)',
        line: 'var(--color-line)',
        pen: 'var(--color-pen)',
        accent: 'var(--color-accent)',
        rust: 'var(--color-rust)',
      },
      fontFamily: {
        // Jackson's own handwriting, converted to a typeface. Caveat is only
        // the fallback while the file loads.
        hand: ['"Tul The Line"', 'Caveat', 'cursive'],
        scrawl: ['"Tul The Line"', 'Caveat', 'cursive'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        label: '0.24em',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
