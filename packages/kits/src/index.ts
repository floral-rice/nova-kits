import { App } from 'vue';
export * from '@nova-kits/components';
export * from '@nova-kits/hooks';

// BasicLayout 组件
export { default as NBasicLayout } from './layouts/BasicLayout/BasicLayout.vue';

// Composables
export { default as useAuth } from './layouts/BasicLayout/composables/useAuth';
export { default as useTabs } from './layouts/BasicLayout/composables/useTabs';
export { default as useMenuFilter } from './layouts/BasicLayout/composables/useMenuFilter';

// 类型
export type { MenuItem, TabItem, BasicLayoutProps } from './layouts/BasicLayout/typings';

import { default as NBasicLayout } from './layouts/BasicLayout/BasicLayout.vue';
import { install as componentsInstall } from '@nova-kits/components';

export function install(app: App) {
  app.component('NBasicLayout', NBasicLayout);
  componentsInstall(app);
}

export default {
  install,
};
