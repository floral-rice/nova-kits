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
          const varPath = resolve(__dirname, '../components/src/styles/_variables').replace(/\\/g, '/');
          return `@use "${varPath}" as *;\n${source}`;
        },
      },
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NovaKitsBasicLayout',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'umd'}.${format === 'es' ? 'js' : 'cjs'}`,
    },

    rollupOptions: {
      external: ['vue', 'vue-router', '@nova-kits/components', '@nova-kits/hooks'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          '@nova-kits/components': 'NovaKitsComponents',
          '@nova-kits/hooks': 'NovaKitsHooks',
        },
      },
    },
  },
});
