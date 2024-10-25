<template>
    <div 
        class="column is-3"
      >
        <div class="box">
          <figure class="image mb-4">
            <img :src="product.get_thumbnail">
          </figure>
          <h3 class="is-size-4">{{ product.name }}</h3>
          <template v-if="product.price_sale!=0">
            <p>
                <del>${{ product.price }}</del>
                <tr style="color: red;"><b>${{ product.price_sale }}</b></tr>
            </p>
          </template>
          <template v-else>
            <p>
              <p class="is-size-6 has-text-grey">${{ product.price }}</p>
            </p>
          </template>
          <router-link v-bind:to="getBrandProductURL(product)" class="button is-dark mt-4">View Details</router-link>
        </div>
      </div>
</template>

<script>
export default {
    name: 'ProductBoxBrand',
    //to pass the info from the parent to the component
    props: {
        product: Object
    },
    methods:{
        getBrandProductURL(product){
            const categorySlug = this.$route.params.category_slug
            const brandSlug = this.$route.params.brand_slug
            console.log("ProductBoxBrand"+product.slug_at_read)
            return `/category-brand-product/${categorySlug}/${brandSlug}/${product.slug_at_read}/`;
        }
    }
}
</script>


<style scoped>
  .image {
    margin-top: -1.25rem;
    margin-left: -1.25rem;
    margin-right: -1.25rem;
  }
</style>