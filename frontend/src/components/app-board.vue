<template>
  <section class="app-board">
    <header class="flex justify-center align-center p-10">
      <h2 class="mx-20" :style="{'color': currTurn}">Current Turn</h2>
      <soldier :color="currTurn"></soldier>
    </header>
    <div class="flex flex-row">
      <game-board v-if="cells" :cells="cells"></game-board>
      <dices-section></dices-section>
    </div>
    <footer>
    </footer>
  </section>
</template>

<script>
import gameBoard from './game-board'
import dicesSection from './dices-section'
import soldier from './soldier'
import ioClient from "socket.io-client";
// import socketService from "@/services/socket.service.js";

export default {
  name: 'appBoard',
  components: {
    gameBoard,
    dicesSection,
    soldier
  },
  methods: {
  },
  computed: {
    cells() {
      return this.$store.getters.cells
    },
    currTurn() {
      return this.$store.getters.currTurn
    },
    winner() {
      return this.$store.getters.winner
    }
    
  },
  created() {
    this.$store.dispatch({type: 'setBoard'})
    const room = 1
    this.$socket.emit("gameJoined", room);
    
  },
  sockets: {
    userJoined() {
      const room = 1
      this.$socket.emit("alreadyHere", room);
    },
    someoneAlreadyHere() {
      this.$store.commit('changeMyColor')
    },
    movedSoldier(cells) {
      this.$store.dispatch({type: 'setBoard', cells})
    },
    gameEnded(winner) {
      this.$store.commit({type: 'endGame', winner})
    }
  },
  watch: {
    winner: function(newVal, oldVal) {
      if (newVal) {
          const room = 1
          const winner = newVal
          this.$socket.emit('endGame',room,winner)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  
</style>
