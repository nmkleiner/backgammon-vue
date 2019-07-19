<template>
  <div
    class="game-cell"
    :class="{
        middle: middle,
        exit: exit,
        possibleMove: cell.isPossibleMove,
        crowded: cell.soldiers.length > 5,
        'very-crowded': cell.soldiers.length > 7,
    }"
    @click="onCellClick"
  >
    <div v-if="middle" class="middle-line"></div>
    <div v-if="!middle" :class="cellClass"></div>
    <div v-if="isIndicatorOn" class="indicator animated half-flash faster infinite"></div>
    <!-- @dblclick="onSoldierDblClick(soldier)" -->
    <transition-group name="scale" appear mode="out-in">
      <soldier
        @mouseout.native="onSoldierOut()"
        @mouseover.native="onSoldierHover(soldier)"
        @click.native="onSoldierClick(soldier,$event)"
        v-for="(soldier,idx) in cell.soldiers"
        :key="soldier.id"
        :soldier="soldier"
        :loggedInUserColor="loggedInUserColor"
        :idx="idx"
      />
    </transition-group>
  </div>
</template>

<script>
const soldier = () => import("./soldier.vue");
import utilService from "../services/util.service";
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
      if (this.cell.isPossibleMove && ev) {
        ev.stopPropagation();
      }
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
    onSoldierClick(soldier, ev) {
      if (!soldier.isOut && !this.selectedSoldier) {
        this.$store.dispatch({ type: "selectSoldier", soldier });
        ev.stopPropagation();
      }
    },
    afterSoldierMove(soldier, isEating) {
      const room = 1;
      const moveDto = {
        id: Date.now(),
        room,
        isEating,
        soldierId: soldier.id,
        targetCell: this.cell,
      };

      this.$store.commit({type: 'setSendMoveDtoInterval', socket: this.$socket, moveDto})
      this.$store.commit("unselectSoldiers");
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
    currentTurn() {
      return this.$store.getters.currentTurn;
    },
    cells() {
      return this.$store.getters.cells;
    },
    cellClass() {
      return {
        "triangle-up": this.cell.id > 12 && this.cell.id < 25,
        triangle: this.cell.id > 0 && this.cell.id < 25,
        "triangle-down": this.cell.id < 13 && this.cell.id > 0,
        "triangle-red": this.cell.id % 2 === 0,
        "triangle-black": this.cell.id % 2 !== 0,
        "exit-cell": this.cell.id === 0 || this.cell.id === 25,
        "triangle-green": this.cell.isPossibleMove
      };
    },
    isPossibleMoveInCell() {
      const { soldiers } = this.cell;
      if (soldiers[soldiers.length - 1]) {
        return !!soldiers[soldiers.length - 1].possibleMoves.length;
      } else return false;
      // return true
    },
    isIndicatorOn() {
      return !this.exit && this.isPossibleMoveInCell;
    }
  }
};
</script>
