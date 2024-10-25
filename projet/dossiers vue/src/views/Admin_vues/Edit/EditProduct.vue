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
                <h1 class="title">Edit - {{ product.name }}</h1>
            </div>

            <div class="column is-12">
                <form enctype="multipart/form-data"  @submit.prevent="submitForm">
                    
                    <div class="field">
                        <label>Brand</label>
                        <div class="control">
                            <div class="select">
                                <select v-model="product.brand">
                                    <option value="" selected>Select brand</option>
                                    <option
                                        v-for="brand in brands"
                                        v-bind:key="brand.id"
                                        v-bind:value="brand.id"
                                    >
                                        {{ brand.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label>Category</label>
                        <div class="control">
                            <div class="select">
                                <select v-model="product.category">
                                    <option value="" selected>Select category</option>
                                    <option
                                        v-for="category in categories"
                                        v-bind:key="category.id"
                                        v-bind:value="category.id"
                                    >
                                        {{ category.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="field">
                        <label>Name</label>
                        <div class="control">
                            <input type="text" class="input" v-model="product.name">
                        </div>
                    </div>
                    <div class="field">
                        <label>Description</label>
                        <div class="control">
                            <textarea type="text" class="input" v-model="product.description"></textarea>
                        </div>
                    </div>
                    <div class="field">
                        <label>Price</label>
                        <div class="control">
                            <input type="number" class="input" v-model="product.price">
                        </div>
                    </div>
                    <div class="field">
                        <label>Quantity</label>
                        <div class="control">
                            <input type="number" class="input" v-model="product.quantity">
                        </div>
                    </div>
                    <div class="field">
                        <div class="file">
                            <label class="file-label">
                                <input class="file-input" type="file" id="image" name="image" @change="handleImageUpload">
                                
                                <span class="file-cta">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label">
                                    Choose an image…
                                </span>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div class="field">
                        <img :src="imageSrc" v-if="imageSrc">
                    </div>
                    
                    <div class="field">
                        <div class="control">
                            <button class="button is-success">Update</button>
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
        name: 'EditProduct',
        data() {
            return {
                product: {},
                categories : [],
                brands : [],
                imageSrc: null,
                image_has_changed: false,
                exists: false,
                sale_value: 0
            }
        },
        mounted() {
            this.getProduct()
            this.getBrands()
            this.getCategories()
        },
        methods: {
            handleImageUpload(event) {
                const file = event.target.files[0]
                    this.imageSrc = URL.createObjectURL(file)
                    this.image = file
                    this.image_has_changed = true
                
            },
            async getProduct() {
                //loading
                this.$store.commit('setIsLoading', true)
                const productID = this.$route.params.id
                await axios
                    .get(`/api/v1/admin-products/${productID}/`)
                    .then(response => {
                        this.product = response.data
                        this.image = this.product.image
                        this.imageSrc = this.image
                        console.log('this.image')
                        console.log(this.image)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                //finished loading
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
            },
        
            async submitForm() {
                this.$store.commit('setIsLoading', true)
                const productID = this.$route.params.id

                await axios
                    .post('/api/v1/admin/sale-exists/')
                    .then(response => {
                        console.log(response.data)
                        if(response.data.value == 'true'){
                            console.log('it s true')
                            this.exists = true
                            console.log(this.exists)
                            this.sale_value = response.data.sale_value
                            console.log(this.sale_value)
                        }

                        
                    })
                    .catch(error => {
                        console.log(error)
                    })


                let formData = new FormData()
                formData.append('brand', this.product.brand)
                formData.append('category', this.product.category)
                formData.append('name', this.product.name)
                if(this.image_has_changed){
                    formData.append('image', this.image)
                }
                formData.append('description', this.product.description)
                formData.append('quantity', this.product.quantity)
                formData.append('price', this.product.price)
                if(this.exists == true){
                    formData.append('price_sale', this.product.price * (1 - this.sale_value / 100))
                    console.log(this.product.price * (1 - this.sale_value / 100))
                }

                await axios
                    .patch(`/api/v1/admin-products/${productID}/`, formData,  {
                        headers: {
                        'content-type': 'multipart/form-data'
                        }
                    })
                    .then(response => {

                        toast({
                            message: 'The product was updated',
                            type: 'is-success',
                            dismissible: true,
                            pauseOnHover: true,
                            duration: 2000,
                            position: 'bottom-right',
                        })
                        this.$router.push('/admin/products')
                    })
                    .catch(error => {
                        console.log(error)
                    })
                this.$store.commit('setIsLoading', false)
            }
        }
    }
</script>