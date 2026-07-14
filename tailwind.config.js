/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        inverted: { DEFAULT: 'var(--inverted)', foreground: 'var(--inverted-foreground)' },
      },
      fontFamily: { display: 'var(--font-display)', body: 'var(--font-body)' },
      fontSize: {
        display: ['var(--fs-display)', { lineHeight: '1.02' }],
        heading: ['var(--fs-heading)', { lineHeight: '1.1' }],
        'body-token': ['var(--fs-body)', { lineHeight: '1.5' }],
        caption: ['var(--fs-caption)', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [],
}
