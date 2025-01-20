module.exports = {
  // automatically extends root eslint-config (which extends @shiftcode/eslint-config-recommended for TS)
  extends: ['@shiftcode/eslint-config-recommended/ng-config'],
  ignorePatterns: ['src/assets/**/*'],
  overrides: [
    {
      plugins: ['@shiftcode/rules'],
      files: ['*.ts'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { packageDir: '../..' }],
        'import/no-internal-modules': [
          'error',
          {
            allow: ['rxjs/*'],
          },
        ],
      },
    },
  ],
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
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
