<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import soundService from './services/sound.service.js';

export default {
  mounted() {
    soundService.load()    
  },
}
</script>
<style lang="scss" scoped>

</style>

