<template>
    <section class="info-section flex flex-column align-center">
        <div class="mt-30" v-if="showScore">
            <soldier color="white"></soldier>
            <h3>{{score.white}}</h3>
            <soldier color="black"></soldier>
            <h3>{{score.black}}</h3>
        </div>
    </section>
</template>

<script>
const soldier = () => import("./soldier.vue");

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
    @media screen and (orientation:portrait) {
        display: none;
    }
    background-color: black;
    @media (min-width: 850px) {
        width: 8vw;
    }
    width: calc(8vw + 10px);
    color: white;
    font-weight: bold;
        padding-top: 20px;
    
    .soldier-const {
        display: block;
        margin-top: 3vh;

        @media (min-width: 850px) {
            font-size: 1.5rem;
        }
    }
}
</style>

