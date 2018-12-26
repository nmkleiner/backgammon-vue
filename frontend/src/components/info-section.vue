<template>
    <section class="info-section flex flex-column align-center">
        <div v-if="currTurn" class="soldier-section capitalize">current turn:</div>
        <soldier :color="currTurn"></soldier>
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

