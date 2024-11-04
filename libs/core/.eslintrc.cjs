module.exports = {
  // automatically extends root eslint-config (which extends @shiftcode/eslint-config-recommended for TS)
  extends: ['@shiftcode/eslint-config-recommended/ng-config'],
  overrides: [
    {
      plugins: ['@shiftcode/rules'],
      files: ['*.ts'],
      rules: {
        'import/no-internal-modules': ['error', { allow: ['rxjs/*', '@angular/**/*'] }],
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
        '@shiftcode/rules/import-denylist': [
          'error', {
            patterns: [
              /\.\/(models|static|core|shared)\/.*/,
              /src\/.*/,
            ],
          },
        ],
      }
    },
    {
      files: ['*.html'],
      rules: {
        '@angular-eslint/template/no-negated-async': 'off',
      },
    },
    {
      files: ['*.js', '*.mjs', '*.cjs'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
  parserOptions: {
    project: [
      './tsconfig.lib.json',
      './tsconfig.spec.json',
    ],
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
    env: {
      browser: true,
      node: true,
      es6: true,
    },
  },
}
