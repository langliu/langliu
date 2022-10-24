import type { Linter } from 'eslint';

export const eslintConfig: Linter.BaseConfig = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: ['plugin:react/recommended', '@langliu'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {},
};
