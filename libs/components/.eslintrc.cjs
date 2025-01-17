module.exports = {
  // automatically extends root eslint-config (which extends @shiftcode/eslint-config-recommended for TS)
  extends: ['@shiftcode/eslint-config-recommended/ng-config'],
  overrides: [
    {
      plugins: ['@shiftcode/rules'],
      files: ['*.ts'],
      rules: {
        'import/no-internal-modules': ['error', { allow: ['rxjs/operators'] }],
      },
    },
  ],

  parserOptions: {
    project: [
      "./tsconfig.lib.json",
      "./tsconfig.spec.json"
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
