<template>
    <section
            class="game-board"
            :class="{'flipped-board': userColor === 'black', 'hidden': choosingColors}"
            @click="unselect"
    >
        <div class="flex flex-column">
            <div class="board-row top-row flex space-between">
                <game-cell :exit="true" :cell="cells[0]"></game-cell>
                <div class="board-cells flex space-between">
                    <game-cell v-for="idx in 6" :cell="cells[idx]" :key="idx"></game-cell>
                    <game-cell :middle="true" :cell="cells[26]"></game-cell>
                    <game-cell v-for="idx in 6" :cell="cells[idx+6]" :key="idx+6"></game-cell>
                </div>
            </div>
            <div class="board-wrapper left-side-wrapper flex space-around align-center">
                <dices-section v-if="!winner"></dices-section>
            </div>

            <div class="board-wrapper right-side-wrapper flex space-around align-center">
                <action-btns></action-btns>
            </div>
            <div class="board-row bot-row flex space-between">
                <div class="board-cells flex space-between">
                    <game-cell v-for="idx in 6" :cell="cells[idx + 12]" :key="idx + 12"></game-cell>
                    <game-cell :middle="true" :cell="cells[27]"></game-cell>
                    <game-cell v-for="idx in 6" :cell="cells[idx + 18]" :key="idx + 18"></game-cell>
                </div>
                <game-cell :exit="true" :cell="cells[25]"></game-cell>
            </div>
        </div>
    </section>
</template>

<script>
    import gameCell from "./game-cell.vue";
    const actionBtns = () => import("./action-btns");
    const dicesSection = () => import("./dices-section");
    import {mapGetters} from 'vuex'

    export default {
        props: {
            cells: Array
        },
        components: {
            gameCell,
            dicesSection,
            actionBtns
        },
        created() {
        },
        methods: {
            unselect() {
                this.$store.commit("showNoPossibleMoves");
                this.$store.commit("unselectSoldiers");
            }
        },
        computed: {
            ...mapGetters({
                winner: 'winner',
                userColor: 'loggedInUserColor',
                mars: 'isMars',
                turkishMars: 'isTurkishMars',
                choosingColors: 'choosingColors'
            }),
            // winner() {
            //   return this.$store.getters.winner;
            // },
            // userColor() {
            //   return this.$store.getters.loggedInUserColor;
            // },
            // mars() {
            //   return this.$store.getters.isMars;
            // },
            // turkishMars() {
            //   return this.$store.getters.isTurkishMars;
            // },
            // choosingColors() {
            //   return this.$store.getters.choosingColors;
            // }
        }
    };
</script>

<style scoped lang="scss">


</style>
