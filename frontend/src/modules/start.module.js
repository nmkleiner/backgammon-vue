import startGameService from '../services/startGame.service.js'

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
        setStartDice(state, {color}) {
            const res = startGameService.setStartDice(state.startDice.dice);
            state.startDice.dice = res;
            state.startDice[color] = res
        },
        setStartDiceTo(state, {dice, color}) {
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
        diceRes({commit, rootState}, {dice}) {
            commit({type: 'rollDices', isStartDice: true});
            if (dice) {//diceRes called from socket
                const color = (rootState.gameModule.loggedInUser.color === 'white') ? 'black' : 'white';
                commit({type: 'setStartDiceTo', color, dice});
            }
            else {
                const color = rootState.gameModule.loggedInUser.color;
                commit({type: 'setStartDice', color});
            }
            setTimeout(() => {
                commit("unrollDices");
            }, 700);
        },
        setTwoPlayersConnected({commit}) {
            commit('setTwoPlayersConnected');
        },
        changeMyColor({commit}) {
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

