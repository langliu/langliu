import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, lazyPlugins } from 'vite-plus'
import { voidPlugin } from 'void'

const ignorePatterns = [
  '.agents/**',
  'dist/**',
  'worker-configuration.d.ts',
  'src/routeTree.gen.ts',
  'public/**/*.svg',
  'public/static/**',
]

export default defineConfig({
  fmt: {
    ignorePatterns,
    printWidth: 100,
    singleQuote: true,
    jsxSingleQuote: true,
    semi: false,
    sortImports: {},
    sortTailwindcss: {
      stylesheet: './src/styles/app.css',
      functions: ['cn', 'clsx', 'twMerge', 'tw', 'cva'],
    },
  },
  lint: {
    ignorePatterns,
    plugins: ['eslint', 'typescript', 'oxc', 'react', 'jsx-a11y'],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  staged: {
    '*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc,css}':
      'vp check --fix --no-error-on-unmatched-pattern',
  },
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: lazyPlugins(() => [
    // voidPlugin 必须在框架插件之前；它取代了原来的 @cloudflare/vite-plugin，
    // 负责本地 workers 运行时、迁移和部署
    voidPlugin(),
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
    }),
    viteReact(),
  ]),
})
