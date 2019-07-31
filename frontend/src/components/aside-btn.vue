<template>
  <div class="btn-wrapper" :class="{'fully-open': isChatFullyOpen, 'input-focus': isInputFocus}">
    <button class="open-btn" v-if="isAsideOpen" @click="closeChat">
      <i class="far fa-times-circle"></i>
    </button>
    <button class="open-btn" v-else @click="openChat">
      <i class="far fa-comments"></i>
    </button>
    <div class="msg-notification" v-if="showNotification && !isAsideOpen">
      <i class="fas fa-envelope"></i>
    </div>

    <template v-if="isLoginShowing">
      <router-link class="white-text-btn" to="/signup">Signup</router-link>
      <router-link class="white-text-btn" to="/login">Login</router-link>
    </template>
    <template v-if="isLogoutShowing">
      <button class="white-text-btn" @click="logout">Logout</button>
      <button v-if="isRestartShowing" class="white-text-btn" @click="restartGame">Restart</button>
    </template>
  </div>
</template>
<script>
import userService from "../services/user.service.js";

export default {
  data() {
    return {
      isChatOpen: false,
      isChatFullyOpen: false,
      isLoginOpen: false,
      isSignupOpen: false
    };
  },
  methods: {
    restartGame() {
      this.$store.dispatch("restartGame");
      const room = 1;
      this.$socket.emit("clientRestartGame", room);
    },
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
    },
    isLoginShowing() {
      return (
        this.isChatFullyOpen &&
        !this.loggedInUser.userName &&
        !this.isInputFocus
      );
    },
    isLogoutShowing() {
      return (
        this.loggedInUser.userName && this.isChatFullyOpen && !this.isInputFocus
      );
    },
    isRestartShowing() {
      return (
        this.loggedInUser.userName === "Noam Kleiner" ||
        this.loggedInUser.userName === "Noam Klainer"
      );
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