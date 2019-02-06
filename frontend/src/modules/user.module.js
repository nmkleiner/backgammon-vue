import userService from '@/services/user.service.js'

export default ({
    state: {
    },
    mutations: {
        
    },
    actions: {
        async signUpUser({}, {newUser}) {
            newUser.pic = await userService.getPicUrl(newUser.file)
            delete newUser.file 
            await userService.signUpUser(newUser)
            return Promise.resolve()
        }
    },
    getters: {
        
    }
})

