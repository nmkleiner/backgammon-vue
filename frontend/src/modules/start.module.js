import startGameService from '@/services/startGame.service.js'

export default ({
    state: {
        isGameOn: false,
        startDice: {
            dice: 6,
            white: null,
            black: null
        },
        choosingColors: true,
        playersConnected: 1
    },
    mutations: {
        gameOn(state) {
            state.isGameOn = true
        },
        setStartDice(state, { color }) {
            state.startDice.dice = state.startDice[color] = startGameService.setStartDice(state.startDice.dice)
        },
        setStartDiceTo(state, { dice, color }) {
            state.startDice.dice = state.startDice[color] = dice
        },
        nullDice(state) {
            state.startDice.white = state.startDice.black = null
        },
        setChoosingColors(state) {
            state.choosingColors = false
        },
        setTwoPlayersConnected(state) {
            state.playersConnected = 2
        }

    },
    actions: {
        diceRes({ commit }, { dice, userColor }) {
            commit("rollDices");

            const color = (userColor === 'white') ? 'black' : 'white'
            if (dice) commit({ type: 'setStartDiceTo', color, dice })
            else commit({ type: 'setStartDice', color })
            setTimeout(() => {
                commit("unrollDices");
            }, 1000);
        },
        setTwoPlayersConnected({ commit }) {
            commit('setTwoPlayersConnected')
        },
        changeMyColor({ commit }) {
            commit('changeMyColor');
        }

    },
    getters: {
        isGameOn: state => state.isGameOn,
        startDice: state => state.startDice,
        choosingColors: state => state.choosingColors,
        playersConnected: state => state.playersConnected,

    }
})

