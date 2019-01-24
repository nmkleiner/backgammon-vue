import Vue from 'vue'
import Router from 'vue-router'
// import signUp from './views/sign-up.vue'
// import loginPage from './views/login-page.vue'
import homePage from './views/home-page.vue'
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
    // {
    //   path: '/signup',
    //   name: 'signup',
    //   component: signUp
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: loginPage
    // },
  ]
})
