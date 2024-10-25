<template>
    <tr>
        <td><router-link :to="item.product.get_absolute_url">{{ item.product.name }}</router-link></td>
        <template v-if="item.product.price_sale != 0">
            <td>
                <del>${{ item.product.price }}</del>
                <tr style="color: red;">${{ item.product.price_sale }}</tr>
            </td>
        </template>
        <template v-else>
            <td>${{ item.product.price }}</td>
        </template>
        <td>
            {{ item.quantity }}
            <a @click="decrementQuantity(item)">-</a>
            <a @click="incrementQuantity(item)">+</a>
        </td>
        <td>${{ getItemTotal(item).toFixed(2) }}</td>
        <td><button class="delete" @click="removeFromCart(item)"></button></td>
    </tr>
</template>

<script>
export default {
    //one item
    name: 'CartItem',
    props: {
        //got fron the parent from bind
        //it's an item from the cart
        initialItem: Object
    },
    data() {
        return {
            //set item to prop
            item: this.initialItem
        }
    },
    methods: {
        //toatl price
        getItemTotal(item) {
            if(item.product.price_sale!=0)
            {
                return item.quantity * item.product.price_sale
            }
            else return item.quantity * item.product.price
        },
        decrementQuantity(item) {
            item.quantity -= 1

            //remove from cart if qt = 0
            if (item.quantity === 0) {
                this.$emit('removeFromCart', item)
            }
            this.updateCart()
        },
        incrementQuantity(item) {
            item.quantity += 1
            this.updateCart()
        },
        //to update in the storage
        updateCart() {
            localStorage.setItem('cart', JSON.stringify(this.$store.state.cart))
        },
        removeFromCart(item) {
            this.$emit('removeFromCart', item)
            this.updateCart()
        },
    },
}
</script>