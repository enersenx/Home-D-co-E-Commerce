<template>
    <div class="page-log-in">
        <div class="columns">
            <div class="column is-4 is-offset-4">
                <h1 class="title">Log in</h1>

                <form @submit.prevent="submitForm">
                    <div class="field">
                        <label>Username</label>
                        <div class="control">
                            <input type="text" class="input" v-model="username">
                        </div>
                    </div>

                    <div class="field">
                        <label>Password</label>
                        <div class="control">
                            <input type="password" class="input" v-model="password">
                        </div>
                    </div>

                    <div class="notification is-danger" v-if="errors.length">
                        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-dark">Log in</button>
                        </div>
                    </div>

                    <hr>

                    Or <router-link to="/sign-up">click here</router-link> to sign up!
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'LogIn',
    data() {
        return {
            username: '',
            password: '',
            errors: []
        }
    },
    mounted() {
        document.title = 'Log In | Home Deco'
    },
    methods: {
        async submitForm() {

            //loading
            this.$store.commit('setIsLoading', true)

            //in case there are auths from an earlier session
            axios.defaults.headers.common["Authorization"] = ""
            localStorage.removeItem("token")



            const formData = {
                username: this.username,
                password: this.password
            }
            await axios
            //from djoser
                .post("/api/v1/token/login/", formData)
                .then(response => {
                    //get token from response
                    const token = response.data.auth_token
                    //set token by calling mutation
                    this.$store.commit('setToken', token)
                    
                    //set header for requests
                    axios.defaults.headers.common["Authorization"] = "Token " + token
                    //store token in local storage (browser)
                    //This means that the token value will persist even if the user refreshes the page or closes the browser, as long as it is not cleared from the localStorage by the user or the application.
                    localStorage.setItem("token", token)
                    //got to the path we are coming from
                    //or go to the cart
                    // const toPath = this.$route.query.to || '/cart'
                    // this.$router.push(toPath)
                })
                .catch(error => {
                    if (error.response) {
                        for (const property in error.response.data) {
                            this.errors.push(`${property}: ${error.response.data[property]}`)
                        }
                    } else {
                        this.errors.push('Something went wrong. Please try again')
                        
                        console.log(JSON.stringify(error))
                    }
                })
                await axios
                    .get('/api/v1/users/me')
                    .then(response => {
                        //set user by calling mutation
                        this.$store.commit('setUser', {'id': response.data.id, 'username': response.data.username})
                        //set user by calling mutation
                        this.$store.commit('setUser', token)

                        localStorage.setItem('username', response.data.username)
                        localStorage.setItem('userid', response.data.id)


                        
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    await axios
                .get(`/api/v1/superuser/${this.$store.state.user.id}/`)
                    .then(response => {
                    const userInfo = response.data
                    // add any other user attributes you want to use
                    console.log("get current superuser")
                    console.log(response.data)
                    
                    //localStorage.setItem('is_superuser', response.data.is_superuser)

                    if(response.data.is_superuser){
                        this.$router.push('/admin/dashboard')
                    }else{
                        //go to the path we are coming from
                        //or go to the cart
                        const toPath = this.$route.query.to || '/'
                        this.$router.push(toPath)
                    }
                    

                    })
                    .catch(error => {
                    console.log(error)
                })
            //finished loading
            this.$store.commit('setIsLoading', false)
        }
    }
}
</script>