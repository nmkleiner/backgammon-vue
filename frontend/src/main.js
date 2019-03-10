import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import * as firebase from 'firebase'

import 'element-ui/lib/theme-chalk/index.css'
import VueSocketIO from 'vue-socket.io'
import Vuex from 'vuex'
import './registerServiceWorker'
import './assets/scss/main.scss'



const socketURL = (process.env.NODE_ENV === "development")? 'http://localhost:3000' : socketURL = "/";
// if (process.env.NODE_ENV !== "development") {
//   socketURL = "/";
// }

Vue.use(Vuex)
Vue.use(ElementUI);
Vue.use(new VueSocketIO({
    // debug: true,
    connection: socketURL,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))
Vue.config.productionTip = false
Vue.crossOrigin = 'true'


const config = {
  apiKey: "AIzaSyBsGiGT26GHGbOLcCfR17J-U3oHZhkW1Xk",
  authDomain: "first-project-1540121096472.firebaseapp.com",
  databaseURL: "https://first-project-1540121096472.firebaseio.com",
  projectId: "first-project-1540121096472",
  storageBucket: "first-project-1540121096472.appspot.com",
  messagingSenderId: "814618389578"
};
firebase.initializeApp(config);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
