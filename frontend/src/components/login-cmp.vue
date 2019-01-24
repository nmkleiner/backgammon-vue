<template>
    <section 
        class="login-cmp aside-card flex justify-center animated"
        :class="{'hidden': loading,'slideOutRight': !isLoginOpen, 'slideInRight': isLoginOpen}"    
    >
        <form @submit.prevent="onSubmit" class="flex flex-column align-center">
            <h2>Login</h2>
            <input class="border-bottom-input" required v-model="loginData.userName" placeholder="username"/>
            <input class="border-bottom-input" required v-model="loginData.password" type="password" placeholder="password"/>
            <span v-if="isWrong">Wrong password / username.</span>
            <div class="flex">
                <button class="white-text-btn" type="submit" >Login</button>
                <button class="white-text-btn" type="button" @click="openSignup" >Sign Up</button>
            </div>
            <a @click="sorry">forgot your password?</a>
            <span class="white-text" v-if="isSorry">Sorry I can't help you.</span>
        </form>
    </section>
</template>

<script>
export default {
    props: {
        isLoginOpen: Boolean
    },
    data() {
        return {
            loginData: {
                userName: '',
                password: ''
            },
            isWrong: false,
            fromEventId: '',
            loading: true,
            isSorry: false,
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
        }
    },
    created() {
        setTimeout(() => this.loading = false,1200)
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
