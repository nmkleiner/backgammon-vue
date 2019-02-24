<template>
  <div
    class="game-cell flex flex-column align-center wrap"
    :class="{
        'middle': middle,
        'exit': exit,
        'possibleMove': cell.isPossibleMove
    }"
    @click="onCellClick"
  >
    <div v-if="middle" class="middle-line"></div>
    <div
      v-if="!middle"
      :class="{
            'triangle-up': cell.id > 12 && cell.id < 25,
            'triangle': cell.id > 0 && cell.id < 25,
            'triangle-down': cell.id < 13 && cell.id > 0,
            'triangle-red': cell.id % 2 === 0,
            'triangle-black': cell.id % 2 !== 0,
            'exit-cell': cell.id === 0 || cell.id === 25,
            'triangle-green': cell.isPossibleMove,
        }"
    ></div>
    <soldier
      @dblclick.native="onSoldierDblClick(soldier)"
      @mouseout.native="onSoldierOut()"
      @mouseover.native="onSoldierHover(soldier)"
      @click.native="onSoldierClick(soldier,$event)"
      v-for="(soldier,idx) in cell.soldiers"
      :key="soldier.id"
      :soldier="soldier"
      :idx="idx"
    />
  </div>
</template>

<script>
const soldier = () => import("./soldier.vue");
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
    async onCellClick(ev) {
      if (this.cell.isPossibleMove && ev) ev.stopPropagation();
      if (this.selectedSoldier) {
        const soldier = this.selectedSoldier;
        this.$store.commit("showNoPossibleMoves");
        let { soldierDidMove, isEating } = await this.$store.dispatch({
          type: "moveSoldier",
          targetCell: this.cell
        });
        if (soldierDidMove) {
          this.afterSoldierMove(soldier, isEating);
        }
      }
    },
    onSoldierClick(soldier,ev) {
      if (!soldier.isOut && !this.selectedSoldier) {
        this.$store.dispatch({type: 'selectSoldier', soldier})
        ev.stopPropagation()
      } else {
      }
    },
    async onSoldierDblClick(soldier) {
      const targetCellIdx = this.loggedInUserColor === "white" ? 25 : 0;
      let { soldierDidMove, isEating } = await this.$store.dispatch({
        type: "moveSoldier",
        targetCell: this.cells.find(cell => cell.id === targetCellIdx)
      });
      if (soldierDidMove) {
        this.afterSoldierMove(soldier, false);
      }
    },
    afterSoldierMove(soldier, isEating) {
      const room = 1;
      const cells = this.cells;
      this.$socket.emit("clientSoldierMoved", {
        soldierId: soldier.id,
        targetCell: this.cell,
        cells,
        isEating,
        room
      });
      this.$store.commit("unselectSoldiers");
      this.$store.commit("showNoPossibleMoves");
    },
    onSoldierHover(soldier) {
      if (soldier.possibleMoves.length) {
        this.$store.commit({
          type: "showPossibleMoves",
          possibleMoves: soldier.possibleMoves,
          soldier
        });
      }
    },
    onSoldierOut() {
      if (!this.selectedSoldier) this.$store.commit("showNoPossibleMoves");
    }
  },
  computed: {
    selectedSoldier() {
      return this.$store.getters.selectedSoldier;
    },
    loggedInUserColor() {
      return this.$store.getters.loggedInUserColor;
    },
    cells() {
      return this.$store.getters.cells;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
