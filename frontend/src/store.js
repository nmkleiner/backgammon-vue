import Vue from 'vue'
import Vuex from 'vuex'
import gameModule from './modules/game.module.js'
import startModule from './modules/start.module.js'
// import utilService from './services/util.service.js'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    gameModule,
    startModule
  },
  state: {
  },
  mutations: {
    
    
  },
  actions: {
    
  },
  getters: {
    

  }
})
