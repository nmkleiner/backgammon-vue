<template>
    <section 
        class="login-cmp aside-card flex justify-center animated"
        :class="{'hidden': loading,'slideOutRight': !isLoginOpen, 'slideInRight': isLoginOpen}"    
    >
        <form 
            @submit.prevent="onSubmit" 
            class="flex flex-column align-center"
        >
            <h2>Login</h2>
            <input class="border-bottom-input" required v-model="loginData.userName" placeholder="username"/>
            <input class="border-bottom-input" required v-model="loginData.password" type="password" placeholder="password"/>
            <span class="white-text" v-if="isWrong">Wrong password / username.</span>
            <div class="flex">
                <button class="white-text-btn" type="submit" >Log In</button>
                <button class="white-text-btn" type="button" @click="openSignup" >Sign Up</button>
                <button class="white-text-btn" type="button" @click="signUp('google')">Google Sign In</button>
                <button class="white-text-btn" type="button" @click="signUp('facebook')">Facebook Sign In</button>

            </div>
            <a @click="sorry">forgot your password?</a>
            <span class="white-text" v-if="isSorry">Sorry I can't help you.</span>
        </form>
    </section>
</template>

<script>
import * as firebase from 'firebase'

export default {
    props: {
        isLoginOpen: Boolean
    },
    data() {
        return {
            loginData: {
                userName: '',
                password: '',
            },
            isWrong: false,
            fromEventId: '',
            loading: true,
            isSorry: false,
            gProvider: '',
            fProvider: ''
        }
    },
    methods: {
        async onSubmit() {
            const user = await this.$store.dispatch({type: 'login', loginData: this.loginData})
            if (!user) this.isWrong = true
            else {
                this.isWrong = false
                this.$emit('closeLogin')
            }
        },
        openSignup() {
            this.$emit('openSignup')
        },
        sorry() {
            this.isSorry = !this.isSorry
        },
        signUp(authenticator) {
            const provider = authenticator === 'google'? this.gProvider : this.fProvider
            console.log('provider',provider)
            firebase.auth().signInWithPopup(provider)
            .then((result) => {
                console.log('res',result)
                var token = result.credential.accessToken;
                var user = result.user;
            })
            .catch(function(error) {
                var errorCode = error.code;
                console.error(errorCode)
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
            });
        },
        fbSignUp() {
            firebase.auth().sign
        }
    },
    created() {
        setTimeout(() => this.loading = false,1200)

        this.gProvider = new firebase.auth.GoogleAuthProvider();
        this.fProvider = new firebase.auth.FacebookAuthProvider();

        firebase.auth().onAuthStateChanged((user) => {
            console.log('auth changed')
        if (user) {
            var userName = user.displayName;
            var pic = user.photoURL;
            var _id = user.uid;
            this.$store.commit({type :'setLoggedInUser', user: {userName,pic,_id}})
            this.$emit('onLogin')

        } else {

        }
        });
    }
}
</script>

<style lang="scss">
    .login-cmp{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        @media (min-width: 850px) {
            height: unset;
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
            input,button {
                margin: 10px 10px 10px;
            }
        }
}
</style>
