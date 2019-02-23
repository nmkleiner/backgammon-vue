<template>
  <section class="dices-section flex justify-center">
    <div class="two-dices-wrapper flex space-between" v-if="isGameOn">
      <dice :rolling="rolling" :used="!dices.num1 && !!dices.num2" :num="dices.num1ToShow"/>
      <dice
        :rolling="rolling"
        :used="!dices.num2 && !!dices.num1 && dices.doubleCount <= 1"
        :num="dices.num2ToShow"
      />
    </div>
    <dice v-if="!isGameOn" :rolling="rolling" :num="startDice.dice"></dice>
  </section>
</template>

<script>
const dice = () => import("./dice.vue");
const soldier = () => import("./soldier");
import ioClient from "socket.io-client";

export default {
  components: {
    dice,
    soldier
  },
  sockets: {
    serverDicesRolling() {
      this.$store.commit("rollDices");
    },
    serverDicesUnrolling(dices) {
      setTimeout(() => {
        this.$store.commit("unrollDices");
        this.$store.commit({ type: "dicesRes", dices });
      }, 1000);
    },



    async serverDiceUnrolling(dice) {
      await setTimeout(() => {
        this.$store.commit("unrollDices");
      }, 1000);
      const { userColor } = this;
      await this.$store.dispatch({ type: "diceRes", dice, userColor });
    },




    serverEndTurn() {
      setTimeout(() => {
        this.$store.commit("endTurn");
      }, 1500);
    }
  },
  computed: {
    dices() {
      return this.$store.getters.dices;
    },
    duringTurn() {
      return this.$store.getters.duringTurn;
    },
    userColor() {
      return this.$store.getters.loggedInUserColor;
    },
    rolling() {
      return this.$store.getters.dicesRolling;
    },
    isGameOn() {
      return this.$store.getters.isGameOn;
    },
    startDice() {
      return this.$store.getters.startDice;
    },
    winner() {
      return this.$store.getters.winner;
    }
  },
  watch: {
    duringTurn: function(newVal, oldVal) {
      if (newVal === false) {
        const room = 1;
        this.$socket.emit("clientEndTurn", room);
      }
    },
    "startDice.white": function(newVals, oldVals) {
      if (this.startDice.black && this.startDice.white) {
        if (this.startDice.white === this.startDice.black) {
          this.$store.commit("nullDice");
          return false;
        }
        const startingColor =
          this.startDice.white > this.startDice.black ? "white" : "black";
        this.$store.commit({ type: "setCurrTurn", startingColor });
        setTimeout(() => {
          this.$store.commit("gameOn");
        }, 2000);
      }
    },
    "startDice.black": function(newVals, oldVals) {
      if (this.startDice.black && this.startDice.white) {
        if (this.startDice.white === this.startDice.black) {
          this.$store.commit("nullDice");
          return false;
        }
        const startingColor =
          this.startDice.white > this.startDice.black ? "white" : "black";
        this.$store.commit({ type: "setCurrTurn", startingColor });
        setTimeout(() => {
          this.$store.commit("gameOn");
        }, 2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.dices-section {
  background-color: transparent;
  display: flex;
  width: 12vw;
  .two-dices-wrapper {
    width: 100%;
  }
}
</style>

