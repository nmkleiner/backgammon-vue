<template>
    <div class="nav-bar flex space-between">
        <router-link class="logo" to="/">backGammon</router-link>
        <div class="links">
          <el-button round @click="goEdit" v-if="isLoggedInUser" to="/event/edit">
            Create <i class="fas fa-plus"></i>
          </el-button>
          <img v-if="loggedInUser" @click="goProfile" class="circle-icon-sm" :src="loggedInUser.pic"/>
          <router-link class="" v-if="isLoggedInUser" :to="'/user/' + loggedInUser._id">
            Profile
          </router-link>
          <a v-if="isLoggedInUser" @click="logout">Logout</a>
          <router-link v-else to="/login">Login</router-link>
        </div>

        <a @click="setIsOpen" class="icon" :class="{'open': isOpen, 'guest': !isLoggedInUser}">
          <i class="fa fa-bars"></i>
        </a>

        <aside class="flex flex-column" :class="{'open': isOpen, 'guest': !isLoggedInUser}">
          <a v-if="isLoggedInUser" @click="logout">Logout</a>
          
          <div class="flex align-center profile-wrapper" v-if="isLoggedInUser">
            <img @click="goProfile" class="circle-icon-sm" :src="loggedInUser.pic"/>
            <a @click="goProfile">
              Profile
            </a>
          </div>

          <a v-else @click="goLogin">Login</a>
          <el-button round @click="goEdit" v-if="isLoggedInUser" to="/event/edit">
            Create <i class="fas fa-plus"></i>
          </el-button>
        </aside>
    </div>
</template>

<script>
export default {
    data(){
        return {
            isOpen: false
        }
    },
    methods: {
        goProfile() {
          this.isOpen = false
          this.$router.push(`/user/${this.loggedInUser._id}`)
        },
        setIsOpen(){
          return this.isOpen = !this.isOpen;
        },
        logout() {
          this.isOpen = false
          this.$store.dispatch({type: 'logout'})
          .then(() => {this.$router.push('/')})
        },
        goEdit() {
          this.isOpen = false
          this.$router.push('/event/edit')
        },
        goLogin() {
          this.isOpen = false
          this.$router.push('/login')
        }
    },
    computed: {
      isLoggedInUser() {
        return this.$store.getters.isLoggedInUser
      },
      loggedInUser() {
        return this.$store.getters.loggedInUser
      }
    }
};
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Montserrat');

.nav-bar {
  font-family: 'Montserrat', sans-serif;  
  overflow: hidden;
  background-color: black;
  position: fixed;
  width: 100%;
  z-index: 10;
  top: 0px;
  border-bottom: 1px solid black;
  .circle-icon-sm {
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }

  .el-button{
      background-color: black;
      border: 1px solid rgb(144, 241, 241);
    margin: 0 20px;

      span{
          color: rgb(144, 241, 241);
      }
  }
  a {
    // display: block;
    color: rgb(144, 241, 241);
    text-align: center;
    padding: 7px 20px;
    text-decoration: none;
    font-size: 17px;
    border-bottom: 1px solid transparent;
    cursor: pointer;
    transition: .3s;
    
  }
  img {
    cursor: pointer; 
    width: 50px;
    height: 50px;
  }
  a:hover {
    border-bottom: 1px solid rgb(144, 241, 241);
  }
  .logo {
    font-size: 25px;
    &:hover {
      border-bottom: 1px solid transparent;
    }

  }
  .links{
    display: flex;
    align-items: center;
  }
  .links a:last-child{
    margin-right: 20px;
  }
  .icon {
    display: none;
  }
  aside{
    position: fixed;
    right: -100%;
  }
  &.guest{
    position: absolute;
    top: 0;
    left: 0;
    .logo:hover {
      border-bottom: 1px solid transparent;
    }
  }
}

@media screen and (max-width: 730px) {
  .nav-bar {
    .el-button, .circle-icon-sm {
      display: none;
    }
    a:not(.logo) {
      display: none;
    }
    a.icon {
      float: right;
      display: block;
      border: 1px solid transparent;
      &.open {
        transform: rotateZ(90deg);
      }
    }
    &.guest {
      a.icon{ 
        display: none;
      }
      a{
        display: inline;
      }
    } 
    aside{
    background-color: black;
    display: flex;
    position: fixed;
    padding: 0 20px;
    right: -30vw;
    top: 50px;
    height: calc(100vh - 50px);
    transition: .8s ease-in-out;
    .profile-wrapper {
        border: 1px solid transparent;
        a{
          border: none;

        }
      &:hover{
        border-bottom: 1px solid rgb(144, 241, 241);
      }
    }
      &.open{
        transform: translateX(-30vw);
        .el-button, .circle-icon-sm, a {
          display: block;
        }
      }
    } 
  }
  .nav-bar.open {position: fixed;}
  .nav-bar.open .icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  .logo {
    display: flex;
    align-items: center;
    img {
      height: 30px;
      display: inline-block;
    }
  }
}
</style>
