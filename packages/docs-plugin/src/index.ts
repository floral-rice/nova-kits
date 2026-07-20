import type { Plugin } from 'vite';
import { generateComponentsModule } from './components.ts';
import { generateDemosModule } from './demos.ts';
import { generateMetaModule } from './meta.ts';
import { watchFiles } from './scanner.ts';
import { resolve } from 'node:path';

export { generateSidebar } from './sidebar.ts';

export interface NovaPluginOptions {
  root: string;
  packagesDir?: string;
  docsDir?: string;
}

export default function createNovaPlugin(options: NovaPluginOptions): Plugin {
  const { root, packagesDir = 'packages', docsDir = 'docs' } = options;
  let componentsModule: string | null = null;
  let demosModule: string | null = null;
  let metaModule: string | null = null;

  return {
    name: 'vite-plugin-nova',

    async buildStart() {
      componentsModule = await generateComponentsModule(root, packagesDir, docsDir);
      demosModule = await generateDemosModule(root, docsDir);
      metaModule = await generateMetaModule(root, packagesDir);
    },

    resolveId(id) {
      if (id === 'virtual:nova-demos') return '\0virtual:nova-demos';
      if (id === 'virtual:nova-meta') return '\0virtual:nova-meta';
      if (id === 'virtual:nova-components') return '\0virtual:nova-components';
      return null;
    },

    load(id) {
      if (id === '\0virtual:nova-demos') return demosModule;
      if (id === '\0virtual:nova-meta') return metaModule;
      if (id === '\0virtual:nova-components') return componentsModule;
      return null;
    },

    configureServer(server) {
      const absDocsDir = resolve(root, docsDir);
      watchFiles(absDocsDir, '**/demo/*.vue', async () => {
        demosModule = await generateDemosModule(root, docsDir);
        const mod = server.moduleGraph.getModuleById('\0virtual:nova-demos');
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.hot.send({ type: 'full-reload' });
        }
      });
    },
  };
}
