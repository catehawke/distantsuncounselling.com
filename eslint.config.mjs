import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

// Add a section for browser / ES5 if we include scripts in the browser

export default [
  {
    files: ['.eleventy.js', '**/*js'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
    },
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];
