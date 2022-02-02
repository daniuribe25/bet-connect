const moduleResolver = [
  'module-resolver',
  {
    root: ['./'],
    alias: {
      api: './src/api',
      assets: './src/assets',
      components: './src/components',
      helpers: './src/helpers',
      hooks: './src/hooks',
      providers: './src/providers',
      redux: './src/redux',
      styles: './src/styles',
      views: './src/views',
      util: './src/util',
      "unit-test-utils": './src/unit-test-utils',
    },
  },
];

module.exports = {
  plugins: [
    moduleResolver,
    ["@babel/plugin-transform-react-jsx", { "runtime": "automatic" }], '@babel/transform-runtime',
  ],
  presets: [['@babel/preset-env', { loose: true }], '@babel/preset-react', '@babel/preset-typescript'],
};
