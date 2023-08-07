import dsv from '@rollup/plugin-dsv';

export default {
  input: 'src/main.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [dsv()]
};