import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import * as firebase from 'firebase';

import 'element-ui/lib/theme-chalk/index.css';
import VueSocketIO from 'vue-socket.io';
import Vuex from 'vuex';
// import './registerServiceWorker'
import './assets/scss/main.scss';

const socketURL = (process.env.NODE_ENV === "development")? 'http://localhost:3000' : "/";

Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(new VueSocketIO({
    connection: socketURL,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}));
Vue.config.productionTip = false;
Vue.crossOrigin = 'true';


import config from './config/config'

firebase.initializeApp(config);


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
