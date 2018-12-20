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
      <button @click="changeCells">changeCells</button>
    </footer>
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
  methods: {
    changeCells() {
      var cells = [{"id":0,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":1,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":2,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":3,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":4,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":5,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":6,"soldiers":[{"color":"black","id":2,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"black","id":3,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"black","id":4,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"black","id":5,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"black","id":6,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":true}],"isHouseOf":"black","isPossibleMove":false},{"id":7,"soldiers":[{"color":"white","id":1,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"white","id":0,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":true}],"isHouseOf":"white","isPossibleMove":false},{"id":8,"soldiers":[{"color":"black","id":7,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"black","id":8,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"black","id":9,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":true}],"isHouseOf":"black","isPossibleMove":false},{"id":9,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":10,"soldiers":[{"color":"black","id":19,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":true}],"isHouseOf":false,"isPossibleMove":false},{"id":11,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":12,"soldiers":[{"color":"white","id":10,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"white","id":11,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"white","id":12,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"white","id":13,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"white","id":14,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":true}],"isHouseOf":"white","isPossibleMove":false},{"id":13,"soldiers":[{"color":"black","id":15,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"black","id":16,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"black","id":17,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"black","id":18,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":true}],"isHouseOf":"black","isPossibleMove":false},{"id":14,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":15,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":16,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":17,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":18,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":19,"soldiers":[{"color":"white","id":23,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"white","id":24,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"white","id":25,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"white","id":26,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":true}],"isHouseOf":"white","isPossibleMove":false},{"id":20,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":21,"soldiers":[{"color":"white","id":22,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"white","id":27,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":true}],"isHouseOf":"white","isPossibleMove":false},{"id":22,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":23,"soldiers":[{"color":"white","id":21,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"white","id":20,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":true}],"isHouseOf":"white","isPossibleMove":false},{"id":24,"soldiers":[{"color":"black","id":28,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":false},{"color":"black","id":29,"possibleMoves":[],"isEaten":false,"isOut":false,"selected":false,"isLastInCell":true}],"isHouseOf":"black","isPossibleMove":false},{"id":25,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":26,"soldiers":[],"isHouseOf":false,"isPossibleMove":false},{"id":27,"soldiers":[],"isHouseOf":false,"isPossibleMove":false}]
      this.$store.dispatch({type: 'setBoard', cells})
    }
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
    this.$store.dispatch({type: 'setBoard'})
  },
  sockets: {
    connect() {
      // console.log('socket connected')
      // console.log(this)
    },
  
    movedSoldier(cells) {
      console.log('I got your msg bro.')
      // console.log(this)
      this.$store.dispatch({type: 'setBoard', cells})
    }
  },
}
</script>

<style scoped lang="scss">
  
</style>
