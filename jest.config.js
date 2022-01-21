const { pathsToModuleNameMapper } = require('ts-jest/utils')
const tsconfig = require('./tsconfig')

function getModuleNameMapper() {
  const libPathEntries = Object.entries(tsconfig.compilerOptions.paths)

  const valid = libPathEntries.every(([_, v]) => Array.isArray(v) && v.length === 2)
  if (!valid) {
    console.error('all paths in tsconfig.json have to contain 2 entries (1st: dist, 2nd: public-api.ts)')
  }
  const singleEntries = libPathEntries.reduce((u, [k, v]) => ({ ...u, [k]: [v[1]] }), {})
  return pathsToModuleNameMapper(singleEntries, { prefix: '<rootDir>../../' })
}

const moduleNameMapper = getModuleNameMapper()
console.table(Object.entries(moduleNameMapper))

module.exports = {
  preset: 'jest-preset-angular',
  passWithNoTests: true,
  transformIgnorePatterns: [
    '<rootDir>/(node_modules)/',
  ],
  projects: [
    '<rootDir>/libs/core',
    '<rootDir>/libs/components',
    '<rootDir>/libs/aws',
    '<rootDir>/libs/ssr',
  ],
  moduleNameMapper,
}
