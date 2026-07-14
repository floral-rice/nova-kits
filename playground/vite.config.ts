import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@nova-ui/components': resolve(__dirname, '../packages/components/src'),
      // '@nova-ui/theme': resolve(__dirname, '../packages/theme/src'),
    },
  },
});
