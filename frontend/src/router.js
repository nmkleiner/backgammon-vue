import Vue from 'vue'
import Router from 'vue-router'
const homePage = () => import('./views/home-page.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: homePage
    },
    {
      path: '/:openCmp',
      name: 'homepage',
      component: homePage
    },
  ]
})
