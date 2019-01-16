import Vue from 'vue'
import Vuex from 'vuex'
import gameModule from './modules/game.module.js'
import startModule from './modules/start.module.js'
import messageModule from './modules/message.module.js'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    gameModule,
    startModule,
    messageModule
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
