<template>
  <section class="signup-card-wrapper">
    <form
      @submit.prevent="submitNewUser"
      class="signup-form-container flex flex-column align-center"
    >
      <h1>sign up</h1>
      <input required type="text" placeholder="Full Name..." v-model="newUser.name">
      <input required type="password" placeholder="Password..." v-model="newUser.password">

      <div class="signup-button-wrapper">
        <button  class="brand-button" type="submit">Save</button>
        <router-link to="/">
          <button  class="brand-button">Back</button>
        </router-link>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      newUser: {
        name: "",
        password: "",
        // pic: '',
      },
    };
  },
  methods: {
    submitNewUser() {
      this.$store
        .dispatch({ type: "signUpUser", newUser: this.newUser })
        .then(() => {
          if (this.fromEventId) this.$router.push(`/event/${this.fromEventId}`);
          else this.$router.push("/");
        });
    }
  },
  created() {
    document.body.scrollIntoView({block: 'start'});

    this.fromEventId = this.$route.params.eventId;
  }
};
</script>

<style lang="scss" scoped>
.signup-card-wrapper {
    background-color: lighten(lightgrey, 10%);
    @media screen and (min-width: 700px) {
        padding: 30px;        
      }
}

.signup-form-container {
    border-radius: 6px;
    width: 80%;
    margin: 0 auto;
    background-color: #ddd;
    padding: 30px;
    border:1px solid darken(lightgrey, 5%);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 5px rgba(0,0,0,0.05);
}

.signup-card-user-image-container { 
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    border-radius: 50%;
}

.signup-user-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.signup-instruments label, .signup-musicPrefs label {
    font-size: 1rem;
    padding-right: 5px;
    margin: 20px;
}

.signup-button-wrapper {
    margin: 0 auto;
}


.signup-form-container input[type="text"],
.signup-form-container input[type="password"],
.signup-form-container input[type="email"],
// .signup-form-container select,
.signup-form-container textarea {
  width: 70%;
  padding: 12px;
  margin: 20px;
  border: 1px solid black;
  border-radius: 4px;
  resize: vertical;
}

.signup-form-container textarea {
    height: 50px;
    width: 70%;
    padding: 12px;
    margin: 20px;
    border: 1px solid black;
    border-radius: 4px;
    resize: vertical;
}

.signup-form-container select {
    width: 30%;
    padding: 12px;
    margin: 20px;
    border: 1px solid black;
    border-radius: 4px;
  }

  
</style>

