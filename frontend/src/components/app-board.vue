<template>
  <section class="app-board">
    <MoonLoader v-if="loading"></MoonLoader>
    <div v-if="!loading" class="flex flex-row">
      <game-board v-if="cells" :cells="cells"></game-board>
      <info-section></info-section>
    </div>
  </section>
</template>

<script>
import gameBoard from './game-board'
import infoSection from './info-section'
import soldier from './soldier'
import ioClient from "socket.io-client";
import { MoonLoader } from '@saeris/vue-spinners'

export default {
  name: 'appBoard',
  components: {
    gameBoard,
    soldier,
    infoSection,
    MoonLoader
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
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.loading = false
  },
  created() {
    this.$store.dispatch({type: 'setBoard'})
    const room = 1
    this.$socket.emit("clientGameJoined", room);
    this.$store.commit('setChoosingColors')
    
  },
  sockets: {
    serverUserJoined() {
      const room = 1
      this.$socket.emit("clientAlreadyHere", room);
      this.$store.commit('setTwoPlayersConnected')
    },
    serverSomeoneAlreadyHere() {
      this.$store.commit('changeMyColor')
      this.$store.commit('setTwoPlayersConnected')
    },
    serverMovedSoldier({cells,isEating}) {
      this.$store.dispatch({type: 'setBoard', cells, isEating})
    },
    serverGameEnded(winner) {
      this.$store.commit({type: 'endGame', winner})
    },
    serverIsMars() {
      this.$store.commit({type: 'setMars', isMars: true})
    },
    serverIsTurkishMars() {
      this.$store.commit({type: 'setTurkishMars', isTurkishMars: true})
    },
    serverRestartGame() {
      this.$store.dispatch({type: 'restartGame', isTurkishMars: true})
    }
    
  },
  watch: {
    winner: function(newVal, oldVal) {
      if (newVal) {
        const room = 1
        const winner = newVal
        this.$socket.emit('clientEndGame',room,winner)
      }
    },
    mars: function(newVal) {
      if (newVal) {
        const room = 1
        this.$socket.emit('clientMars',room)
      }
    },
    turkishMars: function(newVal) {
      if (newVal) {
        const room = 1
        this.$socket.emit('clientTurkishMars',room)
      }
    }

  }
}
</script>

<style scoped lang="scss">
  
</style>
