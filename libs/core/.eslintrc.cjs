module.exports = {
  // automatically extends root eslint-config (which extends @shiftcode/eslint-config-recommended for TS)
  extends: ['@shiftcode/eslint-config-recommended/ng-config'],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'import/no-internal-modules': ['error', { allow: ['rxjs/*', '@angular/**/*'] }],
        // // could potentially make sense to activate that rule, but we never had it also with tslint
        // '@angular-eslint/template/no-negated-async': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'property',
            format: ['camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow'
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
      }
    },
    {
      files: ['*.html'],
      rules: {
        // could potentially make sense to activate that rule, but we never had it also with tslint
        '@angular-eslint/template/no-negated-async': 'off',
      },
    },
  ],
  parserOptions: {
    project: [
      './tsconfig.lib.json',
      './tsconfig.spec.json',
    ],
  },
}
