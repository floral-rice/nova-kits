import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { scanFiles } from './scanner.ts';

/**
 * Convert a demo file path to a demo key like "button/basic" or "use-request/basic".
 * Path: docs/zh/components/button/demo/basic.vue → button/basic
 * Path: docs/zh/hooks/use-request/demo/basic.vue → use-request/basic
 */
export function getDemoId(filePath: string, docsDir: string): string {
  const rel = relative(docsDir, filePath).replace(/\\/g, '/');
  // Match pattern: zh/components/{component}/demo/{name}.vue
  const componentMatch = rel.match(/components\/([^/]+)\/demo\/([^/]+)\.vue$/);
  if (componentMatch) return `${componentMatch[1]}/${componentMatch[2]}`;
  // Match pattern: zh/hooks/{hook}/demo/{name}.vue
  const hookMatch = rel.match(/hooks\/([^/]+)\/demo\/([^/]+)\.vue$/);
  if (hookMatch) return `hooks/${hookMatch[1]}/${hookMatch[2]}`;
  return '';
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
    const isVue = filePath.endsWith('.vue');

    if (isVue) {
      entries.push(
        `  "${demoId}": {
    component: () => import("${absPath}"),
    source: \`${escapedSource}\`
  }`,
      );
    } else {
      // TypeScript files - source only, no component
      entries.push(
        `  "${demoId}": {
    source: \`${escapedSource}\`
  }`,
      );
    }
  }

  return `export default {\n${entries.join(',\n')}\n};`;
}
