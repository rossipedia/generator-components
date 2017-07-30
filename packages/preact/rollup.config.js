export default [
  {
    entry: './index.js',
    dest: './preact-driver.cjs.js',
    format: 'cjs',
    external: ['preact'],
  },
  {
    entry: './index.js',
    dest: './preact-driver.es.js',
    format: 'es',
    external: ['preact'],
  },
];
