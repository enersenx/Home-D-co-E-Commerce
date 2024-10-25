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
                <h1 class="title">Edit - {{ sale.sale_value }}% Sale</h1>
            </div>

            

            <div class="column is-12">
                <form  @submit.prevent="submitForm">
                    
                    
                    
                    <div class="field">
                        <label>Sale value</label>
                        <div class="control">
                            <input type="number" class="input" v-model="sale.sale_value">
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
        name: 'AddSale',
        data() {
            return {
                sale: {},
                
            }
        },
        mounted() {
            this.getSale()
        },
        methods: {
            async getSale() {
                //loading
                this.$store.commit('setIsLoading', true)
                const saleID = this.$route.params.id
                await axios
                    .get(`/api/v1/admin-sale/${saleID}/`)
                    .then(response => {
                        this.sale = response.data
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
                const saleID = this.$route.params.id

                let formData = new FormData()
                formData.append('sale_value', this.sale.sale_value)

                await axios
                    .patch(`/api/v1/admin-sale/${saleID}/`, formData)
                    .then(response => {
                        console.log(response)
                        toast({
                            message: 'The sale was updated',
                            type: 'is-success',
                            dismissible: true,
                            pauseOnHover: true,
                            duration: 2000,
                            position: 'bottom-right',
                        })
                        this.$router.push('/admin/sale')
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