import { readFileSync, writeFileSync } from 'fs'

class CausedError extends Error {
  constructor(
    message: string,
    readonly cause: unknown,
  ) {
    super(message)
  }
}

interface Package {
  name: string
  version: string
}

interface NgPackage {
  dest: string
  lib: {
    entryFile: string
  }
}

const ENCODING_UTF8 = 'utf8'

async function bumbVersion() {
  let packageJson: Package
  let ngPackage: NgPackage
  let distPackageJson: Package

  try {
    packageJson = JSON.parse(readFileSync('./package.json', ENCODING_UTF8))
  } catch (err) {
    throw new CausedError(`could not read package.json`, err)
  }

  try {
    ngPackage = JSON.parse(readFileSync('./ng-package.json', ENCODING_UTF8))
  } catch (err) {
    throw new CausedError(`could not read ng-package.json`, err)
  }

  if (!ngPackage.dest) {
    throw new Error('output `dest` not defined in ng-package.json')
  }

  const distPackageFile = `${ngPackage.dest}/package.json`

  try {
    distPackageJson = JSON.parse(readFileSync(distPackageFile, ENCODING_UTF8))
  } catch (err) {
    throw new CausedError(`could not read ${distPackageFile}`, err)
  }

  console.info(`${packageJson.name}: version ${packageJson.version} / dist version ${distPackageJson.version}`)

  // write new dist package.json - if necessary
  // update version
  distPackageJson.version = packageJson.version
  try {
    const prettyPackage = JSON.stringify(distPackageJson, null, 2)
    writeFileSync(distPackageFile, prettyPackage, { encoding: ENCODING_UTF8 })
    console.info(
      `successfully updated version for package ${packageJson.name} in ${distPackageFile} to ${packageJson.version}`,
    )
  } catch (err) {
    throw new CausedError(`could update version in ${distPackageFile}`, err)
  }
}

try {
  console.info('bumbVersion() :: start')
  bumbVersion()
} catch (err) {
  console.error(err)
} finally {
  console.info('bumbVersion() :: end')
}
