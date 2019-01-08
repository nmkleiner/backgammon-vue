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
    this.$socket.emit("gameJoined", room);
    this.$store.commit('setChoosingColors')
    
  },
  sockets: {
    userJoined() {
      const room = 1
      this.$socket.emit("alreadyHere", room);
      this.$store.commit('setTwoPlayersConnected')
    },
    someoneAlreadyHere() {
      this.$store.commit('changeMyColor')
      this.$store.commit('setTwoPlayersConnected')
    },
    movedSoldier({cells,isEating}) {
      this.$store.dispatch({type: 'setBoard', cells, isEating})
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
