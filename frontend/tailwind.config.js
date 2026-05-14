/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bistro: {
          bg:           '#0F0A06',
          surface:      '#1C1108',
          card:         '#251C10',
          primary:      '#D4A040',
          'primary-dk': '#B8852A',
          accent:       '#C03520',
          text:         '#F2E4CC',
          muted:        '#8A7060',
          border:       '#3A2818',
          success:      '#52A060',
        },
      },
    },
  },
  plugins: [],
};
