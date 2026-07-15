
import { App } from 'vue';
import Popup from './Popup/Popup.vue';

export function install(app: App) {
  app.component('Popup', Popup);
}

export { Popup };

export default {
  install,
};

