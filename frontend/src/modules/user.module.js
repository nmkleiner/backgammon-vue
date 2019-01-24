import userService from '@/services/user.service.js'

export default ({
    state: {
    },
    mutations: {
        
    },
    actions: {
        async signUpUser({commit}, {newUser}) {
            console.log('user module getting pic url')
            newUser.pic = await userService.getPicUrl(newUser.file)
            console.log('user module got pic url',newUser.pic,'singinguser up')
            delete newUser.file 
            await userService.signupUser(newUser)
            console.log('user module signed up user')
            return Promise.resolve()
        }
    },
    getters: {
        
    }
})

