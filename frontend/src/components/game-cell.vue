<template>
    <div class="game-cell flex flex-column align-center wrap" :class="{'middle': middle, 'exit': exit}">
    
        <div v-if="!middle" @click.stop="onCellClick"
            :class="{
            'triangle-up': cell.id > 12 && cell.id < 25,
            'triangle-down': cell.id < 13 && cell.id > 0,
            'triangle-red': cell.id % 2 === 0,
            'triangle-black': cell.id % 2 !== 0,
            'exit-cell': cell.id === 0 || cell.id === 25,
            'triangle-green': cell.isPossibleMove,
        }">
        </div>
        <soldier @dblclick.native="onSoldierDblClick()" @mouseout.native="onSoldierOut()" 
        @mouseover.native="onSoldierHover(soldier)"
        @click.native.stop="onSoldierClick(soldier)" 
        v-if="cell.soldiers" v-for="(soldier,idx) in cell.soldiers" 
        :key="soldier.id" :soldier="soldier" :idx="idx"></soldier>
    </div>
</template>

<script>
import soldier from './soldier.vue'
import ioClient from "socket.io-client";

export default {
    props: {
        cell: Object,
        middle: Boolean,
        exit: Boolean
    },
    components: {
        soldier
    },
    methods: {
        onCellClick() {
            if (this.selectedSoldier) {
                this.$store.commit('showNoPossibleMoves')
                this.$store.dispatch({type: 'moveSoldier', targetCell: this.cell})
            }
            this.$store.commit('unselectSoldiers')
            const cells = this.$store.getters.cells
            const room = 1
            this.$socket.emit('soldierMoved',cells,room)

        },
        onSoldierClick(soldier) {
            this.$store.commit('unselectSoldiers')
            this.$store.commit('showNoPossibleMoves')
            this.$store.commit({type: 'showPossibleMoves',possibleMoves: soldier.possibleMoves, soldier})
            this.$store.commit({type: 'selectSoldier',soldierId: soldier.id})
        },
        onSoldierDblClick() {
        },
        onSoldierHover(soldier) {
            if (soldier.possibleMoves.length) {
                this.$store.commit({type: 'showPossibleMoves',possibleMoves: soldier.possibleMoves, soldier})
            }
        },
        onSoldierOut() {
            if (!this.selectedSoldier) this.$store.commit('showNoPossibleMoves')
        },

    },
    computed: {
        selectedSoldier() {
            return this.$store.getters.selectedSoldier
        }

    },
}
</script>

<style scoped lang="scss">

</style>
