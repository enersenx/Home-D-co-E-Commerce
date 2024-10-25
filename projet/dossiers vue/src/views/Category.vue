<template>
    <section class="main-content columns is-fullheight">
    
    <aside class="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
        <p class="menu-label is-hidden-touch">Navigation</p>
        <ul class="menu-list">
            <li>
                <a href="#" class="is-active">
                <span class="icon"><i class="fa fa-table"></i></span> Brands
                </a>
                <ul>
                    <router-link v-for="brand in brands"
                    v-bind:key="brand.id"
                    v-bind:to="getBrandCategoryUrl(brand)">
                        <li> {{brand.name}}</li>
                    </router-link>
                </ul>
            </li>
        </ul>
    </aside>

    <div class="container column is-10">
        <div class="section">

            <div class="page-category">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <h2 class="is-size-2 has-text-centered">{{ category.name }}</h2>
                    </div>

                    <ProductBoxCat 
                        v-for="product in category.products"
                        v-bind:key="product.id"
                        v-bind:product="product" />
                </div>
            </div>
        </div>
    </div>
    
    </section>

</template>

<script>
import axios from 'axios'
import ProductBoxCat from '@/components/ProductBoxCat'

import { toast } from 'bulma-toast'

export default {
    name: 'Category',
    components: { 
        ProductBoxCat
    },
    data() {
        return {
            category: {
                products: []
            },
            brands:[]
        }
    },
    mounted() {
        this.getCategory(),
        this.getBrands(),
        console.log("On est dans category")
    },
    //we need to watch the route for changes
    //bcs when we switch between 2 similar dynamic routes
    //the lifecycle hook won't be called
    //mounted won't be refreshed
    watch: {
        $route(to, from) {
            if (to.name === 'Category') {
                this.getCategory()
            }
        }
    },
    methods: {
        async getCategory() {
            const categorySlug = this.$route.params.category_slug
            this.$store.commit('setIsLoading', true)
            await axios
                .get(`/api/v1/products/${categorySlug}/`)
                .then(response => {
                    this.category = response.data
                    document.title = this.category.name + ' | Djackets'
                })
                .catch(error => {
                    console.log(error)
                    toast({
                        message: 'Something went wrong. Please try again.',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: 'bottom-right',
                    })
                })
            this.$store.commit('setIsLoading', false)
        },
        getBrandCategoryUrl(brand)
        {
            const categorySlug = this.$route.params.category_slug
            console.log(brand.get_absolute_url)
            return `/category-brand/${categorySlug}${brand.get_absolute_url}`;

        },
        getBrands() {
            //loading
            this.$store.commit('setIsLoading', true)
            axios
            .get('/api/v1/brands-list/')
            .then(response => {
                this.brands = response.data
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