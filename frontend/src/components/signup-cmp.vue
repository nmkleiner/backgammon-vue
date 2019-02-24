<template>
  <section 
    class="signup-cmp aside-card animated"
    :class="{'hidden': loading,'slideOutRight': !isSignupOpen, 'slideInRight': isSignupOpen}"
  >
    <form
      @submit.prevent="submitNewUser"
      class="signup-form-container flex flex-column align-center"
    >
      <h2 class="capitalize">sign up</h2>
      <input class="border-bottom-input" required type="text" placeholder="Full Name" v-model="newUser.userName">
      <input class="border-bottom-input" required type="password" placeholder="Password" v-model="newUser.password">
      <label class="white-text-btn mb-10" for="file-upload">
        <input @change="getFile" id="file-upload" type="file" style="display:none;">
        Choose Profile Picture
      </label>
      <button  class="white-text-btn" type="submit">Signup</button>
    </form>
  </section>
</template>

<script>
import userService from '../services/user.service.js';

export default {
  props: {
    isSignupOpen: Boolean
  },
  data() {
    return {
      loading: true,
      newUser: {
        userName: '',
        password: '',
        pic: '',
        file: '',
      },
    };
  },
  methods: {
    async submitNewUser() {
      await this.$store.dispatch({ type: "signUpUser", newUser: this.newUser })
      await this.$store.dispatch({type: 'login', loginData: this.newUser})
      this.$emit('onCloseSignup')
    },
    getFile(ev) {
      this.newUser.file = ev.target.files[0]
    },
  },
  created() {
    setTimeout(() => this.loading = false,1200)
  }
};
</script>

<style lang="scss" scoped>
.signup-cmp {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    @media (min-width: 850px) {
      width: 340px;
      height: calc(400px + 65px + 66px);
    }
    width: 100vw;
    label {
      font-size: 10px;
    }
    h2 {
        font-size: 1.5rem;
        margin-bottom: 10px;
    }
    .white-text-btn {
      font-size: 1.2rem;
      margin-top: 10px;
    }
}

.signup-button-wrapper {
    margin: 0 auto;
}


.signup-form-container input {
  margin: 10px 0;
}
</style>

