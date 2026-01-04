module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#A855F7', // roxo mais claro para hover
          600: '#8A2BE2', // seu roxo principal (138, 43, 226)
          700: '#7B24D1',
          800: '#6218B0',
          900: '#4A1080',
        },
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(to bottom right, #8A2BE2, #4A1080)',
      },
    },
  },
  plugins: [
    require('@codaworks/react-glow/tailwind')
  ],
}