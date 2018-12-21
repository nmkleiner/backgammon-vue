import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import socketio from 'socket.io'
import VueSocketIO from 'vue-socket.io'
import Vuex from 'vuex'
 
// import './registerServiceWorker'
import './assets/scss/main.scss'

var socketURL = 'http://localhost:3000'
if (process.env.NODE_ENV !== "development") {
  socketURL = "/";
}

Vue.use(Vuex)
Vue.use(ElementUI);
// Vue.use(VueSocketIO)
Vue.use(new VueSocketIO({
    debug: true,
    connection: socketURL,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))

Vue.config.productionTip = false
Vue.crossOrigin = 'true'

// Vue.use(BootstrapVue);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
