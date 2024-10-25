<template>
  <div id="wrapper">
    <nav class="navbar is-dark">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item"><strong>Home Deco</strong></router-link>

        <a class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu" @click="showMobileMenu = !showMobileMenu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" id="navbar-menu" v-bind:class="{'is-active': showMobileMenu }">
        
        <div class="navbar-start">
          <div class="navbar-item">
            <!-- /search is in vue not backend -->
            <form method="get" action="/search">
              <div class="field has-addons">
               
                <div class="control">
                  <input type="text" class="input" placeholder="What are you looking for?" name="query">
                </div>

                <div class="control">
                  <button class="button is-success">
                      <span class="icon">
                      <i class="fas fa-search"></i>
                      </span>
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>

        <div class="navbar-end">
          <div class="dropdown">
              <button class="dropbtn">Categories</button>
              <div class="dropdown-content">
                  <router-link v-for="category in categories"
                  v-bind:key="category.id"
                  v-bind:to="category.get_absolute_url">{{category.name}}</router-link>
              </div>
          </div>
          <div class="navbar-item">
            <div class="buttons">
              <template v-if="$store.state.isAuthenticated">
                <router-link to="/my-account" class="button is-light">{{username}}</router-link>
              </template>

              

              <template v-else>
                <router-link to="/log-in" class="button is-light">Log in</router-link>
              </template>
              {{ isAdmin }}

              <template v-if="is_admin">
                <router-link to="/admin/dashboard" class="button is-light">Dashboard</router-link>
              </template>

              <router-link to="/cart" class="button is-success">
                <span class="icon"><i class="fas fa-shopping-cart"></i></span>
                <span>Cart ({{ cartTotalLength }})</span>
              </router-link>
              
              <template v-if="$store.state.isAuthenticated">
                <router-link to="/wishlist" class="button is-light">WishList</router-link>
              </template>

              <template v-else>
                <router-link to="/log-in" class="button is-light">Wishlist</router-link>
              </template>

              
  


            </div>
          </div>

        </div>
      </div>
    </nav>


    <div class="is-loading-bar has-text-centered" v-bind:class="{'is-loading': $store.state.isLoading }">
      <div class="lds-dual-ring"></div>
    </div>

    <section class="section">
      <router-view/>
    </section>

    <footer class="footer">
      <p class="has-text-centered">Copyright (c) 2023</p>
    </footer>
  </div>

</template>

<script>
import axios from 'axios'

  export default{
    data() {
      return{
        showMobileMenu: false,
        categories: [],
        cart: {
          items: []
        },
        username: '',
        is_admin : false
      }
    },
    beforeCreate(){
      //initialise the store by calling the mutation
      this.$store.commit('initializeStore')
      //get the toen from the state
      //to know if we are authenticated or not
      const token = this.$store.state.token
      //if we are authenticated
      if (token) {
        axios.defaults.headers.common['Authorization'] = "Token " + token
      } else {
          axios.defaults.headers.common['Authorization'] = ""
      }
    },
    mounted() {
      //by nesrine to get categories from db
      this.getCategories()

      this.cart = this.$store.state.cart
      this.username = this.$store.state.user.username
      
      
    },
    watch: {
    // watch for changes to the user state in the store
    //so that when we login the username in the navbar is updated
    //bcs when we first mount App.vue the username is empty since we are not logged in 
    //In this code, the username is set to an empty string in the data() function. When the component is mounted, the mounted() function is called, and it tries to set username to the username stored in the Vuex store's user state. However, the username stored in the store is empty at the time of mounting, so the username in the component will still be an empty string.
    '$store.state.user': {
      handler(newUser) {
        // update the username in the component
        this.username = newUser.username;
      },
      deep: true,
    },
    },
    computed: {//calculated variables
      cartTotalLength(){//every time the cart changes this is updated
        let totalLength = 0

        for(let i = 0; i<this.cart.items.length; i++){
          totalLength += this.cart.items[i].quantity
        }

        return totalLength
      },
      isAdmin(){
         axios
        .get(`/api/v1/superuser/${this.$store.state.user.id}/`)
                    .then(response => {
                    const userInfo = response.data
                    // add any other user attributes you want to use
                    console.log("get current superuser")
                    console.log(response.data)
                    
                    //localStorage.setItem('is_superuser', response.data.is_superuser)

                    if(response.data.is_superuser){
                        this.is_admin = true
                        console.log('test '+this.is_admin)
                        return true
                    }
                    else return false

                    })
                    .catch(error => {
                    console.log(error)
                })
      },
    },

    methods: {
      
      async getCategories() {
        //loading
      this.$store.commit('setIsLoading', true)
        await axios
          .get('/api/v1/categories-list/')
          .then(response => {
            this.categories = response.data
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

<style lang="scss">
@import '../node_modules/bulma';
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #57a0ad;
  border-color: #57a0ad transparent #57a0ad transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.is-loading-bar {
  height: 0;
  overflow: hidden;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  &.is-loading {
    height: 80px;
  }
}
</style>

<style lang="scss">
.dropbtn {
  background-color: hsl(0, 0%, 21%);
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #ddd;}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {display: block;}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {background-color: #E6C5D5;}

/*styele changes*/
.button.is-success {
    background-color: #E6C5D5;
    border-color: transparent;
    color: #fff;
}
.button.is-success:hover  {background-color: #c39aae;}
.menu-list a.is-active {
  background-color: #c39aae;
  color: #fff;
}
.image-product img {
    display: block;
    height: auto;
    width: 50%;
}
</style>
