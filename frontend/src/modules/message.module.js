export default ({
    state: {
        msgs: [],
        showNotification: false
    },
    mutations: {
        pushMsgToHistory(state, {msg}){
            state.currEvent.msgs.push(msg);
        },
        setShowNotification(state, {value}) {
            state.showNotification = value
        }
    },
    actions: {
      
    },
    getters: {
        msgs: state => state.msgs,
        showNotification: state => state.showNotification,
        
    }
})

