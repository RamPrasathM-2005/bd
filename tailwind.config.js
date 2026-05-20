export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#06111f',
        nebula: '#10213a',
        celestial: '#f6d98b',
        pearl: '#fff8e7',
        moon: '#dbe7f3',
        roseglow: '#f4b6b6'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        halo: '0 0 80px rgba(246, 217, 139, 0.25)'
      }
    }
  },
  plugins: []
};
