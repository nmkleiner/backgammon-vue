<template>
    <div class="action-btns" :class="{'hidden': loading}">
        <button 
            v-if="showDiceBtn" 
            :class="{'lightSpeedIn':showDiceBtn, 'fadeOutUp': !showDiceBtn}" 
            @click.stop="throwDice" 
            class="animated bold capitalize">
            roll
        </button>
        <button 
            v-if="showWaitBtn" 
            :class="{'lightSpeedIn':showWaitBtn, 'fadeOutUp': !showWaitBtn}" 
            class="animated bold capitalize wait">
            wait..<span class="animated flash slower infinite">.</span>
        </button>
        <button 
            v-if="showDicesBtn" 
            :class="{'lightSpeedIn':showDicesBtn, 'fadeOutUp': !showDicesBtn}" 
            @click.stop="throwDices" 
            class="animated bold capitalize">
                roll
        </button>
    </div>
</template>

<script>
import startGameService from '../services/startGame.service.js';
import soundService from '../services/sound.service.js';
export default {
    data() {
        return {
            loading: true,
            diceSound: '',
            
        }
    },
    created() {
        setTimeout(() => {
            this.loading = false
        },1000)
    },
    computed: {
        showDicesBtn() {
            return this.isGameOn && !this.duringTurn && !this.rolling && this.currTurn === this.userColor
        },
        showDiceBtn() {
            return  !this.isGameOn && 
            (
                !this.startDice.white && this.userColor === 'white' ||
                this.startDice.white && !this.startDice.black && this.userColor === 'black'
              ) && !this.waitingForUser
        },
        showWaitBtn() {
            return  !this.isGameOn && 
            (
                !this.startDice.white && this.userColor === 'white' ||
                this.startDice.white && !this.startDice.black && this.userColor === 'black'
              ) && this.waitingForUser
        },
        // v-if="showDiceBtn && waitingForUser" 

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
        rolling() {
            return this.$store.getters.dicesRolling
        },
        isGameOn() {
            return this.$store.getters.isGameOn
        },
        startDice() {
            return this.$store.getters.startDice
        },
        playersConnected() {
            return this.$store.getters.playersConnected
        },
        waitingForUser() {
            return !(this.playersConnected === 2)
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
    async throwDice() {
        this.$store.commit('rollDices')
        const room = 1
        this.$socket.emit("rollDices", room)

        let {userColor} = this
        userColor = (userColor === 'white') ? 'black' : 'white'
        await this.$store.dispatch({type: 'diceRes', userColor })
        setTimeout(() => {
            this.$store.commit('unrollDices')
        },1000)

        this.$socket.emit("startDiceRes", room, this.startDice.dice)
    },
}

}
</script>

<style scoped lang="scss">

</style>
