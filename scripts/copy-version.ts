/**
 * Syncs the version from root package.json to the dist/package.json.
 *
 * Reads the root package.json, ng-package.json (to find the dist output directory),
 * and the built dist package.json, then updates the dist version to match the root version.
 * This ensures published packages have the correct version before release.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Minimal package.json structure */
interface Package {
  name: string
  version: string
}

/** Minimal ng-package.json structure */
interface NgPackage {
  dest: string
  lib: {
    entryFile: string
  }
}

const ENCODING_UTF8 = 'utf8'

/**
 * Reads and parses a JSON file.
 * @param filePath - Path to the file to read
 * @returns Parsed JSON object
 * @throws {Error} If the file cannot be read or parsed
 */
async function readPackageJson<T>(filePath: string): Promise<T> {
  try {
    const content = await readFile(filePath, ENCODING_UTF8)
    return JSON.parse(content) as T
  } catch (err) {
    throw new Error(`could not read ${filePath}`, { cause: err })
  }
}

/**
 * Syncs the version from root package.json to the distribution package.json.
 * @throws {Error} If any required file cannot be read or written.
 */
async function copyVersion() {
  const packageJsonPath = join(process.cwd(), 'package.json')
  const ngPackagePath = join(process.cwd(), 'ng-package.json')

  const packageJson = await readPackageJson<Package>(packageJsonPath)
  const ngPackage = await readPackageJson<NgPackage>(ngPackagePath)

  if (!ngPackage.dest) {
    throw new Error(`output \`dest\` not defined in ${ngPackagePath}`)
  }

  const distPackageFile = join(ngPackage.dest, 'package.json')
  const distPackageJson = await readPackageJson<Package>(distPackageFile)

  console.info(`${packageJson.name}: version ${packageJson.version} / dist version ${distPackageJson.version}`)

  // write new dist package.json - if necessary
  // update version
  distPackageJson.version = packageJson.version
  try {
    const prettyPackage = JSON.stringify(distPackageJson, null, 2)
    await writeFile(distPackageFile, prettyPackage, { encoding: ENCODING_UTF8 })
    console.info(
      `successfully updated version for package ${packageJson.name} in ${distPackageFile} to ${packageJson.version}`,
    )
  } catch (err) {
    throw new Error(`could not update version in ${distPackageFile}`, { cause: err })
  }
}

try {
  console.info('copyVersion() :: start')
  await copyVersion()
} catch (err) {
  console.error(err)
} finally {
  console.info('copyVersion() :: end')
}
