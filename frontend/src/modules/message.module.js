export default ({
    state: {
        messages: [],
        showNotification: false,
        isInputFocus: false
    },
    mutations: {
        pushMsgToHistory(state, {message}){
            state.messages.push(message);
        },
        setShowNotification(state, {value}) {
            state.showNotification = value
        },
        toggleInputFocus(state) {
            state.isInputFocus = !state.isInputFocus
        },
    },
    actions: {
      
    },
    getters: {
        messages: state => state.messages,
        isInputFocus: state => state.isInputFocus,
        showNotification: state => state.showNotification,
        
    }
})

