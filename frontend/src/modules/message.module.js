export default ({
    state: {
        msgs: [],
        showNotification: false,
        isInputFocus: false
    },
    mutations: {
        pushMsgToHistory(state, {msg}){
            state.currEvent.msgs.push(msg);
        },
        setShowNotification(state, {value}) {
            state.showNotification = value
        },
        toggleInputFocus(state) {
            state.isInputFocus = !state.isInputFocus
        }
    },
    actions: {
      
    },
    getters: {
        msgs: state => state.msgs,
        isInputFocus: state => state.isInputFocus,
        showNotification: state => state.showNotification,
        
    }
})

