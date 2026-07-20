import { resolve } from 'node:path';
import { scanFiles } from './scanner.ts';
import { createChecker } from 'vue-component-meta';

export interface ComponentMeta {
  props: Array<{
    name: string;
    type: string;
    required: boolean;
    default: string;
    description: string;
  }>;
  events: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  slots: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  expose: Array<{
    name: string;
    type: string;
    description: string;
  }>;
}

/**
 * Extract metadata from a Vue component using vue-component-meta.
 */
function extractMeta(filePath: string, root: string): ComponentMeta {
  const checker = createChecker(
    resolve(root, 'tsconfig.json'),
    { forceUseTs: true },
  );

  const meta = checker.getComponentMeta(filePath);

  return {
    props: meta.props.map(p => ({
      name: p.name,
      type: p.type,
      required: p.required,
      default: p.default ?? '',
      description: p.description,
    })),
    events: meta.events.map(e => ({
      name: e.name,
      type: e.type,
      description: e.description,
    })),
    slots: meta.slots.map(s => ({
      name: s.name,
      type: s.type,
      description: s.description,
    })),
    expose: meta.exposed.map(e => ({
      name: e.name,
      type: e.type,
      description: e.description,
    })),
  };
}

/**
 * Generate the virtual:nova-meta module source.
 * Scans all packages for Vue component files and extracts API metadata.
 */
export async function generateMetaModule(root: string, packagesDir: string): Promise<string> {
  const absPackagesDir = resolve(root, packagesDir);
  const files = await scanFiles(absPackagesDir, '*/src/**/*.vue');

  const entries: string[] = [];

  for (const filePath of files) {
    // Skip demo files
    if (filePath.includes('/demos/') || filePath.includes('\\demos\\')) continue;

    const fileName = filePath.split(/[\\/]/).pop() ?? '';
    const componentName = fileName.replace('.vue', '');

    try {
      const meta = extractMeta(filePath, root);
      entries.push(`  "${componentName}": ${JSON.stringify(meta, null, 2)}`);
    } catch {
      // Skip files that can't be parsed
      console.warn(`[nova-plugin] Could not parse: ${filePath}`);
    }
  }

  return `export default {\n${entries.join(',\n')}\n};`;
}
