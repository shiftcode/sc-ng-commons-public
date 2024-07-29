module.exports = {
  // automatically extends root eslint-config (which extends @shiftcode/eslint-config-recommended for TS)
  extends: ['@shiftcode/eslint-config-recommended/ng-config'],
  ignorePatterns: ["src/assets/**/*"],
  overrides: [
    {
      plugins: ['@shiftcode/rules'],
      files: ['*.ts'],
      rules: {
        'import/no-internal-modules': ['error', { allow: ['rxjs/*', '@angular/**/*'] }],
        '@typescript-eslint/member-ordering': 'off',
        /*
         * from tslint
  no-submodule-imports:
    - true
    - "app"
    - aws-sdk
    - "@angular"
    - "zone.js"
    - "aws-sdk/clients"
    - "date-fns/esm/locale"
    - "@apollo/client"
         */
        '@shiftcode/rules/import-denylist': [ // TSLint: "import-blacklist"
          'error', {
            patterns: [
              /\.\/(models|static|core|shared)\/.*/, // use app/* instead
            ],
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: ['ch', 'sc'],
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: ['ch', 'sc'],
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
