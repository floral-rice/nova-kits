import { createApp } from 'vue';
import App from './App.vue';
import NovaUI from '@nova-kits/components';
import router from './router';

// import '@nova-kits/theme';

const app = createApp(App);
app.use(NovaUI);
app.use(router);
app.mount('#app');
