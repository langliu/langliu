import type { Linter } from 'eslint';

export const eslintConfig: Linter.BaseConfig = {
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
