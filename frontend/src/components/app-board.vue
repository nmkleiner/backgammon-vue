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
const gameBoard = () => import("./game-board")
const infoSection = () => import("./info-section")
const soldier = () => import("./soldier")
const msgCmp = () => import("./msg-cmp")
const ioClient = () => import("socket.io-client")

export default {
  name: "appBoard",
  components: {
    gameBoard,
    soldier,
    infoSection,
    msgCmp
  },
  methods: {},
  computed: {
    cells() {
      return this.$store.getters.cells;
    },
    currTurn() {
      return this.$store.getters.currTurn;
    },
    isWinner() {
      return this.winner === this.userColor;
    },
    userColor() {
      return this.$store.getters.loggedInUserColor;
    },
    winner() {
      return this.$store.getters.winner;
    },
    mars() {
      return this.$store.getters.isMars;
    },
    turkishMars() {
      return this.$store.getters.isTurkishMars;
    },
    noPossibleMoves() {
      return this.$store.getters.noPossibleMoves;
    },
    showMsg() {
      return this.winner || this.noPossibleMoves;
    },
    msg() {
      if (!this.showMsg) return;
      if (this.noPossibleMoves) return "No Possible Moves";
      if (this.winner && this.turkishMars)
        return this.isWinner
          ? "you won! turkish mars!"
          : "you lost! turkish mars!";
      if (this.winner && this.mars)
        return this.isWinner ? "you won! mars!" : "you lost! mars!";
      if (this.winner) return this.isWinner ? "you won!" : "you lost!";
    }
  },
  created() {
    this.$store.dispatch({ type: "setBoard" });
    const room = 1;
    this.$socket.emit("clientGameJoined", room);
    this.$store.commit("setChoosingColors");
  },
  sockets: {
    serverUserJoined() {
      const room = 1;
      this.$socket.emit("clientAlreadyHere", room);
      this.$store.commit("setTwoPlayersConnected");
    },
    serverSomeoneAlreadyHere() {
      this.$store.commit("changeMyColor");
      this.$store.commit("setTwoPlayersConnected");
    },
    serverSoldierMoved({ soldierId, targetCell, cells, isEating }) {
      this.$store.dispatch({
        type: "setBoard",
        soldierId,
        targetCell,
        cells,
        isEating
      });
    },
    serverGameEnded(winner) {
      this.$store.commit({ type: "endGame", winner });
    },
    serverIsMars() {
      this.$store.commit({ type: "setMars", isMars: true });
    },
    serverIsTurkishMars() {
      this.$store.commit({ type: "setTurkishMars", isTurkishMars: true });
    },
    serverRestartGame() {
      this.$store.dispatch({ type: "restartGame", isTurkishMars: true });
    }
  },
  watch: {
    winner: function(newVal, oldVal) {
      if (newVal) {
        const room = 1;
        const winner = newVal;
        this.$socket.emit("clientEndGame", room, winner);
      }
    },
    mars: function(newVal) {
      if (newVal) {
        const room = 1;
        this.$socket.emit("clientMars", room);
      }
    },
    turkishMars: function(newVal) {
      if (newVal) {
        const room = 1;
        this.$socket.emit("clientTurkishMars", room);
      }
    }
  }
};
</script>

<style scoped lang='scss'>
</style>
