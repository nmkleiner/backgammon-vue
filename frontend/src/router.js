import Vue from 'vue';
import Router from 'vue-router';
import VueRouter from 'vue-router';
import homePage from './views/home-page.vue';
const gamePage = () => import('./views/game-page.vue');
const loginCmp = () => import('./components/login-cmp');
const signupCmp = () => import('./components/signup-cmp');
const chatCmp = () => import('./components/chat-cmp');

Vue.use(Router);


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'homePage',
      component: homePage
    },
    {
      path: '/game/:room',
      name: 'gamePage',
      component: gamePage
    },
    {
      path: '/chat',
      name: 'gamePage',
      component: gamePage,
      children: [
        {path: '/login', component: loginCmp},
        {path: '/signup', component: signupCmp},
        {path: '/chat', component: chatCmp},
      ]
    },
  ]
});

export default router
