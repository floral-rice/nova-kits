import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue() as any],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NovaKits',
      fileName: format =>
        `index.${format === 'es' ? 'esm' : 'umd'}.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'style',
    },

    rollupOptions: {
      // 只外部化 vue、vue-router
      // components 和 hooks 由 kits 打包
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
        },
      },
    },
  },
});
