module.exports = {
  // automatically extends root eslint-config (which extends @shiftcode/eslint-config for TS)
  extends: ['@shiftcode/eslint-config-recommended/ng-config'],
  ignorePatterns: ["src/assets/**/*"],
  overrides: [
    {
      plugins: ['@shiftcode/rules'],
      files: ['*.ts'],
      rules: {
        'import/no-internal-modules': ['error', { allow: ['rxjs/*', '@angular/**/*'] }],
        '@typescript-eslint/member-ordering': 'off',
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: ['pl', 'ch', 'sc'],
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: ['pl', 'ch', 'sc'],
            style: 'kebab-case',
          },
        ],
      },
    },
    {
      files: ['*.html'],
      rules: {
        // could potentially make sense to activate that rule, but we never had it also with tslint
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
      './tsconfig.json',
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
