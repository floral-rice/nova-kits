import { defineConfig } from 'vitepress';
import createNovaPlugin from '@nova-kits/docs-plugin';
import { generateSidebar } from '@nova-kits/docs-plugin';
import { resolve, dirname, relative } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const absDocsDir = resolve(root, 'docs');

function transformDemoTag(content: string, envPath: string): string {
  return content.replace(
    /<demo\s+src="([^"]+)"\s*\/>/g,
    (_match: string, src: string) => {
      const mdDir = dirname(envPath);
      const demoName = src.replace('./demo/', '').replace('.vue', '');
      const relPath = relative(absDocsDir, mdDir).replace(/\\/g, '/');
      const pathMatch = relPath.match(/components\/([^/]+)$/);

      if (pathMatch) {
        const demoKey = `${pathMatch[1]}/${demoName}`;
        return `<NovaDemo demoKey="${demoKey}" />`;
      }
      return _match;
    },
  );
}

export default defineConfig({
  title: 'Nova Kits',
  description: 'Nova Kits 组件库',

  srcExclude: ['superpowers/**'],

  vite: {
    plugins: [createNovaPlugin({ root })],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (source: string, filePath: string) => {
            if (filePath.includes('node_modules')) return source;
            const varPath = resolve(root, 'packages/components/src/_variables').replace(/\\/g, '/');
            return `@use "${varPath}" as *;\n${source}`;
          },
        },
      },
    },
  },

  markdown: {
    config: (md) => {
      // Handle html_block tokens (demo on its own line with blank lines around it)
      const defaultHtmlBlock =
        md.renderer.rules.html_block ||
        ((tokens, idx, options, _env, self) =>
          self.renderToken(tokens, idx, options));

      md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        if (token.content.includes('<demo ')) {
          token.content = transformDemoTag(token.content, env.path);
        }
        return defaultHtmlBlock(tokens, idx, options, env, self);
      };

      // Handle html_inline tokens (demo inside a paragraph)
      const defaultHtmlInline =
        md.renderer.rules.html_inline ||
        ((tokens, idx, options, _env, self) =>
          self.renderToken(tokens, idx, options));

      md.renderer.rules.html_inline = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        if (token.content.includes('<demo ')) {
          token.content = transformDemoTag(token.content, env.path);
        }
        return defaultHtmlInline(tokens, idx, options, env, self);
      };
    },
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/zh/components/button/' },
    ],

    sidebar: {
      '/zh/components/': await generateSidebar(root, 'docs'),
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
  },
});
