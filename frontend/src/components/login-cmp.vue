<template>
    <section 
        class="login-cmp aside-card flex justify-center animated"
        :class="{'hidden': loading,'slideOutRight': !isLoginOpen, 'slideInRight': isLoginOpen}"    
    >
            <!-- v-if="!isGoogleLogin"  -->
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
                <!-- <button class="white-text-btn" type="button" @click="isGoogleLogin = true" >Log In With Google</button> -->
            </div>
            <a @click="sorry">forgot your password?</a>
            <span class="white-text" v-if="isSorry">Sorry I can't help you.</span>
        </form>

        <!-- <form 
            v-else 
            @submit.prevent="onGoogleSubmit" 
            class="flex flex-column align-center"
        >
            <h2>Login</h2>
            <input class="border-bottom-input" required v-model="loginData.email" placeholder="email"/>
            <input class="border-bottom-input" required v-model="loginData.password" type="password" placeholder="password"/>
            <span class="white-text" v-if="isWrong">Wrong password / email address.</span>
            <div class="flex">
                <button class="white-text-btn" type="submit" >Log In</button>
            </div>
        </form> -->
    </section>
</template>

<script>
// import * as firebase from 'firebase'

export default {
    props: {
        isLoginOpen: Boolean
    },
    data() {
        return {
            loginData: {
                userName: '',
                password: '',
                // email: ''
            },
            isWrong: false,
            fromEventId: '',
            loading: true,
            isSorry: false,
            // isGoogleLogin: false
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
        // onGoogleSubmit() {
        //     const {email,password} = this.loginData
        //     const prm = firebase.auth().signInWithEmailAndPassword(email,password)
        //     prm.catch((e) => {
        //         this.isWrong = true
        //         console.log(e.message)
        //     })
        //     prm.then((res) => {
        //         this.isWrong = false
        //         this.$store.dispatch({type: 'googleLogin', loginData: {userName: email.split('@')[0], password}})
        //         .then(() => this.$emit('closeLogin'))
        //     })

        // },
        openSignup() {
            this.$emit('openSignup')
        },
        sorry() {
            this.isSorry = !this.isSorry
        }
    },
    created() {
        setTimeout(() => this.loading = false,1200)

        // firebase.auth().onAuthStateChanged(function(user) {
        // if (user) {
        //     // User is signed in.
        //     var displayName = user.displayName;
        //     var email = user.email;
        //     var emailVerified = user.emailVerified;
        //     var photoURL = user.photoURL;
        //     var isAnonymous = user.isAnonymous;
        //     var uid = user.uid;
        //     var providerData = user.providerData;
        //     console.log(user,'user')
        //     // ...
        // } else {
        //     // User is signed out.
        //     // ...
        // }
        // });
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
            .white-text-btn {
                font-size: 1.2rem;
            }
        }
}
</style>
