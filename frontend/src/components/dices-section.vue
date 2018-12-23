<template>
    <section class="dices-section flex flex-column align-center">
        <button v-if="!isGameOn && !alreadyThrown" @click.stop="decideWhoStarts" class="bold capitalize">click to decide who starts</button>
        <button v-if="showButton" @click.stop="throwDices" class="bold capitalize">click to throw dices</button>
        <span class="dice-text" v-if="duringTurn && !dices.doubleCount && dices.num1 && dices.num2">{{dices.num1}} + {{dices.num2}} = {{dices.num1 + dices.num2}}</span>
        <span class="dice-text" v-if="duringTurn && !dices.doubleCount && !dices.num1">{{dices.num2}}</span>
        <span class="dice-text" v-if="duringTurn && !dices.doubleCount && !dices.num2">{{dices.num1}}</span>
        <span class="dice-text" v-if="duringTurn && dices.doubleCount">{{dices.num1}} * {{dices.doubleCount}} = {{dices.num1 * dices.doubleCount}}</span>
        <pre v-if="!isGameOn">{{startDice}}</pre>
        <dice :rolling="rolling" :num="dices.num1ToShow"></dice>
        <dice v-if="isGameOn" :rolling="rolling" :num="dices.num2ToShow"></dice>
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
            alreadyThrown: false
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
            await this.$store.dispatch('throwStartDice')
            this.alreadyThrown = true
            this.$socket.emit("startDiceRes", room, this.diceToShow)
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
        diceUnrolling(dice) {
            this.$store.commit('unrollDices')
            this.$store.commit({type: 'diceRes', dice})

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
        showButton() {
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
        diceToShow() {
            return this.$store.getters.startDice[this.userColor]
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
                console.log('great success')
            }
        },
        'startDice.black': function(newVals, oldVals) {
            if (this.startDice.black && this.startDice.white) {
                console.log('great success')
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

