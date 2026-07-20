import { resolve, dirname } from 'node:path';
import { getDemoId } from './demos.ts';

/**
 * Transform <demo src="..."/> tags in markdown to NovaDemo components.
 *
 * <demo src="./demo/basic.vue"/> → <NovaDemo demoKey="button/basic" />
 */
export function transformDemoTags(code: string, id: string, docsDir: string): string {
  // Only process .md files
  if (!id.endsWith('.md')) return code;

  const demoTagRegex = /<demo\s+src="([^"]+)"\s*\/>/g;

  return code.replace(demoTagRegex, (match, src) => {
    // Resolve relative path from the markdown file
    const mdDir = dirname(id);
    const absDemoPath = resolve(mdDir, src).replace(/\\/g, '/');

    // Get demo key from absolute path
    const absDocsDir = resolve(docsDir).replace(/\\/g, '/');
    const demoId = getDemoId(absDemoPath, absDocsDir);

    if (!demoId) {
      console.warn(`[nova-plugin] Could not resolve demo key for: ${src} in ${id}`);
      return match;
    }

    console.log(`[nova-plugin] Transforming demo: ${src} -> ${demoId}`);
    return `<NovaDemo demoKey="${demoId}" />`;
  });
}
