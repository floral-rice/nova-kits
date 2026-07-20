import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { scanFiles } from './scanner.ts';

/**
 * Normalize directory name for case-insensitive, hyphen-agnostic matching.
 * e.g., "BasicLayout" → "basiclayout", "basic-layout" → "basiclayout"
 */
function normalizeDirName(name: string): string {
  return name.toLowerCase().replace(/-/g, '');
}

/**
 * Read meta.json files to get component names.
 * Returns map of normalized directory name → component name (e.g., "button" → "NButton").
 */
async function readComponentNames(docsDir: string): Promise<Map<string, string>> {
  const metaFiles = await scanFiles(docsDir, '*/components/*/meta.json');
  const nameMap = new Map<string, string>();

  for (const metaFile of metaFiles) {
    try {
      const content = await readFile(metaFile, 'utf-8');
      const meta = JSON.parse(content);
      // Extract directory name from path: zh/components/button/meta.json → button
      const dirName = metaFile.split(/[\\/]/).slice(-2, -1)[0];
      if (meta.name && dirName) {
        nameMap.set(normalizeDirName(dirName), meta.name);
      }
    } catch {
      console.warn(`[nova-plugin] Could not read meta: ${metaFile}`);
    }
  }

  return nameMap;
}

/**
 * Generate the virtual:nova-components module source.
 * Scans multiple packages for component directories.
 * Returns a map of component name → dynamic import function.
 */
export async function generateComponentsModule(
  root: string,
  packagesDir: string,
  docsDir: string,
): Promise<string> {
  const absPackagesDir = resolve(root, packagesDir);
  const absDocsDir = resolve(root, docsDir);

  // Find all index.ts files in all packages
  const indexFiles = await scanFiles(absPackagesDir, '*/src/*/index.ts');
  const nameMap = await readComponentNames(absDocsDir);

  const entries: string[] = [];

  for (const indexPath of indexFiles) {
    // Extract directory name: packages/components/src/button/index.ts → button
    const dirName = indexPath.split(/[\\/]/).slice(-2, -1)[0];
    if (!dirName) continue;

    const componentName = nameMap.get(normalizeDirName(dirName));
    if (!componentName) {
      console.warn(`[nova-plugin] No meta.json name for component dir: ${dirName}`);
      continue;
    }

    const absPath = indexPath.replace(/\\/g, '/').replace(/^\//, '');
    entries.push(`  "${componentName}": () => import("/@fs/${absPath}")`);
  }

  return `export default {\n${entries.join(',\n')}\n};`;
}
