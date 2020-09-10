// const { strictEslint } = require('@umijs/fabric');

module.exports = {
  extends: [
    'eslint-config-airbnb',
    'eslint-config-airbnb-typescript',
    'eslint-config-prettier',
    'eslint-config-prettier/react',
    'eslint-config-prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-comments', 'jest', 'unicorn', 'react-hooks'],
  env: {
    browser: true,
    es6: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/sort-comp': 1,
    'react/jsx-one-expression-per-line': 0,
    'generator-star-spacing': 0,
    'function-paren-newline': 0,
    'import/no-unresolved': [
      2,
      {
        ignore: ['^@/', '^@@/', '^@alipay/bigfish/'],
        caseSensitive: true,
        commonjs: true,
      },
    ],
    'import/order': 'warn',
    'react/jsx-props-no-spreading': 0,
    'react/state-in-constructor': 0,
    'react/static-property-placement': 0,
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: [
          '**/tests/**.{ts,js,jsx,tsx}',
          '**/_test_/**.{ts,js,jsx,tsx}',
          '/mock/**/**.{ts,js,jsx,tsx}',
          '**/**.test.{ts,js,jsx,tsx}',
          '**/_mock.{ts,js,jsx,tsx}',
          '**/example/**.{ts,js,jsx,tsx}',
          '**/examples/**.{ts,js,jsx,tsx}',
        ],
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'linebreak-style': 0,
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': [0, 'camel-case'],
    // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': 'off',
    'sort-imports': 0,
    // Use function hoisting to improve code readability
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    // Makes no sense to allow type inferrence for expression parameters, but require typing the response
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'off',
      { allowTypedFunctionExpressions: true },
    ],
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-var-requires': 0,
    // Common abbreviations are known and readable
    'unicorn/prevent-abbreviations': 'off',
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'import/no-cycle': 0,
    'react/no-array-index-key': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    // issue https://github.com/facebook/react/issues/15204
    'react-hooks/exhaustive-deps': 'off',
    // Conflict with prettier
    'arrow-body-style': 0,
    'arrow-parens': 0,
    'object-curly-newline': 0,
    'implicit-arrow-linebreak': 0,
    'operator-linebreak': 0,
    'eslint-comments/no-unlimited-disable': 0,
    'no-param-reassign': 2,
    'space-before-function-paren': 0,
    'import/extensions': 0,
    'import/no-named-as-default': 0,
    'prefer-promise-reject-errors': 0,
    '@typescript-eslint/no-explicit-any': 2,
    '@typescript-eslint/naming-convention': [
      'error',
      /* Variable-like */
      {
        selector: 'variable',
        format: ['strictCamelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'variable',
        types: ['function'],
        format: ['strictCamelCase', 'PascalCase'],
      },
      {
        selector: 'function',
        format: ['strictCamelCase', 'PascalCase'],
      },
      {
        selector: 'parameter',
        format: ['strictCamelCase'],
        trailingUnderscore: 'allow',
        leadingUnderscore: 'allow',
      },
      /* Member-like */
      {
        selector: 'enumMember',
        format: ['PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'parameterProperty',
        format: ['strictCamelCase'],
      },
      {
        selector: 'property',
        format: ['strictCamelCase', 'UPPER_CASE', 'PascalCase'],
        filter: {
          regex: '(zh-CN|en-US)',
          match: false,
        },
      },
      {
        selector: 'property',
        format: ['strictCamelCase', 'PascalCase'],
        types: ['function'],
      },
      {
        selector: 'method',
        format: ['strictCamelCase'],
      },
      /* Type-like */
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
    'no-global-assign': 2,
  },
  globals: {
    __DEV__: 'readonly',
    $$BUILD_INFO: 'readonly',
  },
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
    project: './tsconfig.eslint.json',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        // "alwaysTryTypes": true // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
    polyfills: ['fetch', 'Promise', 'URL', 'object-assign'],
  },
};
