<template>
  <section class="aside-cmp">
    <div class="btn-wrapper" :class="{'fully-open': isChatFullyOpen}">

      <button class="open-btn" v-if="isAsideOpen" @click="closeChat">
        <i class="far fa-times-circle"></i>
      </button>
      <button class="open-btn" v-else @click="openChat">
        <i class="far fa-comments"></i>
      </button>
      <div class="msg-notification" v-if="showNotification && !isAsideOpen">
        <i class="fas fa-envelope"></i>
      </div>
      <router-link
              class="white-text-btn"
              v-if="isChatFullyOpen && !loggedInUser.userName && !isInputFocus"
              to="/signup"
      >Signup</router-link>
      <router-link
              class="white-text-btn"
              v-if="isChatFullyOpen && !loggedInUser.userName && !isInputFocus"
              to="/login"
      >Login</router-link>
      <button
              class="white-text-btn"
              v-if="loggedInUser.userName && isChatFullyOpen"
              @click="logout"
      >Logout</button>
    </div>


    <transition name="slide">
      <keep-alive>
      <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
const loginCmp = () => import("./login-cmp");
const signupCmp = () => import("./signup-cmp");
const chatCmp = () => import("./chat-cmp");
import userService from "../services/user.service.js";
export default {
  components: {
    chatCmp,
    loginCmp,
    signupCmp
  },
  data() {
    return {
      isLoginOpen: false,
      isChatOpen: false,
      isChatFullyOpen: false,
      isSignupOpen: false,
      showNotification: false,
      isInputFocus: false
    };
  },
  methods: {
    logout() {
      userService.firebaseLogOut();
      this.$store.dispatch({
        type: "setLoggedInUser",
        user: { userName: "", pic: "", _id: "" }
      });
    },
    closeChat() {
      this.isChatOpen = false;
      this.isChatFullyOpen = false;
      setTimeout(() => (this.isChatFullyOpen = false), 1000);
      this.isLoginOpen = false;
      this.isSignupOpen = false;
      this.showNotification = false;
      this.$router.push("/");
    },
    openChat() {
      this.isChatOpen = true;
      setTimeout(() => (this.isChatFullyOpen = true), 1000);
      this.isLoginOpen = false;
      this.isSignupOpen = false;
      this.showNotification = false;
      this.$router.push("/chat");
    },
    doShowNotification() {
      this.showNotification = true;
    },
    openSignup() {
      this.isSignupOpen = true;
      this.isLoginOpen = false;
      this.isChatOpen = false;
      this.isChatFullyOpen = false;
    },
    // openLogin() {
    //   this.isLoginOpen = true;
    //   this.isChatOpen = false;
    //   this.isChatFullyOpen = false;
    //   this.isSignupOpen = false;
    //   this.showNotification = false;
    // },
    closeLogin() {
      this.isChatOpen = true;
      this.isLoginOpen = false;
      this.$router.push("/");
    },
    // closeSignup() {
    //   this.isChatOpen = true;
    //   this.isSignupOpen = false;
    //   this.$router.push("/");
    // },
    // closeAside() {
    //   this.isChatOpen = false;
    //   this.isChatFullyOpen = false;
    //   this.isSignupOpen = false;
    //   this.isLoginOpen = false;
    //   this.showNotification = false;
    //   this.$router.push("/");
    // },
    toggleInputFocus() {
      this.isInputFocus = !this.isInputFocus;
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    isAsideOpen() {
      return this.isLoginOpen || this.isChatOpen || this.isSignupOpen;
    }
  },
  watch: {
    $route(to, from) {
      switch (to.path) {
        case "/":
          this.closeChat();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-wrapper {
  position: fixed;
  z-index: 11;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  &.fully-open {
    background-color: black;
    padding: 0 10px;
    border-radius: 40px;
    width: 320px;
  }
  .open-btn {
    position: relative;
    padding: 10px;
    background-color: black;
    color: white;
    border-radius: 50%;
    border: none;
    outline: 0;
    font-size: 18px;
    cursor: pointer;
    &.input-focus {
      visibility: hidden;
      @media (min-width: 850px) {
        visibility: visible;
      }
    }
  }
  .msg-notification {
    color: lighten(#25d366, 10%);
    position: absolute;
    top: 28px;
    left: 28px;
  }
  .white-text-btn {
    background-color: transparent;
    color: white;
    border: none;
    font-weight: 700;
    font-size: 1.2rem;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    text-decoration: none;
    /*@media (min-width: 850px) {*/
      /*margin-right: calc(18.4vw - 50px);*/
    /*}*/
    /*margin-right: calc(100vw - 200px);*/
  }
}


.fade-enter-active, .fade-leave-active {
  transition: .3s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}


.slide-leave-active, .slide-enter-active {
  transition: 1s;
  /*z-index: 11;*/
}

.slide-enter, .slide-leave-to {
  transform: translateX(100%);
  /*z-index: 11;*/
}
</style>
