<template>
  <section
    class="login-cmp aside-card"
  >
    <form @submit.prevent="onSubmit" class="flex flex-column align-center">
      <h2>Login</h2>
      <input
        class="border-bottom-input"
        required
        v-model="loginData.userName"
        placeholder="username"
      >
      <input
        class="border-bottom-input"
        required
        v-model="loginData.password"
        type="password"
        placeholder="password"
      >
      <span class="white-text" v-if="isWrong">Wrong password / username.</span>
      <div class="flex">
        <button class="white-text-btn" type="submit">Log In</button>
        <button class="white-text-btn" type="button" @click="openSignup">Sign Up</button>
        <button class="white-text-btn" type="button" @click="signUp('google')">
          <i class="fab fa-google"></i> Login
        </button>
        <button class="white-text-btn" type="button" @click="signUp('facebook')">
          <i class="fab fa-facebook-square"></i> Login
        </button>
      </div>
      <a @click="sorry">forgot your password?</a>
      <span class="white-text" v-if="isSorry">Sorry I can't help you.</span>
    </form>
  </section>
</template>

<script>
import userService from '../services/user.service';

export default {
  props: {
    isLoginOpen: Boolean
  },
  data() {
    return {
      loginData: {
        userName: "",
        password: ""
      },
      isWrong: false,
      fromEventId: "",
      loading: true,
      isSorry: false,
      gProvider: "",
      fProvider: ""
    };
  },
  methods: {
    async onSubmit() {
      const user = await this.$store.dispatch({
        type: "login",
        loginData: this.loginData
      });
      if (!user) this.isWrong = true;
      else {
        this.isWrong = false;
        this.$emit("closeLogin");
      }
    },
    openSignup() {
      this.$emit("openSignup");
    },
    sorry() {
      this.isSorry = !this.isSorry;
    },
    signUp(authenticator) {
      const provider =
        authenticator === "google" ? this.gProvider : this.fProvider;
        userService.firebaseLogin(provider)
    },
  },
  created() {
    setTimeout(() => (this.loading = false), 1200);

    this.gProvider = userService.getGProvider()
    this.fProvider = userService.getFProvider()
    userService.firebaseOnAuthStateChanged(this.$store,this.$emit.bind(this))
  }
};
</script>

<style lang="scss">
.login-cmp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  @media (min-width: 850px) {
    width: 340px;
    height: calc(400px + 65px + 66px);
  }
  form {
    height: fit-content;
    h2 {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
    a {
      font-size: 0.8rem;
      color: gray;
      cursor: pointer;
    }
    input,
    button {
      margin: 10px 10px 10px;
    }
    .white-text-btn {
      border: 2px solid white;
      padding: 10px;
      border-radius: 10px;
      transition: 0.2s;
      margin: 10px 5px;
      &:hover {
        background-color: #167c3c;
      }
    }
  }
}
</style>
