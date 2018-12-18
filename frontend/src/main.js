import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

// import './registerServiceWorker'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/scss/main.scss'
Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.crossOrigin = 'true'

// Vue.use(BootstrapVue);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
