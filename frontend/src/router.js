import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router';
const homePage = () => import('./views/home-page.vue')
const loginCmp = () => import('./components/login-cmp')
const signupCmp = () => import('./components/signup-cmp')
const chatCmp = () => import('./components/chat-cmp')

Vue.use(Router)


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: homePage
    },
    {
      path: '/chat',
      name: 'homepage',
      component: homePage,
      children: [
        {path: '/login', component: loginCmp},
        {path: '/signup', component: signupCmp},
        {path: '/chat', component: chatCmp},
      ]
    },
  ]
})

export default router
