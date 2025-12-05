// eslint-disable-next-line import/no-internal-modules
import { defineScAngularConfig } from '@shiftcode/eslint-config-recommended/angular'

export default defineScAngularConfig(
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.lib.json', './tsconfig.spec.json'],
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/member-ordering': ['off'],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'sc', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'sc', style: 'camelCase' }],
      '@angular-eslint/no-pipe-impure': 'error',
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
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
