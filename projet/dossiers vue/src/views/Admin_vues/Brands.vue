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
            <li><router-link to="/admin/categories" class="navbar-item"><a>Categories</a></router-link></li>
            <li><router-link to="/admin/brands" class="navbar-item"><a class="is-active">Brands</a></router-link></li>
            <li><router-link to="/admin/products" class="navbar-item"><a>Products</a></router-link></li>
        </ul>
        
    </aside>
    </div>
    <div class="column">
        
            <div class="container">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <h1 class="title">Brands</h1>
                        
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

                        <router-link to="/admin/brands/add">Add Brand</router-link>
                    </div>

                    <div class="column is-12">
                        <table class="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Brand</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Created at</th>
                                    <th>Modified at</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="brand in brands"
                                    v-bind:key="brand.id">
                                        <td>{{ brand.name }}</td>
                                        <td><router-link :to="{ name: 'EditBrand', params: { id: brand.id }}" class="button is-light">Edit</router-link></td>
                                        <td><button v-on:click="deleteBrand(brand.id)" class="button is-danger">Delete</button></td>
                                        <td>{{ brand.created_at_read }}</td>
                                        <td>{{ brand.modified_at_read }}</td>

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
        name: 'Brands',
        data() {
            return {
                brands: []
            }
        },
        mounted() {
            this.getBrands()
        },
        methods: {
            async onSubmit() {
            this.$store.commit('setIsLoading', true)
            const query = this.$el.querySelector('input[name="query"]').value
            console.log(query)
            await axios
                .post('/api/v1/admin/brands/search/', {'query': query})
                .then(response => {
                    this.brands = response.data
                    console.log(this.brands)
                })
                .catch(error => {
                    console.log(error)
                })
                
            this.$store.commit('setIsLoading', false)
        },
            
            async deleteBrand(brandID) {
                this.$store.commit('setIsLoading', true)
                await axios
                    .post(`/api/v1/admin/brands/delete_brand/${brandID}/`)
                    .then(response => {
                        console.log(response.data)
                        // remove deleted brand from brands array
                        const index = this.brands.findIndex(brand => brand.id === brandID)
                        if (index !== -1) {
                            this.brands.splice(index, 1)
                        }
                        toast({
                            message: 'The brand was deleted',
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
            async getBrands() {
                //loading
                this.$store.commit('setIsLoading', true)

                await axios
                    .get('/api/v1/admin-brands/')
                    .then(response => {
                        this.brands = response.data
                        console.log(this.brands)
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