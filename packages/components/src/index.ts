import { App } from 'vue';
export * from 'element-plus';
import ElementPlus from 'element-plus';

export { NLayoutWithSub as NLayout, NLayoutTabs, NLayoutPortal, useTabFocus } from './Layout/index';

import { NLayoutWithSub as NLayout, NLayoutTabs, NLayoutPortal } from './Layout/index';

export function install(app: App) {
  app.component('NLayout', NLayout);
  app.component('NLayoutTabs', NLayoutTabs);
  app.component('NLayoutPortal', NLayoutPortal);
  app.use(ElementPlus);
}

export default {
  install,
};
