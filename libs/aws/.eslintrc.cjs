module.exports = {
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'import/no-internal-modules': ['error', { allow: ['aws-cdk-lib/*', '@shiftcode/iac-helper/*'] }],
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
