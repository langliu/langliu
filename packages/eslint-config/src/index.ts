// import { eslintConfig } from './lib/eslint-config';

module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {},
};
