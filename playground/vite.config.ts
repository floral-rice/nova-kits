import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

import { resolve } from 'node:path';
import pluginNovaUI from '@nova-kits/components/vite-plugin';

export default defineConfig({
  plugins: [
    vue(),
    pluginNovaUI(),
  ],

  resolve: {
    alias: {
      '@nova-kits/components': resolve(__dirname, '../packages/components/src'),
      '@playground': resolve(__dirname, 'src'),
    },
  },
});
