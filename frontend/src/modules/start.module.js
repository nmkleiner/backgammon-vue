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
            console.log('game onnnnnn')
        },
        setStartDice(state, {color}) {
            state.startDice.dice = state.startDice[color] = startGameService.throwStartDice(state.startDice.dice)
        },
        setStartDiceTo(state, {dice, color}) {
            state.startDice.dice = state.startDice[color] = dice
        },
        nullDice(state) {
            state.startDice.white = state.startDice.black = null
            console.log('game onnnnnn')
        }
    },
    actions: {
        diceRes({commit}, { dice, userColor }) {
            const color = (userColor === 'white') ? 'black' : 'white'
            if (dice) commit({type: 'setStartDiceTo', color, dice})
            else commit({type: 'setStartDice', color})
            
        }
    },
    getters: {
        isGameOn: state => state.isGameOn,
        startDice: state => state.startDice,
    }
})
// curr prob: throwing dice but it's value stays the same

