<template>
  <section class="aside-cmp">
    <div 
      class="btn-wrapper" 
      :class="{'fully-open': isChatFullyOpen, 'input-focus': isInputFocus}"
    >
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
        v-if="loggedInUser.userName && isChatFullyOpen && !isInputFocus"
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
      isChatOpen: false,
      isChatFullyOpen: false,
      isLoginOpen: false,
      isSignupOpen: false
    };
  },
  methods: {
    closeChat() {
      this.isChatOpen = false;
      this.isChatFullyOpen = false;
      setTimeout(() => (this.isChatFullyOpen = false), 1000);
      this.isLoginOpen = false;
      this.isSignupOpen = false;
      this.$store.commit({ type: "setShowNotification", value: false });
      this.$router.push("/");
    },
    openChat() {
      setTimeout(() => (this.isChatFullyOpen = true), 1000);
      this.isChatOpen = true;
      this.isLoginOpen = false;
      this.isSignupOpen = false;

      this.$store.commit({ type: "setShowNotification", value: false });
      this.$router.push("/chat");
    },
    logout() {
      userService.firebaseLogOut();
      this.$store.dispatch({
        type: "setLoggedInUser",
        user: { userName: "", pic: "", _id: "" }
      });
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    showNotification() {
      return this.$store.getters.showNotification;
    },
    isInputFocus() {
      return this.$store.getters.isInputFocus;
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
  position: absolute;
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
  &.input-focus {
    width: unset;
    background-color: transparent;

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
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.3s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
