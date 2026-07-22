import { App } from 'vue';
export * from 'element-plus';
import 'element-plus/dist/index.css';

import NLayout from './Layout/Layout.vue';

export { NLayout };
export function install(app: App) {
  app.component('NLayout', NLayout);
}

export default {
  install,
};
