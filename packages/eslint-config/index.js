import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import * as pluginImport from 'eslint-plugin-import'
import pluginN from 'eslint-plugin-n'
import pluginPromise from 'eslint-plugin-promise'

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      '@stylistic': stylistic,
      import: pluginImport,
      n: pluginN,
      promise: pluginPromise,
    },
    rules: {
      'no-var': 'warn', // https://eslint.org/docs/latest/rules/no-var#rule-details
      'object-shorthand': ['warn', 'properties'], // https://eslint.org/docs/latest/rules/object-shorthand#rule-details
      'accessor-pairs': ['error', { setWithoutGet: true, enforceForClassMembers: true }], // https://eslint.org/docs/latest/rules/accessor-pairs#rule-details
      '@stylistic/array-bracket-spacing': ['error', 'never'], // https://eslint.style/rules/js/array-bracket-spacing
      'array-callback-return': [
        'error',
        {
          allowImplicit: false,
          checkForEach: false,
        },
      ], // https://eslint.org/docs/latest/rules/array-callback-return#rule-details
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }], // https://eslint.style/rules/js/arrow-spacing#js-arrow-spacing
      '@stylistic/block-spacing': ['error', 'always'], // https://eslint.style/rules/js/block-spacing
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }], // https://eslint.style/rules/js/brace-style
      camelcase: [
        'error',
        {
          allow: ['^UNSAFE_'],
          properties: 'never',
          ignoreGlobals: true,
        },
      ], // https://eslint.org/docs/latest/rules/camelcase#rule-details
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'never',
          objects: 'never',
          imports: 'never',
          exports: 'never',
          functions: 'never',
        },
      ], // https://eslint.style/rules/js/comma-dangle#js-comma-dangle
      '@stylistic/comma-spacing': ['error', { before: false, after: true }], // https://eslint.style/rules/js/comma-spacing
      '@stylistic/comma-style': ['error', 'last'], // https://eslint.style/rules/js/comma-style#js-comma-style
      '@stylistic/computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }], // https://eslint.style/rules/js/computed-property-spacing#js-computed-property-spacing
      'constructor-super': 'error', // https://eslint.org/docs/latest/rules/constructor-super#rule-details
      curly: ['error', 'multi-line'], // https://eslint.org/docs/latest/rules/curly#rule-details
      'default-case-last': 'error', // https://eslint.org/docs/latest/rules/default-case-last#rule-details
      '@stylistic/dot-location': ['error', 'property'], // https://eslint.style/rules/js/dot-location
      'dot-notation': ['error', { allowKeywords: true }], // https://eslint.org/docs/latest/rules/dot-notation
      '@stylistic/eol-last': 'error', // https://eslint.style/rules/js/eol-last
      eqeqeq: ['error', 'always', { null: 'ignore' }], // https://eslint.org/docs/latest/rules/eqeqeq
      '@stylistic/function-call-spacing': ['error', 'never'], // https://eslint.style/rules/js/function-call-spacing
      '@stylistic/generator-star-spacing': ['error', { before: true, after: true }], // https://eslint.style/rules/js/generator-star-spacing
      '@stylistic/indent': [
        'error',
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: 1,
          outerIIFEBody: 1,
          MemberExpression: 1,
          FunctionDeclaration: { parameters: 1, body: 1 },
          FunctionExpression: { parameters: 1, body: 1 },
          CallExpression: { arguments: 1 },
          ArrayExpression: 1,
          ObjectExpression: 1,
          ImportDeclaration: 1,
          flatTernaryExpressions: false,
          ignoreComments: false,
          ignoredNodes: [
            'TemplateLiteral *',
            'JSXElement',
            'JSXElement > *',
            'JSXAttribute',
            'JSXIdentifier',
            'JSXNamespacedName',
            'JSXMemberExpression',
            'JSXSpreadAttribute',
            'JSXExpressionContainer',
            'JSXOpeningElement',
            'JSXClosingElement',
            'JSXFragment',
            'JSXOpeningFragment',
            'JSXClosingFragment',
            'JSXText',
            'JSXEmptyExpression',
            'JSXSpreadChild',
          ],
          offsetTernaryExpressions: true,
        },
      ], // https://eslint.style/rules/js/indent
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }], // https://eslint.style/rules/js/key-spacing
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }], // https://eslint.style/rules/js/keyword-spacing
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ], // https://eslint.style/rules/js/lines-between-class-members
      '@stylistic/multiline-ternary': ['error', 'always-multiline'], // https://eslint.style/rules/js/multiline-ternary
      'new-cap': ['error', { newIsCap: true, capIsNew: false, properties: true }], // https://eslint.org/docs/latest/rules/new-cap
      '@stylistic/new-parens': 'error', // https://eslint.style/rules/js/new-parens
      'no-array-constructor': 'error', // https://eslint.org/docs/latest/rules/no-array-constructor
      'no-async-promise-executor': 'error', // https://eslint.org/docs/latest/rules/no-async-promise-executor
      'no-caller': 'error', // https://eslint.org/docs/latest/rules/no-caller
      'no-case-declarations': 'error', // https://eslint.org/docs/latest/rules/no-case-declarations
      'no-class-assign': 'error', // https://eslint.org/docs/latest/rules/no-class-assign
      'no-compare-neg-zero': 'error', // https://eslint.org/docs/latest/rules/no-compare-neg-zero
      'no-cond-assign': 'error', // https://eslint.org/docs/latest/rules/no-cond-assign
      'no-const-assign': 'error', // https://eslint.org/docs/latest/rules/no-const-assign
      'no-constant-condition': ['error', { checkLoops: false }], // https://eslint.org/docs/latest/rules/no-constant-condition
      'no-control-regex': 'error', // https://eslint.org/docs/latest/rules/no-control-regex
      'no-debugger': 'error', // https://eslint.org/docs/latest/rules/no-debugger
      'no-delete-var': 'error', // https://eslint.org/docs/latest/rules/no-delete-var
      'no-dupe-args': 'error', // https://eslint.org/docs/latest/rules/no-dupe-args
      'no-dupe-class-members': 'error', // https://eslint.org/docs/latest/rules/no-dupe-class-members
      'no-dupe-keys': 'error', // https://eslint.org/docs/latest/rules/no-dupe-keys
      'no-duplicate-case': 'error', // https://eslint.org/docs/latest/rules/no-duplicate-case
      'no-useless-backreference': 'error', // https://eslint.org/docs/latest/rules/no-useless-backreference
      'no-empty': ['error', { allowEmptyCatch: true }], // https://eslint.org/docs/latest/rules/no-empty
      'no-empty-character-class': 'error', // https://eslint.org/docs/latest/rules/no-empty-character-class
      'no-empty-pattern': 'error', // https://eslint.org/docs/latest/rules/no-empty-pattern
      'no-eval': 'error', // https://eslint.org/docs/latest/rules/no-eval
      'no-ex-assign': 'error', // https://eslint.org/docs/latest/rules/no-ex-assign
      'no-extend-native': 'error', // https://eslint.org/docs/latest/rules/no-extend-native
      'no-extra-bind': 'error', // https://eslint.org/docs/latest/rules/no-extra-bind
      'no-extra-boolean-cast': 'error', // https://eslint.org/docs/latest/rules/no-extra-boolean-cast
      '@stylistic/no-extra-parens': ['error', 'functions'], // https://eslint.style/rules/js/no-extra-parens
      'no-fallthrough': 'error', // https://eslint.org/docs/latest/rules/no-fallthrough
      '@stylistic/no-floating-decimal': 'error', // https://eslint.style/rules/js/no-floating-decimal
      'no-func-assign': 'error', // https://eslint.org/docs/latest/rules/no-func-assign
      'no-global-assign': 'error', // https://eslint.org/docs/latest/rules/no-global-assign
      'no-implied-eval': 'error', // https://eslint.org/docs/latest/rules/no-implied-eval
      'no-import-assign': 'error', // https://eslint.org/docs/latest/rules/no-import-assign
      'no-invalid-regexp': 'error', // https://eslint.org/docs/latest/rules/no-invalid-regexp
      'no-irregular-whitespace': 'error', // https://eslint.org/docs/latest/rules/no-irregular-whitespace
      'no-iterator': 'error', // https://eslint.org/docs/latest/rules/no-iterator
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-loss-of-precision': 'error',
      'no-misleading-character-class': 'error',
      'no-prototype-builtins': 'error',
      'no-useless-catch': 'error',
      '@stylistic/no-mixed-operators': [
        'error',
        {
          groups: [
            ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
            ['&&', '||'],
            ['in', 'instanceof'],
          ],
          allowSamePrecedence: true,
        },
      ], // https://eslint.style/rules/js/no-mixed-operators
      '@stylistic/no-mixed-spaces-and-tabs': 'error', // https://eslint.style/rules/js/no-mixed-spaces-and-tabs
      '@stylistic/no-multi-spaces': 'error', // https://eslint.style/rules/js/no-multi-spaces
      'no-multi-str': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }], // https://eslint.style/rules/js/no-multiple-empty-lines
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-object': 'error',
      'no-new-symbol': 'error',
      'no-new-wrappers': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-redeclare': ['error', { builtinGlobals: false }],
      'no-regex-spaces': 'error',
      'no-return-assign': ['error', 'except-parens'],
      'no-self-assign': ['error', { props: true }],
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      '@stylistic/no-tabs': 'error', // https://eslint.style/rules/js/no-tabs
      'no-template-curly-in-string': 'error',
      'no-this-before-super': 'error',
      'no-throw-literal': 'error',
      '@stylistic/no-trailing-spaces': 'error', // https://eslint.style/rules/js/no-trailing-spaces
      'no-undef': 'error', // https://eslint.org/docs/latest/rules/no-undef
      'no-undef-init': 'error',
      'no-unexpected-multiline': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'no-unused-vars': [
        'error',
        {
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          vars: 'all',
        },
      ],
      'no-use-before-define': ['error', { functions: false, classes: false, variables: false }],
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-escape': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      '@stylistic/no-whitespace-before-property': 'error', // https://eslint.style/rules/js/no-whitespace-before-property
      'no-with': 'error',
      '@stylistic/object-curly-newline': ['error', { multiline: true, consistent: true }], // https://eslint.style/rules/default/object-curly-newline
      '@stylistic/object-curly-spacing': ['error', 'always'], // https://eslint.style/rules/default/object-curly-spacing
      '@stylistic/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }], // https://eslint.style/rules/default/object-property-newline
      'one-var': ['error', { initialized: 'never' }], // https://eslint.org/docs/latest/rules/one-var
      '@stylistic/operator-linebreak': [
        'error',
        'after',
        { overrides: { '?': 'before', ':': 'before', '|>': 'before' } },
      ], // https://eslint.style/rules/default/operator-linebreak
      '@stylistic/padded-blocks': [
        'error',
        { blocks: 'never', switches: 'never', classes: 'never' },
      ], // https://eslint.style/rules/default/padded-blocks
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-promise-reject-errors': 'error', // https://eslint.org/docs/latest/rules/prefer-promise-reject-errors
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      '@stylistic/quote-props': ['error', 'as-needed'], // https://eslint.style/rules/default/quote-props
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }], // https://eslint.style/rules/default/quotes
      '@stylistic/rest-spread-spacing': ['error', 'never'], // https://eslint.style/rules/default/rest-spread-spacing
      '@stylistic/semi': ['error', 'never'], // https://eslint.style/rules/default/semi
      '@stylistic/semi-spacing': ['error', { before: false, after: true }], // https://eslint.style/rules/default/semi-spacing
      '@stylistic/space-before-blocks': ['error', 'always'], // https://eslint.style/rules/default/space-before-blocks
      '@stylistic/space-before-function-paren': ['error', 'always'], // https://eslint.style/rules/default/space-before-function-paren
      '@stylistic/space-in-parens': ['error', 'never'], // https://eslint.style/rules/default/space-in-parens
      '@stylistic/space-infix-ops': 'error', // https://eslint.style/rules/default/space-infix-ops
      '@stylistic/space-unary-ops': ['error', { words: true, nonwords: false }], // https://eslint.style/rules/default/space-unary-ops
      '@stylistic/spaced-comment': [
        'error',
        'always',
        {
          line: { markers: ['*package', '!', '/', ',', '='] },
          block: {
            balanced: true,
            markers: ['*package', '!', ',', ':', '::', 'flow-include'],
            exceptions: ['*'],
          },
        },
      ], // https://eslint.style/rules/default/spaced-comment
      'symbol-description': 'error',
      '@stylistic/template-curly-spacing': ['error', 'never'], // https://eslint.style/rules/default/template-curly-spacing
      '@stylistic/template-tag-spacing': ['error', 'never'], // https://eslint.style/rules/default/template-tag-spacing
      'unicode-bom': ['error', 'never'],
      'use-isnan': [
        'error',
        {
          enforceForSwitchCase: true,
          enforceForIndexOf: true,
        },
      ],
      'valid-typeof': ['error', { requireStringLiterals: true }],
      '@stylistic/wrap-iife': ['error', 'any', { functionPrototypeMethods: true }], // https://eslint.style/rules/default/wrap-iife
      '@stylistic/yield-star-spacing': ['error', 'both'], // https://eslint.style/rules/default/yield-star-spacing
      yoda: ['error', 'never'], // https://eslint.org/docs/latest/rules/yoda

      '@stylistic/jsx-closing-bracket-location': ['error', 'tag-aligned'], // https://eslint.style/rules/jsx/jsx-closing-bracket-location
      '@stylistic/jsx-closing-tag-location': 'error', // https://eslint.style/rules/jsx/jsx-closing-tag-location
      '@stylistic/jsx-curly-brace-presence': 'error', // https://eslint.style/rules/jsx/jsx-curly-brace-presence
      '@stylistic/jsx-curly-newline': [
        'error',
        {
          multiline: 'consistent',
          singleline: 'consistent',
        },
      ], // https://eslint.style/rules/jsx/jsx-curly-newline
      '@stylistic/jsx-curly-spacing': [
        'error',
        {
          attributes: { when: 'never', allowMultiline: true },
          children: { when: 'never', allowMultiline: true },
        },
      ], // https://eslint.style/rules/jsx/jsx-curly-spacing
      '@stylistic/jsx-equals-spacing': ['error', 'never'], // https://eslint.style/rules/jsx/jsx-equals-spacing
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'], // https://eslint.style/rules/jsx/jsx-first-prop-new-line
      '@stylistic/jsx-indent': ['error', 2], // https://eslint.style/rules/jsx/jsx-indent
      '@stylistic/jsx-indent-props': ['error', 2], // https://eslint.style/rules/jsx/jsx-indent-props
      '@stylistic/jsx-max-props-per-line': [
        'error',
        { when: 'always', maximum: { single: 2, multi: 1 } },
      ], // https://eslint.style/rules/jsx/jsx-max-props-per-line
      '@stylistic/jsx-pascal-case': ['error', { allowAllCaps: false }], // https://eslint.style/rules/jsx/jsx-pascal-case
      '@stylistic/jsx-props-no-multi-spaces': 'error', // https://eslint.style/rules/jsx/jsx-props-no-multi-spaces
      '@stylistic/jsx-self-closing-comp': 'error', // https://eslint.style/rules/jsx/jsx-self-closing-comp
      '@stylistic/jsx-one-expression-per-line': 'error', // https://eslint.style/rules/jsx/jsx-one-expression-per-line
      '@stylistic/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: false,
        },
      ], // https://eslint.style/rules/jsx/jsx-sort-props
      '@stylistic/jsx-tag-spacing': [
        'error',
        {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never',
        },
      ], // https://eslint.style/rules/jsx/jsx-tag-spacing
      '@stylistic/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'ignore',
          condition: 'ignore',
          logical: 'ignore',
          prop: 'ignore',
        },
      ], // https://eslint.style/rules/jsx/jsx-wrap-multilines

      'import/export': 'error',
      'import/first': 'error',
      'import/no-absolute-path': ['error', { esmodule: true, commonjs: true, amd: false }],
      'import/no-duplicates': 'error',
      'import/no-named-default': 'error',
      'import/no-webpack-loader-syntax': 'error',

      'n/handle-callback-err': ['error', '^(err|error)$'],
      'n/no-callback-literal': 'error',
      'n/no-deprecated-api': 'error',
      'n/no-exports-assign': 'error',
      'n/no-new-require': 'error',
      'n/no-path-concat': 'error',
      'n/process-exit-as-throw': 'error',

      'promise/param-names': 'error',
    },
  },
]
