import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { scanFiles } from './scanner.ts';

/**
 * Convert a demo file path to a demo key like "button/basic".
 * Path: docs/zh/components/button/demo/basic.vue → button/basic
 */
export function getDemoId(filePath: string, docsDir: string): string {
  const rel = relative(docsDir, filePath).replace(/\\/g, '/');
  // Match pattern: zh/components/{component}/demo/{name}.vue
  const match = rel.match(/components\/([^/]+)\/demo\/([^/]+)\.vue$/);
  if (!match) return '';
  return `${match[1]}/${match[2]}`;
}

/**
 * Escape a string for safe embedding in a JS template literal.
 */
function escapeForJs(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

/**
 * Generate the virtual:nova-demos module source.
 * Scans docs demo vue files and returns a map of demo key to { component, source }.
 */
export async function generateDemosModule(root: string, docsDir: string): Promise<string> {
  const absDocsDir = resolve(root, docsDir);
  const files = await scanFiles(absDocsDir, '**/demo/*.vue');

  const entries: string[] = [];

  for (const filePath of files) {
    const demoId = getDemoId(filePath, absDocsDir);
    if (!demoId) continue;

    const source = await readFile(filePath, 'utf-8');
    const escapedSource = escapeForJs(source);
    const absPath = filePath.replace(/\\/g, '/');

    entries.push(
      `  "${demoId}": {
    component: () => import("${absPath}"),
    source: \`${escapedSource}\`
  }`,
    );
  }

  return `export default {\n${entries.join(',\n')}\n};`;
}
