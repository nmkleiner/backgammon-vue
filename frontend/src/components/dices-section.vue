<template>
    <section class="dices-section flex flex-column align-center">
        <button v-if="showDiceBtn" @click.stop="decideWhoStarts" class="animate bounce infinite bold capitalize">click to decide who starts</button>
        <button v-if="showDicesBtn" @click.stop="throwDices" class="bold capitalize">click to throw dices</button>
        <span class="dice-text" v-if="duringTurn && !dices.doubleCount && dices.num1 && dices.num2">{{dices.num1}} + {{dices.num2}} = {{dices.num1 + dices.num2}}</span>
        <span class="dice-text" v-if="duringTurn && !dices.doubleCount && !dices.num1">{{dices.num2}}</span>
        <span class="dice-text" v-if="duringTurn && !dices.doubleCount && !dices.num2">{{dices.num1}}</span>
        <span class="dice-text" v-if="duringTurn && dices.doubleCount">{{dices.num1}} * {{dices.doubleCount}} = {{dices.num1 * dices.doubleCount}}</span>
        <pre v-if="!isGameOn">{{startDice}}</pre>
        <dice v-if="isGameOn" :rolling="rolling" :num="dices.num1ToShow"></dice>
        <dice v-if="isGameOn" :rolling="rolling" :num="dices.num2ToShow"></dice>
        <dice v-else :rolling="rolling" :num="startDice.dice"></dice>
        <div class="soldier-section capitalize text-center">current turn:</div>
        <soldier :color="currTurn"></soldier>
    </section>
</template>

<script>
import dice from './dice.vue'
import soldier from './soldier'

export default {
    components: {
        dice,
        soldier
    },
    data() {
        return {
            // alreadyThrown: false
        }
    },
    methods: {
        async throwDices() {
            this.$store.commit('rollDices')
            const room = 1
            this.$socket.emit("rollDices", room)
            this.$store.dispatch('throwDices')
            this.$socket.emit("dicesRes", room, this.dices)
        },
        async decideWhoStarts() {
            this.$store.commit('rollDices')
            const room = 1
            this.$socket.emit("rollDices", room)

            let {userColor} = this
            userColor = (userColor === 'white') ? 'black' : 'white'
            const {dice} = this.startDice
            await this.$store.dispatch({type: 'diceRes', dice, userColor })
            setTimeout(() => {
                this.$store.commit('unrollDices')
            },1000)

            // this.alreadyThrown = true
            this.$socket.emit("startDiceRes", room, this.startDice.dice)
        }
    },
    sockets: {
        dicesRolling() {
            this.$store.commit('rollDices')
        },
        dicesUnrolling(dices) {
            this.$store.commit('unrollDices')
            this.$store.commit({type: 'dicesRes', dices})
        },
        async diceUnrolling(dice) {
            await setTimeout(() => {
                this.$store.commit('unrollDices')
            },1000)
            const {userColor} = this
            await this.$store.dispatch({type: 'diceRes', dice, userColor })
        },
        turnEnded() {
            this.$store.commit('endTurn')
        }
        
    },
    computed: {
        dices() {
            return this.$store.getters.dices
        },
        duringTurn() {
            return this.$store.getters.duringTurn
        },
        currTurn() {
            return this.$store.getters.currTurn
        },
        userColor() {
            return this.$store.getters.loggedInUserColor
        },
        showDicesBtn() {
            return this.isGameOn && !this.duringTurn && !this.rolling && this.currTurn === this.userColor
        },
        rolling() {
            return this.$store.getters.dicesRolling
        },
        isGameOn() {
            return this.$store.getters.isGameOn
        },
        startDice() {
            return this.$store.getters.startDice
        },
        showDiceBtn() {
            return  !this.isGameOn && 
            (
                !this.startDice.white && this.userColor === 'white' ||
                this.startDice.white && !this.startDice.black && this.userColor === 'black'
              )
        }

    },
    watch: {
        duringTurn: function(newVal, oldVal) {
            if (newVal === false) {
                const room = 1
                this.$socket.emit('endTurn',room)
            }
        },
        'startDice.white': function(newVals, oldVals) {
            if (this.startDice.black && this.startDice.white) {
                if (this.startDice.white === this.startDice.black) {
                    this.$store.commit('nullDice')
                    return false
                }
                const startingColor = (this.startDice.white > this.startDice.black)? 'white' : 'black'
                this.$store.commit({type: 'setCurrTurn', startingColor})
            }
        },
        'startDice.black': function(newVals, oldVals) {
            if (this.startDice.black && this.startDice.white) {
                if (this.startDice.white === this.startDice.black) {
                    this.$store.commit('nullDice')
                    return false
                }
                const startingColor = (this.startDice.white > this.startDice.black)? 'white' : 'black'
                this.$store.commit({type: 'setCurrTurn', startingColor})
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.dices-section {
    background-color: black;
    @media (min-width: 850px) {
        width: 8vw;
    }
    width: calc(8vw + 10px);
    color: white;
    font-weight: bold;
    .dice-text {
        padding-top: 20px;
    }
    button {
        background-color: white;
        color: black;
        border: none;
        width: 8vw;
        cursor: pointer;
        // padding: 0 0 20px 0;
        @media (min-width: 850px) {
            font-size: 22px;
        }
        font-size: 12px;
    }
    .soldier-section {
        @media (min-width: 850px) {
            display: none;
        }
        display: block;
        margin-top: 3vh;
        font-size: 12px;
    }
}
</style>

