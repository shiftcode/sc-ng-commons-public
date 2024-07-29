/*
 * Base configuration for es-linting an angular project.
 *
 * Note that rules that need project-specific configuration (i.e. @angular-eslint/component-selector) must
 * be configured within the consuming project itself.
 */
module.exports = {
  overrides: [
    {
      files: ['*.ts', '*.cts', '*.mts', '*.tsx'],
      extends: ['plugin:@angular-eslint/recommended', 'plugin:@angular-eslint/template/process-inline-templates'],
      rules: {
        '@shiftcode/rules/import-denylist': [
          // TSLint: "import-blacklist"
          'error',
          {
            patterns: [
              /\.\/(core|models|shared|static)\/.*/, // use app/* instead
            ],
          },
        ],

        /*
         * We frequently apply classes (within some conditions, i.e. key-values.component)
         * via component host property.
         * Angular styleguide, in comparison, recommends to apply classes/attributes via @HostListener or @HostBinding:
         *   https://angular.io/guide/styleguide#style-06-03
         */
        '@angular-eslint/no-host-metadata-property': 'off',
      },
    },
    {
      files: ['*.html'],
      extends: [
        'plugin:@angular-eslint/template/recommended',
        'prettier', // disable rules that will be auto fixed by prettier
      ],
      rules: {},
    },
  ],
}
