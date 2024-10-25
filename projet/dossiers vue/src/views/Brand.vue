<template>
    <section class="main-content columns is-fullheight">
    
    <aside class="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
        <p class="menu-label is-hidden-touch">Navigation</p>
        <ul class="menu-list">
            <li>
                <a href="#" class="is-active">
                <span class="icon"><i class="fa fa-table"></i></span> Brand
                </a>
                <ul>
                    <router-link v-for="item in brands"
                    v-bind:key="item.id"
                    v-bind:to="getBrandCategoryUrl(item)">
                        <li> {{item.name}}</li>
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
                        <h2 class="is-size-2 has-text-centered">{{ brand.name }}</h2>
                    </div>

                    <ProductBoxBrand 
                        v-for="product in brand.products"
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
import ProductBoxBrand from '@/components/ProductBoxBrand'

import { toast } from 'bulma-toast'

export default {
    name: 'Brand',
    components: { 
        ProductBoxBrand
    },
    data() {
        return {
            brand: {
                products: []
            },
            brands:[]
        }
    },
    mounted() {
        this.getBrand(),
        this.getBrands()
    },
    //we need to watch the route for changes
    //bcs when we switch between 2 similar dynamic routes
    //the lifecycle hook won't be called
    //mounted won't be refreshed
    watch: {
        $route(to, from) {
            if (to.name === 'Brand') {
                this.getBrand()
            }
        }
    },
    methods: {
        getBrandCategoryUrl(brand)
        {
            const categorySlug = this.$route.params.category_slug
            return `/category-brand/${categorySlug}${brand.get_absolute_url}`;

        },
        async getBrand() {
            this.$store.commit('setIsLoading', true)
            
            const categorySlug = this.$route.params.category_slug
           
            const brandSlug = this.$route.params.brand_slug

            await axios
                .get(`/api/v1/products/category-brand/${categorySlug}/${brandSlug}/`)
                .then(response => {
                    this.brand.products = response.data
                    document.title = categorySlug +' | ' + brandSlug + ' | Djackets'
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