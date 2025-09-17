// eslint.config.js
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parser: '@babel/eslint-parser', 
      parserOptions: {
        requireConfigFile: false, 
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true, 
        },
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
      'react/prop-types': 'off', 
    },
  },

  // Ignore build and dependency files
  {
    ignores: ['node_modules/**', 'dist/**', '.next/**'],
  },
];
