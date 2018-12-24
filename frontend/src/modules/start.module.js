import startGameService from '@/services/startGame.service.js'

export default ({
    state: {
        isGameOn: false,
        startDice: {
            dice: 6,
            white: null,
            black: null
        }
    },
    mutations: {
        gameOn(state) {
            state.isGameOn = true
        },
        setStartDice(state, {color}) {
            state.startDice.dice = state.startDice[color] = startGameService.throwStartDice(state.startDice.dice)
        },
        nullDice(state) {
            state.startDice.white = state.startDice.black = null
        }
    },
    actions: {
        // throwStartDice({ commit, rootState }) {
        //     const {color} = rootState.gameModule.loggedInUser
        //     commit({type: 'setStartDice', color})
        // },
        diceRes({state, commit}, { userColor }) {
            const color = (userColor === 'white') ? 'black' : 'white'
            commit({type: 'setStartDice', color})
            if (state.startDice.white && state.startDice.black) {
                // if (state.startDice.white === state.startDice.black) {
                //     debugger;
                    
                //     commit('nullDice')
                //     return false
                // }
                // const startingColor = (state.startDice.white > state.startDice.black)? 'white' : 'black'
                // return startingColor
            }
        }
    },
    getters: {
        isGameOn: state => state.isGameOn,
        startDice: state => state.startDice,
    }
})
// curr prob: throwing dice but it's value stays the same

