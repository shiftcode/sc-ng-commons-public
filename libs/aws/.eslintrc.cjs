module.exports = {
    // automatically extends root eslint-config (which extends @shiftcode/eslint-config-recommended for TS)
    extends: ['@shiftcode/eslint-config-recommended/ng-config'],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'import/no-internal-modules': ['error', { allow: ['aws-cdk-lib/*', '@shiftcode/iac-helper/*', 'rxjs/operators'] }],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'property',
            format: ['camelCase', 'UPPER_CASE'],
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
