import type MarkdownIt from 'markdown-it';
import { resolve, dirname } from 'node:path';
import { getDemoId } from './demos.ts';

/**
 * markdown-it plugin to transform <demo src="..."/> tags to NovaDemo components.
 */
export function demoPlugin(md: MarkdownIt, options: { docsDir: string }) {
  const { docsDir } = options;

  // Store the original renderer for html_block
  const defaultRender = md.renderer.rules.html_block || ((tokens, idx, options, env, self) => {
    return self.renderToken(tokens, idx, options);
  });

  md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const content = token.content;

    console.log('[nova-plugin] Processing html_block:', content.substring(0, 100));

    // Check if this is a demo tag
    const demoMatch = content.match(/<demo\s+src="([^"]+)"\s*\/>/);
    if (demoMatch) {
      const src = demoMatch[1];
      const mdFile = env.path || '';
      const mdDir = dirname(mdFile);
      const absDemoPath = resolve(mdDir, src).replace(/\\/g, '/');
      const absDocsDir = resolve(docsDir).replace(/\\/g, '/');
      const demoId = getDemoId(absDemoPath, absDocsDir);

      console.log('[nova-plugin] Found demo tag:', src, '-> demoId:', demoId);

      if (demoId) {
        return `<NovaDemo demoKey="${demoId}" />\n`;
      }
    }

    return defaultRender(tokens, idx, options, env, self);
  };
}
