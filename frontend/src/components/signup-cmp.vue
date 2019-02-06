<template>
  <section 
    class="signup-cmp aside-card animated"
    :class="{'hidden': loading,'slideOutRight': !isSignupOpen, 'slideInRight': isSignupOpen}"
  >
      <!-- v-if="!isGoogleSignUp" -->
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
      <!-- <button  class="white-text-btn" type="button" @click="isGoogleSignUp = true">Signup With Google</button> -->
    </form>

    <!-- <form 
      v-else
      @submit.prevent="submitNewGoogleUser"
      class="signup-form-container flex flex-column align-center"
    >
      <h2 class="capitalize">sign up</h2>
      <input class="border-bottom-input" required type="text" placeholder="Email" v-model="newUser.email">
      <input class="border-bottom-input" required type="password" placeholder="Password" v-model="newUser.password">
      <input @change="getFile" id="file-upload" type="file" style="display:none;">
      <button  class="white-text-btn" type="submit">Signup</button>
    </form> -->
  </section>
</template>

<script>
import userService from '../services/user.service.js';
// import * as firebase from 'firebase'

export default {
  props: {
    isSignupOpen: Boolean
  },
  data() {
    return {
      loading: true,
      // isGoogleSignUp: false,
      newUser: {
        userName: '',
        password: '',
        pic: '',
        file: '',
        // email: ''
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
    // submitNewGoogleUser() {
    //   const {email,password} = this.newUser
    //   const prm = firebase.auth().createUserWithEmailAndPassword(email,password)
    //   prm.catch(() => {
    //     console.log('problem')
    //   })
    //   prm.then(() => {
    //     console.log('no problem')
    //     // get user details
    //     //put user in store
    //     // close aside
    //   })
    // }
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
      width: calc(18.6vw + 2px);
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

