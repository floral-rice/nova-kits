import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NovaKits',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'umd'}.${format === 'es' ? 'js' : 'cjs'}`,
    },

    rollupOptions: {
      external: ['vue', 'lodash-es'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
