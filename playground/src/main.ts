import { createApp } from 'vue';
import App from './App.vue';
import NovaUI from '@nova-ui/components';

// import '@nova-ui/theme';

const app = createApp(App);
app.use(NovaUI);
app.mount('#app');
