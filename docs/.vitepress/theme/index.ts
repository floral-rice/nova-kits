
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { createRouter, createMemoryHistory } from 'vue-router';
import NovaDemo from '@nova-kits/docs-plugin/src/vue-components/NovaDemo.vue';
import NovaApiDoc from '@nova-kits/docs-plugin/src/vue-components/NovaApiDoc.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { render: () => null } },
    { path: '/dashboard', component: { render: () => null }, meta: { title: '仪表盘' } },
    { path: '/users', component: { render: () => null }, meta: { title: '用户管理' } },
    { path: '/settings', component: { render: () => null }, meta: { title: '系统设置' } },
  ],
});

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(router);
    app.component('NovaDemo', NovaDemo);
    app.component('NovaApiDoc', NovaApiDoc);
  },
} satisfies Theme;
