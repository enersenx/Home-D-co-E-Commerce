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
                <h1 class="title">Edit - {{ category.name }}</h1>
            </div>

            

            <div class="column is-12">
                <form  @submit.prevent="submitForm">
                    
                    
                    
                    <div class="field">
                        <label>Name</label>
                        <div class="control">
                            <input type="text" class="input" v-model="category.name">
                        </div>
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
                category: {},
                
            }
        },
        mounted() {
            this.getCategory()
        },
        methods: {
            async getCategory() {
                //loading
                this.$store.commit('setIsLoading', true)
                const categoryID = this.$route.params.id
                await axios
                    .get(`/api/v1/admin-categories/${categoryID}/`)
                    .then(response => {
                        this.category = response.data
                    })
                    .catch(error => {
                        console.log(error)
                    })
                //finished loading
                this.$store.commit('setIsLoading', false)
            },
            async submitForm() {
                //loading
                this.$store.commit('setIsLoading', true)
                const categoryID = this.$route.params.id

                let formData = new FormData()
                formData.append('name', this.category.name)

                await axios
                    .patch(`/api/v1/admin-categories/${categoryID}/`, formData)
                    .then(response => {
                        console.log(response)
                        toast({
                            message: 'The category was updated',
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
</script>