import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue() as any],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (source: string, filePath: string) => {
          if (filePath.includes('node_modules')) return source;
          const varPath = resolve(__dirname, 'src/_variables').replace(/\\/g, '/');
          return `@use "${varPath}" as *;\n${source}`;
        },
      },
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NovaKits',
      fileName: 'nova-kits',
    },

    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
