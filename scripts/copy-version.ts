/**
 * Syncs the version from root package.json to the dist/package.json.
 *
 * Reads the library's package.json, the workspace angular.json (to find the library's output directory),
 * and the built dist package.json, then updates the dist version to match the library version.
 * This ensures published packages have the correct version before release.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'

/** Minimal package.json structure */
interface Package {
  name: string
  version: string
}

/** Minimal angular.json structure */
interface AngularWorkspace {
  projects: Record<string, { root: string; architect?: { build?: { options?: { outputPath?: string } } } }>
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
  // script is executed via lerna in the library folder, angular.json lives in the workspace root
  const workspaceRoot = resolve(import.meta.dirname, '..')
  const angularJsonPath = join(workspaceRoot, 'angular.json')

  const packageJson = await readPackageJson<Package>(packageJsonPath)
  const angularJson = await readPackageJson<AngularWorkspace>(angularJsonPath)

  const projectRoot = relative(workspaceRoot, process.cwd())
  const project = Object.values(angularJson.projects).find((p) => p.root === projectRoot)
  const outputPath = project?.architect?.build?.options?.outputPath

  if (!outputPath) {
    throw new Error(`build \`outputPath\` not defined for project with root ${projectRoot} in ${angularJsonPath}`)
  }

  const distPackageFile = join(workspaceRoot, outputPath, 'package.json')
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
