import startGameService from '@/services/startGame.service.js'

export default ({
    state: {
        msgs: []
    },
    mutations: {
        pushMsgToHistory(state, {msg}){
            state.currEvent.msgs.push(msg);
        }
        
    },
    actions: {
      
    },
    getters: {
        msgs: state => state.msgs,
        
    }
})

