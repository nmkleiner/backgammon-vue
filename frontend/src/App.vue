<template>
  <!-- <app-board></app-board> -->
  <div id="app">
  <router-view/>

  </div>
</template>

<script>
import appBoard from './components/app-board.vue'
export default {
 components: {

  },
 created() {
  this.$store.dispatch('getLoggedInUser')
 },
}
</script>
