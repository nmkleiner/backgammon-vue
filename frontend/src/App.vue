<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import appBoard from './components/app-board.vue'
import asideCmp from './components/aside-cmp'
import soundService from './services/sound.service.js';

export default {
 components: {
  },
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  created() {
    if (this.$router.history.current.path === '/') {
      this.$router.push('/game')
    }
  },
  mounted() {
    soundService.load()    
  },
}
</script>
<style lang="scss" scoped>

</style>

