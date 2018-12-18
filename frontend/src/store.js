import Vue from 'vue'
import Vuex from 'vuex'
import gameModule from './modules/game.module.js'
import userService from './services/user.service.js'
// import utilService from './services/util.service.js'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    gameModule
  },
  state: {
    loggedInUser: {}
  },
  mutations: {
    setLoggedInUser(state, { user }) {
      state.loggedInUser = user;
    }
    
  },
  actions: {
    getLoggedInUser({ commit }) {
      userService.getLoggedInUser().then(loggedInUser => {
        commit({ type: 'setLoggedInUser', user: loggedInUser });
      });
    },
    login({ commit }, { loginData }) {
      return userService.login(loginData).then(user => {
        if (user) {
          commit({ type: 'setLoggedInUser', user });
        }
        return user;
      });
    }
  },
  getters: {
    

  }
})
