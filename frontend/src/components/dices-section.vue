<template>
    <section class="dices-section flex flex-column align-center">
        <button v-if="!duringTurn" @click.stop="throwDices" class="bold capitalize">click to throw dices</button>
        <span class="dice-text" v-if="duringTurn && !dices.doubleCount && dices.num1 && dices.num2">{{dices.num1}} + {{dices.num2}} = {{dices.num1 + dices.num2}}</span>
        <span class="dice-text" v-if="duringTurn && !dices.doubleCount && !dices.num1">{{dices.num2}}</span>
        <span class="dice-text" v-if="duringTurn && !dices.doubleCount && !dices.num2">{{dices.num1}}</span>
        <span class="dice-text" v-if="duringTurn && dices.doubleCount">{{dices.num1}} * {{dices.doubleCount}} = {{dices.num1 * dices.doubleCount}}</span>

        <dice :rolling="rolling" :num="dices.num1ToShow"></dice>
        <dice :rolling="rolling" :num="dices.num2ToShow"></dice>
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
            rolling: false,
        }
    },
    methods: {
        throwDices() {
            this.rolling = true
            setTimeout(() => {
                this.$store.commit('throwDices')
                this.rolling = false
            },1000)
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
        }
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

