import { App } from 'vue';
export * from 'element-plus';
import 'element-plus/dist/index.css';
import './styles/scrollbar.scss';
import './styles/_variables.scss';
import ElementPlus from 'element-plus';

export { NLayoutWithSub as NLayout, NLayoutTabs, NLayoutPortal, useTabFocus } from './Layout/index';
export { NSection } from './Section/index';

import { NLayoutWithSub as NLayout, NLayoutTabs, NLayoutPortal } from './Layout/index';
import { NSection } from './Section/index';

export function install(app: App) {
  app.component('NLayout', NLayout);
  app.component('NLayoutTabs', NLayoutTabs);
  app.component('NLayoutPortal', NLayoutPortal);
  app.component('NSection', NSection);
  app.use(ElementPlus);
}

export default {
  install,
};
