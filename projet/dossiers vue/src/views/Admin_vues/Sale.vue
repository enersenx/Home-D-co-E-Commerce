<template>
    
    <div class="columns">
        <div class="column is-one-fifth">
            <aside class="menu sticky">
        <p class="menu-label">
            General
        </p>
        <ul class="menu-list">
            <li><router-link to="/admin/dashboard" class="navbar-item"><a>Dashboard</a></router-link></li>
            <li><router-link to="/admin/sale" class="navbar-item"><a class="is-active">Sale</a></router-link></li>
             
        </ul>
        <p class="menu-label">
            Administration
        </p>
        <ul class="menu-list">
            <li><router-link to="/admin/categories" class="navbar-item"><a>Categories</a></router-link></li>
            <li><router-link to="/admin/brands" class="navbar-item"><a>Brands</a></router-link></li>
            <li><router-link to="/admin/products" class="navbar-item"><a>Products</a></router-link></li>
        </ul>
        
    </aside>
    </div>
    <div class="column">
        
            <div class="container">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <h1 class="title">Sale</h1>

                        <router-link to="/admin/sale/add">Create Sale</router-link>
                    </div>

                    <div class="column is-12">
                        <table class="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Sale</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Created at</th>
                                    <th>Modified at</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="sale in sales"
                                    v-bind:key="sale.id">
                                        <td>{{ sale.sale_value }}%</td>
                                        <td><router-link :to="{ name: 'EditSale', params: { id: sale.id }}" class="button is-light">Edit</router-link></td>
                                        <td><button v-on:click="deleteSale(sale.id)" class="button is-danger">Delete</button></td>
                                        <td>{{ sale.created_at_read }}</td>
                                        <td>{{ sale.modified_at_read }}</td>

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
        name: 'Sale',
        data() {
            return {
                sales: []
            }
        },
        mounted() {
            this.getSale()
        },
        methods: {
            async deleteSale(saleID) {
                this.$store.commit('setIsLoading', true)
                await axios
                    .post(`/api/v1/admin/sale/delete_sale/${saleID}/`)
                    .then(response => {
                        console.log(response.data)
                        const index = this.sales.findIndex(sale => sale.id === saleID)
                        if (index !== -1) {
                            this.sales.splice(index, 1)
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
            async getSale() {
                //loading
                this.$store.commit('setIsLoading', true)

                await axios
                    .get('/api/v1/admin-sale/')
                    .then(response => {
                        this.sales = response.data
                        console.log(this.sales)
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