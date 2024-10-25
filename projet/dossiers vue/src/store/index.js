import { createStore } from 'vuex'
//set opp Vuex / State
//to make it possible to add things to the cart and for authentication ... etc
export default createStore({
  //store informations
  state: {
    cart:{
      items: [],
    },
    wishlist:{
      items:[]
    },
    isAuthenticated: false,
    token: '',
    //loading bar
    isLoading: false,
    //test
    user: {
      id: 0,
      username: '',
     is_superuser: false
    },
  },
  getters: {
  },
  //async mutations to the variables
  mutations: {
    //to store things in local storage of the browser
    initializeStore(state){
      //if the local storage exists with an item called cart
      if(localStorage.getItem('cart')){
        //get the object from the local storage
        state.cart = JSON.parse(localStorage.getItem('cart'))
      }else{
        //create cart
        localStorage.setItem('cart', JSON.stringify(state.cart))
      }

      if(localStorage.getItem('wishlist')){
        //get the object from the local storage
        state.wishlist = JSON.parse(localStorage.getItem('wishlist'))
      }else{
        //create cart
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist))
      }
      //check if we have a token
      //if yes we set token to the localStorage token
      //and isAuthenticated to true
      if (localStorage.getItem('token')) {
        state.token = localStorage.getItem('token')
        state.isAuthenticated = true

        state.user.username = localStorage.getItem('username')
        state.user.id = localStorage.getItem('id')
       state.user.is_superuser = localStorage.getItem('is_superuser')
        
    } else {
        state.token = ''
        state.isAuthenticated = false

        state.user.id = 0
        state.user.username = ''
       state.user.is_superuser = false
        
    } 
    },
    addToCart(state, item){
      //to check if the item we are trying to add already exists in the cart
      //take all the items that verify the condition
      const exists = state.cart.items.filter(i => i.product.id === item.product.id)
      //check if exists is larger than 0: if yes then the item is in the cart
      if(exists.length){ //increase the quantity
        //get the existing quantity and add the new quantity from the product vue
        exists[0].quantity = parseInt(exists[0].quantity) + parseInt(item.quantity)
      }else {// it's not in the cart so we add it
        state.cart.items.push(item)
      }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    //loading bar between screens
    setIsLoading(state, status) {
      state.isLoading = status
    },
    //when we login
    setToken(state, token) {
      state.token = token
      state.isAuthenticated = true
    }, 
    setUser(state, user) {
      state.user = user
      //we have store them in local storage so that when we refresh the page we don't lose these values
      //state is lost when not saved in localStorage
      localStorage.setItem('id', user.id)
      localStorage.setItem('username', user.username)
     localStorage.setItem('is_superuser', user.is_superuser)
    },
    //when we logout 
    removeToken(state) {
        state.token = ''
        state.isAuthenticated = false
    },
    //after checkout
    clearCart(state) {
      state.cart.items = []
      localStorage.setItem('cart', JSON.stringify(state.cart))
      console.log(state.cart.items);
      console.log('Cart has been cleared!');
    },

    
  },
  //async functions to change vars
  actions: {
  },
  modules: {
  }
})
