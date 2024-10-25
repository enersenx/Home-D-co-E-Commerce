<template>
    <div class="column">
            <div class="container">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <h1 class="title">WishList</h1>
                    </div>

                    <div class="column is-12">
                        <table class="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Wishes</th>
                                    <th>Delete</th>
                                    <th>Created at</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="wish in wishes"
                                    v-bind:key="wish.id">
                                        <td>{{ wish.product_name }}</td>
                                        <td><button v-on:click="deleteWish(wish.product)" class="button is-danger">Delete wish</button></td>
                                        <td>{{ wish.created_at }}</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </div>

</template>



<script>
    import axios from 'axios'
    import { toast } from 'bulma-toast'

    export default {
        name: 'WishList',
        data() {
            return {
                wishes: []
            }
        },
        mounted() {
            this.getWishes()
        },
        methods: {
            
            async deleteWish(wishID) {
                this.$store.commit('setIsLoading', true)
                axios
                    .post(`/api/v1/products/wishDelete/${wishID}/`)
                    .then(response => {
                        console.log(response.data)
                        const index = this.wishes.findIndex(wish => wish.product === wishID)
                        if (index !== -1) {
                            this.wishes.splice(index, 1)
                        }
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
            },
            async getWishes() {
                //loading
                this.$store.commit('setIsLoading', true)

                await axios
                    .get('/api/v1/products/wish/')
                    .then(response => {
                        this.wishes = response.data
                    })
                    .catch(error => {
                        console.log(error)
                    })

                this.$store.commit('setIsLoading', false)
            }
        }
    }
</script>