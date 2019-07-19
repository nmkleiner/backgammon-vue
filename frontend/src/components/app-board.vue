<template>
  <section class="app-board">
    <div class="flex">
      <div class="rotate-screen animated swing">
        <img src="../../public/img/rotate.png">
      </div>
      <msg-cmp v-if="showMsg" :msg="msg"></msg-cmp>
      <game-board v-if="cells" :cells="cells"></game-board>
      <info-section></info-section>
    </div>
  </section>
</template>
<script>
import gameBoard from "./game-board";
import { mapGetters } from "vuex";
const infoSection = () => import("./info-section");
const soldier = () => import("./soldier");
const msgCmp = () => import("./msg-cmp");
const ioClient = () => import("socket.io-client");

export default {
  name: "appBoard",
  components: {
    gameBoard,
    soldier,
    infoSection,
    msgCmp
  },
  computed: {
    ...mapGetters([
      "cells",
      "winner",
      "isMars",
      "currentTurn",
      "lastMovesIds",
      "isTurkisMars",
      "noPossibleMoves",
      "loggedInUserColor",
    ]),
    isWinner() {
      return this.winner === this.loggedInUserColor;
    },
    showMsg() {
      return this.winner || this.noPossibleMoves;
      // return true
    },
    msg() {
      if (!this.showMsg) return;
      if (this.noPossibleMoves) return "No Possible Moves";
      if (this.winner && this.isTurkishMars)
        return this.isWinner
          ? "you won! turkish mars!"
          : "you lost! turkish mars!";
      if (this.winner && this.isMars)
        return this.isWinner ? "you won! mars!" : "you lost! mars!";
      if (this.winner) return this.isWinner ? "you won!" : "you lost!";
      // return "you lost!\n turkish mars"
    }
  },
  created() {
    this.$store.dispatch({ type: "setBoard" });
    const room = 1;
    this.$socket.emit("clientGameJoined", room);
  },
  sockets: {
    serverUserJoined() {
      const room = 1;
      this.$socket.emit("clientAlreadyHere", room);

      this.$store.dispatch("setTwoPlayersConnected");
    },
    serverSomeoneAlreadyHere() {
      this.$store.dispatch("changeMyColor");
      this.$store.dispatch("setTwoPlayersConnected");
    },
    serverSoldierMoved(moveDto) {
      this.$store.dispatch({
        type: "setBoard",
        moveDto
      });
    },
    serverGameEnded(winner) {
      this.$store.dispatch({ type: "endGame", winner });
    },
    serverIsMars() {
      this.$store.dispatch({ type: "setMars", isMars: true });
    },
    serverIsTurkishMars() {
      this.$store.dispatch({ type: "setTurkishMars", isTurkishMars: true });
    },
    serverRestartGame() {
      this.$store.dispatch({ type: "restartGame" });
    }
  },
  watch: {
    winner: function(newVal, oldVal) {
      if (newVal) {
        const room = 1;
        const winner = true;
        this.$socket.emit("clientEndGame", room, winner);
        this.$store.dispatch("win");
      }
    },
    isMars: function(newVal) {
      if (newVal) {
        const room = 1;
        this.$socket.emit("clientMars", room);
      }
    },
    isTurkishMars: function(newVal) {
      if (newVal) {
        const room = 1;
        this.$socket.emit("clientTurkishMars", room);
      }
    },
    currentTurn: function(currentTurnColor) {
      if (currentTurnColor === this.loggedInUserColor) {
        this.$store.commit("clearSendMoveDtoInterval");
      } else {
        if (lastMovesIds.length > 10) { 
          this.$store.commit("emptyLastMovesIds");
        }
      }
    }
  }
};
</script>

<style scoped lang='scss'>
</style>
