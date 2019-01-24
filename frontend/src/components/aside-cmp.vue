<template>
    <section class="aside-cmp">
        <div class="btn-wrapper">
            <button 
                class="white-text-btn" 
                v-if="isChatFullyOpen && !loggedInUser.userName && !isInputFocus" @click="openLogin"
            >Login</button>
            <button class="open-btn" @click="toggleAside">
                <i class="far fa-times-circle" v-if="isAsideOpen"></i>
                <i class="far fa-comments" v-else></i>
            </button>
            <div class="msg-notification" v-if="showNotification && !isChatOpen">
                <i class="fas fa-envelope"></i>
            </div>
        </div>
    <chat-cmp :isChatOpen="isChatOpen" @showNotification="doShowNotification" @onToggleInputFocus="toggleInputFocus"></chat-cmp>
    <login-cmp :isLoginOpen="isLoginOpen" @openSignup="openSignup" @closeLogin="closeLogin"></login-cmp>
    <signup-cmp :isSignupOpen="isSignupOpen" @onCloseSignup="closeSignup"></signup-cmp>
    </section>
</template>

<script>
import loginCmp from './login-cmp';
import signupCmp from './signup-cmp';
import chatCmp from './chat-cmp';
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
            isInputFocus: false,

        }
    },
    methods: {
        toggleAside() {
            // open chat or close aside
            if (this.isAsideOpen) {
                this.isChatOpen = false
                this.isChatFullyOpen = false
                this.isLoginOpen = false        
                this.isSignupOpen = false        
            } else {
                this.isChatOpen = true
                this.isLoginOpen = false        
                this.isSignupOpen = false        
                setTimeout(() => this.isChatFullyOpen = true, 900)
            }
            this.showNotification = false
        },
        doShowNotification() {
            this.showNotification = true
        },
        openSignup() {
            this.isSignupOpen = true
            this.isLoginOpen = false        
            this.isChatOpen = false
            this.isChatFullyOpen = false
        },
        openLogin() {
            this.isLoginOpen = true        
            this.isChatOpen = false
            this.isChatFullyOpen = false
            this.isSignupOpen = false
            this.showNotification = false
        },
        closeLogin() {
            this.isChatOpen = true
            this.isLoginOpen = false        
        },
        closeSignup() {
            this.isChatOpen = true
            this.isSignupOpen = false        
        },
        toggleInputFocus() {
            this.isInputFocus = !this.isInputFocus
        },
    },
    computed: {
        loggedInUser() {
            return this.$store.getters.loggedInUser
        },
        isAsideOpen() {
            return this.isLoginOpen || this.isChatOpen || this.isSignupOpen
        }
    },
}
</script>

<style lang="scss" scoped>
.btn-wrapper {
    position: fixed;
    z-index: 11;
    top: 10px;
    right: 10px;
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
        color: lighten(#25D366, 10%);
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
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        @media (min-width: 850px) {
            margin-right: calc(18.4vw - 120px);
        }
        margin-right: 100px;
    }
}
</style>
