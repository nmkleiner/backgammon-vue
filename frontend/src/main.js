import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import * as firebase from 'firebase';

import VueSocketIO from 'vue-socket.io';
import Vuex from 'vuex';
// import './registerServiceWorker'
// require('@/assets/scss/main.scss');
import VModal from 'vue-js-modal'


const socketURL = (process.env.NODE_ENV === "development")? 'http://localhost:3000' : "/";

Vue.use(VModal);
Vue.use(Vuex);
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
