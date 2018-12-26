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
    },
    mutations: {
        gameOn(state) {
            state.isGameOn = true
        },
        setStartDice(state, {color}) {
            state.startDice.dice = state.startDice[color] = startGameService.throwStartDice(state.startDice.dice)
        },
        setStartDiceTo(state, {dice, color}) {
            state.startDice.dice = state.startDice[color] = dice
        },
        nullDice(state) {
            state.startDice.white = state.startDice.black = null
        },
        setChoosingColors(state) {
            state.choosingColors = false
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
        choosingColors: state => state.choosingColors,
    }
})

