// eslint.config.js
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';

export default [
  // Base recommended rules
  js.configs.recommended,

  // React rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        jsx: true, // enable JSX parsing
      },
      globals: {
        browser: true,
        node: true,
        es2021: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Ignore generated or dist files
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
