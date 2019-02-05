import Vue from 'vue'
import Router from 'vue-router'
import homePage from './views/home-page.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/:openCmp',
      name: 'homepage',
      component: homePage
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: loginPage
    // },
  ]
})
