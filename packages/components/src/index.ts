import { App } from 'vue';
export * from 'element-plus';
import 'element-plus/dist/index.css';


import { NButton } from './button';
import NLayout from './Layout/Layout.vue';

export type { ButtonProps } from './button/Button.vue';



export { NButton, NLayout };
export function install(app: App) {
  app.component('NButton', NButton);
  app.component('NLayout', NLayout);
}

export default {
  install,
};
