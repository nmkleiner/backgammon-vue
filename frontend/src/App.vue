<template>
  <div id="app">
    <button @click="toggleModal" class="animated shake">
      <i class="fas fa-info-circle"></i>
    </button>
    <div class="modal animated" :class="{'hidden': !isOpenModal, 'bounce': isOpenModal}">
      <button @click="toggleModal">
        X
      </button>
      Hi, refresh and open the app in two windows to witness the full power.
    </div>
    <nav-bar></nav-bar>
    <router-view/>
  </div>
</template>

<script>
import appBoard from './components/app-board.vue'
import navBar from './components/nav-bar.vue'
import soundService from './services/sound.service.js';
export default {
 components: {
   navBar
  },
  data() {
    return {
      isOpenModal: false,
    }
  },
  methods: {
    toggleModal() {
      this.isOpenModal = !this.isOpenModal
    }
  },
  created() {
    this.$store.dispatch('getLoggedInUser')
  },
  mounted() {
    soundService.load()    
  },
}
</script>
<style lang="scss" scoped>
#app {
  button {
    @media (min-width: 850px) {
      position: absolute;
      display: block;
      right: 0;
      top: 0;
      font-size: 1.5rem;
      color: white;
      background-color: black;
      border: 2px solid lighten(#000000, 20%);
    cursor: pointer;
    }
    display: none;
  }
  .modal {
    @media (min-width: 850px) {
      display: flex;
      flex-direction: column;
      font-size: 1.5rem;
      transition: .3s;
      padding: 10px;
      background-color: #fff;
      border: 3px solid black;
      position: absolute;
      left: 45vw;
      width: 16vw;
      top: 0;
      z-index: 4;
      button {
        align-self: flex-end;
      }
    }
    display: none;
  }
}
</style>

