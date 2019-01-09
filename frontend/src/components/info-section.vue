<template>
    <section class="info-section flex flex-column align-center">
        <template v-if="showScore">
            <soldier color="white"></soldier>
            <h3>{{score.white}}</h3>
            <soldier color="black"></soldier>
            <h3>{{score.black}}</h3>
        </template>
    </section>
</template>

<script>
import soldier from './soldier'

export default {
    components: {
        soldier
    },
    
    computed: {
        currTurn() {
            return this.$store.getters.currTurn
        },
        userColor() {
            return this.$store.getters.loggedInUserColor
        },
        score() {
            return this.$store.getters.score
        },
        showScore() {
            return this.score.white || this.score.black
        }
    }
}
</script>
<style lang="scss" scoped>
.info-section {
    background-color: black;
    @media (min-width: 850px) {
        width: 8vw;
    }
    width: calc(8vw + 10px);
    color: white;
    font-weight: bold;
        padding-top: 20px;
    
    .soldier-section {
        display: block;
        margin-top: 3vh;
        // font-size: 1.2rem;

        @media (min-width: 850px) {
            font-size: 1.5rem;
        }
    }
}
</style>

