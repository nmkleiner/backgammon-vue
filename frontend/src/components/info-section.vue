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