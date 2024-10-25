<template>
        <div class="page-product">
            <div class="columns is-multiline">
                <div class="column is-7">
                    <figure class="image-product mb-6">
                        <img v-bind:src="product.get_image">
                    </figure>

                    <h1 class="title">{{ product.name }}</h1>
                  

                    <p>{{ product.description }}</p>
                    
                </div>

                <div class="column is-3">
                    <h2 class="subtitle">Information</h2>
                    <template v-if="product.price_sale!=0">
                        <p>
                            <td><strong>Price: </strong></td>
                            <del>${{ product.price }}</del>
                            <tr style="color: red;"><b>${{ product.price_sale }}</b></tr>
                        </p>
                    </template>
                    <template v-else>
                        <p>
                            <td><strong>Price: </strong></td>
                            <strong>${{ product.price }}</strong>
                        </p>
                    </template>
                    <div class="field has-addons mt-6">
                        <div class="control">
                            <input type="number" class="input" min="1" v-model="quantity">
                        </div>

                        <div class="control">
                            <a class="button is-dark" @click="addToCart">Add to cart</a>
                        </div>
                    </div>
                    <div class="field has-addons mt-6">
                        <template v-if="$store.state.isAuthenticated">
                            <template v-if="!this.elementExist">
                                <a class="button is-dark" @click="changeWishList">Add to WishList</a>
                            </template>
                            <template v-else>
                                <a class="button is-dark" @click="changeWishList">Remove from WishList</a>
                            </template>
                        </template>

                        <template v-else>
                            <router-link to="/log-in" class="button is-light">WishList</router-link>
                        </template>
                    </div>


                        
                </div>

            </div>
        </div>

</template>

<script>
import axios from 'axios'
import { toast } from 'bulma-toast'

export default{
    name: 'ProductCat',
    data(){
        return{
            elementExist: false,
            product: {},
            quantity: 1
            //price soldé
        }
    },
    mounted() {
        console.log("On est dans product de category"),
        this.getProduct(),
        this.verifyElement()
    },
    
    methods: {
        async getProduct() {
            //loading
            this.$store.commit('setIsLoading', true)

            //get the category slug from the url we are on
            const category_slug = this.$route.params.category_slug
            //get the product slug from the url we are on
            const product_slug = this.$route.params.product_slug

            //wait for axios to finish
            await axios   
                .get(`/api/v1/products/category-product/${category_slug}/${product_slug}`)
                .then( response => {
                    this.product = response.data

                    //set document title
                    document.title = this.product.name+ ' | Home Deco'
                })
                .catch(error => {
                    console.log(error)
                })
            //calculer solde pour ce produit, pour l'affichage
            //finished loading
            this.$store.commit('setIsLoading', false)
        },
        addToCart() {
            //check if the field quantity is a number or inf to 1
            if (isNaN(this.quantity) || this.quantity < 1) {
                this.quantity = 1
            }
            //ceate item with attributes product and quantity
            //this item is sent to the addTocart function in the store
            //so we can call these attributes for an item
            const item = {
                product: this.product,
                quantity: this.quantity
            }
            //call the store addToCart mutation
            this.$store.commit('addToCart', item)
            toast({
                message: 'The product was added to the cart',
                type: 'is-success',
                dismissible: true,
                pauseOnHover: true,
                duration: 2000,
                position: 'bottom-right',
            })
        },
        verifyElement(){
            const wish = {
                user : this.$store.state.user.id,
                product : this.product.id
            };

            this.elementExist = false;
            axios
            .get('/api/v1/products/wish/')
            .then(response => {
                const wishListData = response.data
                console.log(wishListData)
                if(wishListData.length>0)
                {
                    wishListData.forEach(item =>{
                        if(item.user == wish.user && item.product.id == wish.product)
                        {
                            console.log(item.user)
                            console.log(item.product)
                            this.elementExist = true
                            console.log("element exist")
                        }
                    });
                }
            })
            .catch(error => {
                console.log(error)
            })
            console.log(this.elementExist)
        },
        changeWishList() {
            
            if(this.elementExist)
            {
                this.$store.commit('setIsLoading', true)
                axios
                .post(`/api/v1/products/wishDelete/${this.product.id}/`)
                .then(response => {
                    this.elementExist = false
                    toast({
                        message: 'The product was deleted from the WishList',
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
            }
            else
            {
                this.$store.commit('setIsLoading', true)
                let formData = new FormData()
                formData.append('user', this.$store.state.user.id)
                formData.append('product', this.product.id)
                axios
                .post('/api/v1/wish-gestion/', formData)
                .then(response => {
                    this.elementExist = true
                    console.log(response)
                    toast({
                        message: 'The wish was added to the wishlist',
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
            }
            
        }
        
    },
    computed:{
        
    }
}

</script>