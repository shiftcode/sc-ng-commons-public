module.exports = {
    // automatically extends root eslint-config (which extends @shiftcode/eslint-config-recommended for TS)
    extends: ['@shiftcode/eslint-config-recommended/ng-config'],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'import/no-internal-modules': ['error', { allow: ['rxjs/operators'] }],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: ['classProperty'],
            modifiers: ['static'],
            format: ['UPPER_CASE'],
          },
        ],
      },
    },
  ],

  parserOptions: {
    project: [
      "./tsconfig.lib.json",
      "./tsconfig.spec.json"
    ]
  }
}
