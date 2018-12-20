<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view/>
  </div>
</template>

<script>
import appBoard from './components/app-board.vue'
import navBar from './components/nav-bar.vue'
export default {
 components: {
   navBar
  },
 created() {
  this.$store.dispatch('getLoggedInUser')
 },
}
</script>
