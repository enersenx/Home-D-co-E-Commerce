<template>
  <div class="home">
    <section class="hero is-medium is-dark mb-6">
        <div class="hero-body has-text-centered">
            <p class="title mb-6">
                Welcome to Home Deco
            </p>
            <p class="subtitle">
                The best jacket store online
            </p>
        </div>
    </section>

    <div class="columns is-multiline">
      <div class="column is-12">
          <h2 class="is-size-2 has-text-centered">Latest products</h2>
      </div>
      
      <ProductBox 
        v-for="product in latestProducts"
        v-bind:key="product.id"
        v-bind:product="product" />
      
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ProductBox from '@/components/ProductBox'

export default {
  name: 'HomeView',
  data() {
    return {
      latestProducts: [],
      id: ''
    }
  },
  components: {
    ProductBox
  },
  mounted() {
    this.getLatestProducts()
    //set document title
    document.title = 'Home Deco'

  },
  
  methods: {
    async getLatestProducts() {
      //loading
      this.$store.commit('setIsLoading', true)

      await axios
        .get('/api/v1/latest-products/')
        .then(response => {
          this.latestProducts = response.data
          
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

