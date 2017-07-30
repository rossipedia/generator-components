export default [
  {
    entry: './index.js',
    dest: './react-driver.cjs.js',
    format: 'cjs',
    external: ['react'],
  },
  {
    entry: './index.js',
    dest: './react-driver.es.js',
    format: 'es',
    external: ['react'],
  },
];
