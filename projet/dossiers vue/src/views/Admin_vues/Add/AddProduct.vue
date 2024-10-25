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
                <h1 class="title">Add Product</h1>
            </div>

            

            <div class="column is-12">
                <form enctype="multipart/form-data"  @submit.prevent="submitForm">
                    
                    <div class="field">
                        <label>Brand</label>
                        <div class="control">
                            <div class="select">
                                <select v-model="brand">
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
                                <select v-model="category">
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
                            <input type="text" class="input" v-model="name">
                        </div>
                    </div>
                    <div class="field">
                        <label>Description</label>
                        <div class="control">
                            <textarea type="text" class="input" v-model="description"></textarea>
                        </div>
                    </div>
                    <div class="field">
                        <label>Price</label>
                        <div class="control">
                            <input type="number" class="input" v-model="price">
                        </div>
                    </div>
                    <div class="field">
                        <label>Quantity</label>
                        <div class="control">
                            <input type="number" class="input" v-model="quantity">
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
        name: 'AddProduct',
        data() {
            return {
                name: '',
                brand: '',
                category: '',
                description: '',
                price: 0,
                image: null,
                imageSrc: null,
                quantity: 0,
                categories : [],
                brands : [],
                errors: [],
                exists: false,
                sale_value: 0
            }
        },
        mounted() {
            this.getBrands()
            this.getCategories()
        },
        methods: {

            handleImageUpload(event) {
                const file = event.target.files[0]
                this.imageSrc = URL.createObjectURL(file)
                this.image = file
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
                //loading
                this.$store.commit('setIsLoading', true)

                this.errors = []

                console.log(this.name)
                
                if (this.brand == '') {
                    this.errors.push('brand is empty')
                }
                if (this.category == '') {
                    this.errors.push('category is empty')
                }
                if (this.name == '') {
                    this.errors.push('name is empty')
                }
                
                if (this.description == '') {
                    this.errors.push('description is empty')
                }
                if (this.price == '') {
                    this.errors.push('price is empty')
                }
                if (this.quantity == 0) {
                    this.errors.push('quantity is empty')
                }
                if (this.image == null) {
                    this.errors.push('image is empty')
                }

                this.$store.commit('setIsLoading', false)

                if (!this.errors.length) {
                    //if there are no errors
                    //push information to the server
                    this.$store.commit('setIsLoading', true)
                
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
                formData.append('brand', this.brand)
                formData.append('category', this.category)
                formData.append('name', this.name)
                formData.append('image', this.image)
                formData.append('description', this.description)
                formData.append('quantity', this.quantity)
                formData.append('price', this.price)
                
                if(this.exists == true){
                    formData.append('price_sale', this.price * (1 - this.sale_value / 100))
                    console.log(this.price * (1 - this.sale_value / 100))
                }

                await axios
                    .post('/api/v1/admin-products/', formData,  {
                        headers: {
                        'content-type': 'multipart/form-data'
                        }
                    })
                    .then(response => {
                        console.log(response)
                        toast({
                            message: 'The product was added',
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

                //finished loading
                this.$store.commit('setIsLoading', false)
            }
        }
        }
    }
</script>