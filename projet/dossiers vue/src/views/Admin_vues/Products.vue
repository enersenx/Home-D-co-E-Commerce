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
            <li><router-link to="/admin/brands" class="navbar-item"><a>Brands</a></router-link></li>
            <li><router-link to="/admin/products" class="navbar-item"><a class="is-active">Products</a></router-link></li>
        </ul>
        
    </aside>
    </div>
    <div class="column">
        
            <div class="container">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <h1 class="title">Products</h1>
                        
                        
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

                        <router-link to="/admin/products/add">Add product</router-link>
                    </div>

                    <div class="column is-12">
                        <table class="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Brand</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Price Sale</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Created at</th>
                                    <th>Modified at</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="product in products"
                                    v-bind:key="product.id">
                                        <td>{{ product.name }}</td>
                                        <td>{{ product.brand_name }}</td>
                                        <td>{{ product.category_name }}</td>
                                        <td>{{ product.price }}</td>
                                        <td>{{ product.price_sale }}</td>
                                        <td><router-link :to="{ name: 'EditProduct', params: { id: product.id }}" class="button is-light">Edit</router-link></td>
                                        <td><button v-on:click="deleteProduct(product.id)" class="button is-danger">Delete</button></td>
                                        <td>{{ product.created_at_read }}</td>
                                        <td>{{ product.modified_at_read }}</td>

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
        name: 'Products',
        data() {
            return {
                products: []
            }
        },
        mounted() {
            this.getProducts()
        },
        methods: {
            async onSubmit() {
            this.$store.commit('setIsLoading', true)
            const query = this.$el.querySelector('input[name="query"]').value
            console.log(query)
            await axios
                .post('/api/v1/admin/products/search/', {'query': query})
                .then(response => {
                    this.products = response.data
                    console.log(this.products)
                })
                .catch(error => {
                    console.log(error)
                })
                
            this.$store.commit('setIsLoading', false)
        },
            async deleteProduct(productID) {
                this.$store.commit('setIsLoading', true)
                await axios
                    .post(`/api/v1/admin/products/delete_product/${productID}/`)
                    .then(response => {
                        console.log(response.data)
                        // remove deleted product from products array
                        const index = this.products.findIndex(product => product.id === productID)
                        if (index !== -1) {
                            this.products.splice(index, 1)
                        }
                        toast({
                            message: 'The product was deleted',
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
            async getProducts() {
                //loading
                this.$store.commit('setIsLoading', true)

                await axios
                    .get('/api/v1/admin-products/')
                    .then(response => {
                        this.products = response.data
                        console.log(this.products)
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