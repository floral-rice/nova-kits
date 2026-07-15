
import { defineConfig } from 'vitepress';
import pluginNovaUI from '@nova-kits/components/vite-plugin';

export default defineConfig({
  title: 'Nova UI',
  description: 'Nova UI Components',

  vite: {
    plugins: [pluginNovaUI()],
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/Popup' },
      { text: 'Playground', link: 'http://localhost:5173' },
    ],

    sidebar: [
      {
        text: '指南',
        items: [{ text: '开始使用', link: '/guide/getting-started' }],
      },
      {
        text: '组件',
        items: [{ text: 'Popup', link: '/components/Popup' }],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
  },
});

