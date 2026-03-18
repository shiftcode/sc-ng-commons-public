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
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'property',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
          filter: {
            regex: '^Content-Type$|^@type$|^@context$',
            match: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      'no-undef': 'off',
    },
  },
)
