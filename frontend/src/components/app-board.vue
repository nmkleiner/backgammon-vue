<template>
  <section class="app-board">
    <!-- <header class="flex justify-center align-center p-10">
      <h2 class="mx-20" :style="{'color': currTurn}">Current Turn</h2>
      <soldier :color="currTurn"></soldier>
    </header> -->
    <div class="flex flex-row">
      <game-board v-if="cells" :cells="cells"></game-board>
      <info-section></info-section>
    </div>
    <!-- <footer>
    </footer> -->
  </section>
</template>

<script>
import gameBoard from './game-board'
import infoSection from './info-section'
import soldier from './soldier'
import ioClient from "socket.io-client";


export default {
  name: 'appBoard',
  components: {
    gameBoard,
    soldier,
    infoSection,
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
    },
    mars() {
      return this.$store.getters.isMars
    },
    turkishMars() {
      return this.$store.getters.isTurkishMars
    }
    
  },
  created() {
    this.$store.dispatch({type: 'setBoard'})
    const room = 1
    this.$socket.emit("gameJoined", room);
    this.$store.commit('setChoosingColors')
    
  },
  sockets: {
    userJoined() {
      const room = 1
      this.$socket.emit("alreadyHere", room);
    },
    someoneAlreadyHere() {
      this.$store.commit('changeMyColor')
      // this.$store.commit('setChoosingColors')
    },
    movedSoldier(cells) {
      this.$store.dispatch({type: 'setBoard', cells})
    },
    gameEnded(winner) {
      this.$store.commit({type: 'endGame', winner})
    },
    isMars() {
      this.$store.commit('setMars')
    },
    isTurkishMars() {
      this.$store.commit('setTurkishMars')
    }
    
  },
  watch: {
    winner: function(newVal, oldVal) {
      if (newVal) {
        const room = 1
        const winner = newVal
        this.$socket.emit('endGame',room,winner)
      }
    },
    mars: function(newVal) {
      if (newVal) {
        const room = 1
        this.$socket.emit('mars',room)
      }
    },
    turkishMars: function(newVal) {
      if (newVal) {
        const room = 1
        this.$socket.emit('turkishMars',room)
      }
    }

  }
}
</script>

<style scoped lang="scss">
  
</style>
