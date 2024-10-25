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
                        <h1 class="title">Categories</h1>
                        
                        <form @submit.prevent="onSubmit">
                            <div class="field has-addons">
                                <div class="control">
                                    <input type="text" class="input" placeholder="What are you looking for?" name="query">
                                </div>
                                <div class="control">
                                    <button class="button is-success">
                                        <span class="icon">
                                            <i class="fas fa-search"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>

                        <router-link to="/admin/categories/add">Add Category</router-link>
                    </div>

                    <div class="column is-12">
                        <table class="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Created at</th>
                                    <th>Modified at</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="category in categories"
                                    v-bind:key="category.id">
                                        <td>{{ category.name }}</td>
                                        <td><router-link :to="{ name: 'EditCategory', params: { id: category.id }}" class="button is-light">Edit</router-link></td>
                                        <td><button v-on:click="deleteCategory(category.id)" class="button is-danger">Delete</button></td>
                                        <td>{{ category.created_at_read }}</td>
                                        <td>{{ category.modified_at_read }}</td>

                                </tr>
                            </tbody>
                        </table>
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
        name: 'Categories',
        data() {
            return {
                categories: []
            }
        },
        mounted() {
            this.getCategories()
        },
        methods: {
            async onSubmit() {
            this.$store.commit('setIsLoading', true)
            const query = this.$el.querySelector('input[name="query"]').value
            console.log(query)
            await axios
                .post('/api/v1/admin/categories/search/', {'query': query})
                .then(response => {
                    this.categories = response.data
                    console.log(this.categories)
                })
                .catch(error => {
                    console.log(error)
                })
                
            this.$store.commit('setIsLoading', false)
        },
            async deleteCategory(categoryID) {
                this.$store.commit('setIsLoading', true)
                await axios
                    .post(`/api/v1/admin/categories/delete_category/${categoryID}/`)
                    .then(response => {
                        console.log(response.data)
                        const index = this.categories.findIndex(category => category.id === categoryID)
                        if (index !== -1) {
                            this.categories.splice(index, 1)
                        }
                        toast({
                            message: 'The category was deleted',
                            type: 'is-success',
                            dismissible: true,
                            pauseOnHover: true,
                            duration: 2000,
                            position: 'bottom-right',
                        })
                    })
                    .catch(error => {
                        console.log(error)
                    })
                this.$store.commit('setIsLoading', false)
            },
            async getCategories() {
                //loading
                this.$store.commit('setIsLoading', true)

                await axios
                    .get('/api/v1/admin-categories/')
                    .then(response => {
                        this.categories = response.data
                        console.log(this.categories)
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