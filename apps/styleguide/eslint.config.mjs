// eslint-disable-next-line import/no-internal-modules
import { defineScAngularConfig } from '@shiftcode/eslint-config-recommended/angular'

export default defineScAngularConfig(
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.lint.json'],
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { packageDir: '../..' }],

      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'sg', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'sg', style: 'camelCase' }],
      '@angular-eslint/no-pipe-impure': 'error',
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/use-component-selector': 'error',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      'no-undef': 'off',
    },
  },
)
