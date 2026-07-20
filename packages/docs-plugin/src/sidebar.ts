import { readFile } from 'node:fs/promises';
import { scanFiles } from './scanner.ts';
import { resolve } from 'node:path';

interface SidebarItem {
  text: string;
  link: string;
}

interface SidebarGroup {
  text: string;
  collapsed: boolean;
  items: SidebarItem[];
}

interface ComponentMeta {
  name: string;
  title: string;
  description: string;
  category: string;
}

/**
 * Generate VitePress sidebar config from meta.json files.
 * Groups components by category, ordered alphabetically.
 */
export async function generateSidebar(root: string, docsDir: string): Promise<SidebarGroup[]> {
  const absDocsDir = resolve(root, docsDir);
  const metaFiles = await scanFiles(absDocsDir, '*/components/*/meta.json');

  const categoryMap = new Map<string, SidebarItem[]>();

  for (const metaFile of metaFiles) {
    try {
      const content = await readFile(metaFile, 'utf-8');
      const meta: ComponentMeta = JSON.parse(content);

      // Extract path: zh/components/button/meta.json → /zh/components/button/
      const parts = metaFile.replace(/\\/g, '/').split('/');
      const zhIdx = parts.indexOf('zh');
      if (zhIdx === -1) continue;
      const componentDir = parts.slice(zhIdx, -1).join('/');
      const link = `/${componentDir}/`;

      const category = meta.category || '其他';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }

      categoryMap.get(category)!.push({
        text: meta.title,
        link,
      });
    } catch {
      console.warn(`[nova-plugin] Could not read meta: ${metaFile}`);
    }
  }

  // Sort categories alphabetically, sort items within each category
  const sortedCategories = [...categoryMap.keys()].sort();
  const sidebar: SidebarGroup[] = [];

  for (const category of sortedCategories) {
    const items = categoryMap.get(category)!.sort((a, b) => a.text.localeCompare(b.text, 'zh'));
    sidebar.push({
      text: category,
      collapsed: false,
      items,
    });
  }

  return sidebar;
}
