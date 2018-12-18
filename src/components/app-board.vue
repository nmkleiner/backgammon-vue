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
    <footer></footer>
  </section>
</template>

<script>
import gameBoard from './game-board'
import dicesSection from './dices-section'
import soldier from './soldier'
export default {
  name: 'appBoard',
  components: {
    gameBoard,
    dicesSection,
    soldier
  },
  computed: {
    cells() {
      return this.$store.getters.cells
    },
    currTurn() {
      return this.$store.getters.currTurn
    } 
  },
  created() {
    this.$store.commit('setCells')
    this.$store.commit('setSoldiers')
  },
}
</script>

<style scoped lang="scss">
  
</style>
