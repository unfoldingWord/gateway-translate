module.exports = {
  content: ['./pages/**/*.js', './src/components/**/*.js'],
  darkMode: 'media', // or 'class'
  important: true,
  theme: {
    extend: {
      colors: {
        grey: { 450: '#eaeaea' },
        primary: '#38ADDF',
      },
      spacing: {
        98: '26rem',
        100: '28rem',
        102: '30rem',
        104: '32rem',
        106: '34rem',
        108: '36rem',
        110: '38rem',
        112: '40rem',
        114: '42rem',
        116: '44rem',
        118: '46rem',
        120: '48rem',
        122: '50rem',
        124: '52rem',
        126: '54rem',
        128: '56rem',
        130: '58rem',
        132: '60rem',
      },
    },
  },
  variants: { extend: {} },
  plugins: [],
  corePlugins: { preflight: false },
}
