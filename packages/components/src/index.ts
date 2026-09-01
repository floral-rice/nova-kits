import { App } from 'vue';
export * from 'element-plus';
import 'element-plus/dist/index.css';
import './styles/scrollbar.scss';
import './styles/_variables.scss';
import ElementPlus from 'element-plus';

export { NLayoutWithSub as NLayout, NLayoutTabs, NLayoutPortal, useTabFocus } from './Layout/index';
export { NFilter, NFilterFieldsConfig } from './Filter/index';
export type * from './Filter/types';

import { NLayoutWithSub as NLayout, NLayoutTabs, NLayoutPortal } from './Layout/index';
import { NFilter, NFilterFieldsConfig } from './Filter/index';

export function install(app: App) {
  app.component('NLayout', NLayout);
  app.component('NLayoutTabs', NLayoutTabs);
  app.component('NLayoutPortal', NLayoutPortal);
  app.component('NFilter', NFilter);
  app.component('NFilterFieldsConfig', NFilterFieldsConfig);
  app.use(ElementPlus);
}

export default {
  install,
};
