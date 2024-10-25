<template>

    <div class="page-checkout">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Checkout</h1>
            </div>

            <div id="myDiv" class="column is-12 box">
                <h2 class="title">Receipt</h2>

                <p>{{username}}</p>
                <p>Date: {{ getCurrentDate() }}</p>
                <p>Time: {{ getCurrentTime() }}</p>
            <br>
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="item in cart.items"
                            v-bind:key="item.product.id"
                        >
                            <td>{{ item.product.name }}</td>
                            <template v-if="item.product.price_sale != 0">
                                <td>
                                    <del>${{ item.product.price }}</del>
                                    <tr style="color: red;">${{ item.product.price_sale }}</tr>
                                </td>
                            </template>
                            <template v-else>
                                <td>${{ item.product.price }}</td>
                            </template>
                            <td>${{ item.product.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>${{ getItemTotal(item).toFixed(2) }}</td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colspan="2">Total</td>
                            <td>{{ cartTotalLength }}</td>
                            <td>${{ cartTotalPrice.toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="column is-12 box">
                <h2 class="subtitle">Shipping details</h2>

                <p class="has-text-grey mb-4">* All fields are required</p>

                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>First name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="first_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>Last name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="last_name">
                            </div>
                        </div>

                        <div class="field">
                            <label>E-mail*</label>
                            <div class="control">
                                <input type="email" class="input" v-model="email">
                            </div>
                        </div>

                        <div class="field">
                            <label>Phone*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="phone">
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="field">
                            <label>Address*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address">
                            </div>
                        </div>

                        <div class="field">
                            <label>Zip code*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="zipcode">
                            </div>
                        </div>

                        <div class="field">
                            <label>Place*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="place">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </div>

                <hr>

                <div id="card-element" class="mb-5"></div>

                <template v-if="cartTotalLength">
                    <hr>

                    <button class="button is-dark" @click="submitForm(); print()">Pay with Stripe</button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import html2pdf from 'html2pdf.js'

export default {
    name: 'Checkout',
    data() {
        return {
            cart: {
                items: []
            },
            stripe: {},
            card: {},
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            zipcode: '',
            place: '',
            errors: [],
            // nesrine
            username: ''
        }
    },
    mounted() {
        document.title = 'Checkout | Home Deco'
        this.cart = this.$store.state.cart
        // nesrine
        this.username = this.$store.state.user.username
        

        if (this.cartTotalLength > 0) {
            this.stripe = Stripe('pk_test_51MqQcpBUmzYnes7v7sFr3RaHYkahhzHMdtrao0VV1Y1xBx0YGxiBolBDOOJVN5KnXr35iZoPWoJOk5eZ2687kCxE000YLAKpVy')
            const elements = this.stripe.elements();
            this.card = elements.create('card', { hidePostalCode: true })
            this.card.mount('#card-element')
        }
    }, 
    methods: {
        // nesrine
        print() {
            const divContents = document.getElementById('myDiv').innerHTML;
            
            // Create a new instance of html2pdf
            const pdfOptions = {
                margin: [10, 10, 10, 10],
                filename: 'receipt.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            html2pdf().set(pdfOptions).from(divContents).save();
        },
        // nesrine
        // Get current date in the format: DD/MM/YYYY
        getCurrentDate() {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            return `${day}/${month}/${year}`;
        },
        // nesrine
        // Get current time in the format: HH:MM:SS
        getCurrentTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        },
        getItemTotal(item) {
            if(item.product.price_sale!=0)
                return item.quantity * item.product.price_sale
            else return item.quantity * item.product.price
        },
        submitForm() {
            this.errors = []

            if (this.first_name === '') {
                this.errors.push('The first name field is missing!')
            }
            if (this.last_name === '') {
                this.errors.push('The last name field is missing!')
            }
            if (this.email === '') {
                this.errors.push('The email field is missing!')
            }
            if (this.phone === '') {
                this.errors.push('The phone field is missing!')
            }
            if (this.address === '') {
                this.errors.push('The address field is missing!')
            }
            if (this.zipcode === '') {
                this.errors.push('The zip code field is missing!')
            }
            if (this.place === '') {
                this.errors.push('The place field is missing!')
            }
            //if everything is woking
            if (!this.errors.length) {
                this.$store.commit('setIsLoading', true)
                //create stripe token
                this.stripe.createToken(this.card).then(result => {                    
                    if (result.error) {
                        this.$store.commit('setIsLoading', false)
                        this.errors.push('Something went wrong with Stripe. Please try again')
                        console.log(result.error.message)
                    } else {
                        //if there is no error handle token
                        this.stripeTokenHandler(result.token)
                    }
                })
            }
        },
        async stripeTokenHandler(token) {
            //get items from cart
            const items = []
            for (let i = 0; i < this.cart.items.length; i++) {
                const item = this.cart.items[i]
                if(item.product.price_sale!=0)
                {
                    const obj = {
                        product: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price_sale * item.quantity
                    }
                    items.push(obj)
                }
                else
                {
                    const obj = {
                        product: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price * item.quantity
                    }
                    items.push(obj)
                }
            }
            //set data that we are going to send to the back end (checkout view)
            const data = {
                'first_name': this.first_name,
                'last_name': this.last_name,
                'email': this.email,
                'address': this.address,
                'zipcode': this.zipcode,
                'place': this.place,
                'phone': this.phone,
                'items': items,
                'stripe_token': token.id
            }
            await axios
                .post('/api/v1/checkout/', data)
                .then(response => {
                    this.$store.commit('clearCart')
                    this.$router.push('/cart/success')
                })
                .catch(error => {
                    this.errors.push('Something went wrong. Please try again')
                    console.log(error)
                })
                this.$store.commit('setIsLoading', false)
        }
    },
    computed: {
        cartTotalPrice() {
            return this.cart.items.reduce((acc, curVal) => {
                if(curVal.product.price_sale!=0)
                    return acc += curVal.product.price_sale * curVal.quantity
                else return acc += curVal.product.price * curVal.quantity
            }, 0)
        },
        cartTotalLength() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.quantity
            }, 0)
        }
    }
}
</script>