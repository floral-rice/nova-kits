
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Component from '../views/Component.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/component/:name',
    name: 'Component',
    component: Component,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

