module.exports = {
  ignorePatterns: ['node_modules/', 'dist/', 'site/js'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: { node: true },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      // No Babel so support ES5
      files: ['src/**/*.js'],
      parserOptions: {
        ecmaVersion: 5,
        sourceType: 'script',
      },
      env: { browser: true },
    }
  ]
};
