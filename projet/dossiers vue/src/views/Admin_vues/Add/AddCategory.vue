<template>
    
    <div class="columns">
        <div class="column is-one-fifth">
            <aside class="menu sticky">
        <p class="menu-label">
            General
        </p>
        <ul class="menu-list">
            <li><router-link to="/admin/dashboard" class="navbar-item"><a>Dashboard</a></router-link></li>
            <li><router-link to="/admin/sale" class="navbar-item"><a>Sale</a></router-link></li>
             
        </ul>
        <p class="menu-label">
            Administration
        </p>
        <ul class="menu-list">
            <li><router-link to="/admin/categories" class="navbar-item"><a class="is-active">Categories</a></router-link></li>
            <li><router-link to="/admin/brands" class="navbar-item"><a>Brands</a></router-link></li>
            <li><router-link to="/admin/products" class="navbar-item"><a>Products</a></router-link></li>
        </ul>
        
    </aside>
    </div>
    <div class="column">

    <div class="container">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Add Category</h1>
            </div>

            

            <div class="column is-12">
                <form  @submit.prevent="submitForm">
                    
                    
                    
                    <div class="field">
                        <label>Name</label>
                        <div class="control">
                            <input type="text" class="input" v-model="name">
                        </div>
                    </div>

                    <div class="notification is-danger" v-if="errors.length">
                        <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                    </div>
                    
                    <div class="field">
                        <div class="control">
                            <button class="button is-success">Submit</button>
                        </div>
                    </div>
                    

                    
                </form>
            </div>
        </div>
    </div>
</div>
</div>
</template>

<script>
    import axios from 'axios'
    import { toast } from 'bulma-toast'
    
    export default {
        name: 'AddCategory',
        data() {
            return {
                name: '',
                errors: []
                
            }
        },
        methods: {

            
            
            async submitForm() {
                //loading
                this.$store.commit('setIsLoading', true)

                this.errors = []

                console.log(this.name)
                if (this.name == '') {
                    this.errors.push('name is empty')
                }
                this.$store.commit('setIsLoading', false)

                if (!this.errors.length) {
                    //if there are no errors
                    //push information to the server
                this.$store.commit('setIsLoading', true)

                let formData = new FormData()
                formData.append('name', this.name)

                await axios
                    .post('/api/v1/admin-categories/', formData)
                    .then(response => {
                        console.log(response)
                        toast({
                            message: 'The category was added',
                            type: 'is-success',
                            dismissible: true,
                            pauseOnHover: true,
                            duration: 2000,
                            position: 'bottom-right',
                        })
                        this.$router.push('/admin/categories')
                    })
                    .catch(error => {
                        console.log(error)
                    })

                //finished loading
                this.$store.commit('setIsLoading', false)
            }
        }
        }
    }
</script>