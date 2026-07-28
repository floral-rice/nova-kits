import type { App } from 'vue';
// 导出components和hooks包，kits作为一个集合包
export * from '@nova-kits/components';
export * from '@nova-kits/hooks';
import '@nova-kits/components/style.css';
import { install as componentsInstall } from '@nova-kits/components';

// BasicLayout
export * from './layouts/BasicLayout';
import { NBasicLayout } from './layouts/BasicLayout';

export function install(app: App) {
  app.component('NBasicLayout', NBasicLayout);
  componentsInstall(app);
}

export default {
  install,
};
