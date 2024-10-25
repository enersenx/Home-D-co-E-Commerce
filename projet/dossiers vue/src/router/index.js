import { createRouter, createWebHistory } from 'vue-router'

import store from '../store'

import HomeView from '../views/HomeView.vue'

import ProductCat from '../views/ProductCat.vue'
import ProductBrand from '../views/ProductBrand.vue'
import Category from '../views/Category.vue'
import Search from '../views/Search.vue'
import Cart from '../views/Cart.vue'
import Wishlist from '../views/WishList.vue'

import SignUp from '../views/SignUp.vue'
import LogIn from '../views/LogIn.vue'
import MyAccount from '../views/MyAccount.vue'

import Checkout from '../views/Checkout.vue'
import Success from '../views/Success.vue'

import Brand from '../views/Brand.vue'

//nesrine
//admin vues imports
import Dashboard from '../views/Admin_vues/Dashboard.vue'
import Products from '../views/Admin_vues/Products.vue'
import Categories from '../views/Admin_vues/Categories.vue'
import Brands from '../views/Admin_vues/Brands.vue'
import Sale from '../views/Admin_vues/Sale.vue'
import AddProduct from '../views/Admin_vues/Add/AddProduct.vue'
import EditProduct from '../views/Admin_vues/Edit/EditProduct.vue'
import AddCategory from '../views/Admin_vues/Add/AddCategory.vue'
import EditCategory from '../views/Admin_vues/Edit/EditCategory.vue'
import AddBrand from '../views/Admin_vues/Add/AddBrand.vue'
import EditBrand from '../views/Admin_vues/Edit/EditBrand.vue'
import AddSale from '../views/Admin_vues/Add/AddSale.vue'
import EditSale from '../views/Admin_vues/Edit/EditSale.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/log-in',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/my-account',
    name: 'MyAccount',
    component: MyAccount,
    meta: {
        requireLogin: true
    }
  },

  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/wishlist',
    name: 'WishList',
    component: Wishlist
  },
  {
    path: '/cart/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: {
        requireLogin: true
    }
  },
  {
    path: '/cart/success',
    name: 'Success',
    component: Success
  },

  //dynamic route
  

  //nesrine
  //catalogue paths
  {
    path: '/:category_slug/',
    name: 'Category',
    component: Category
  },
  {
    path: '/category-product/:category_slug/:product_slug/',
    name: 'ProductCat',
    component: ProductCat
  },
  {
    path: '/category-brand/:category_slug/:brand_slug/',
    name: 'Brand',
    component: Brand
  },
  {
    path: '/category-brand-product/:category_slug/:brand_slug/:product_slug/',
    name: 'ProductBrand',
    component: ProductBrand
  },

  //admin paths
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/products',
    name: 'Products',
    component: Products,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/categories',
    name: 'Categories',
    component: Categories,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/brands',
    name: 'Brands',
    component: Brands,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/sale',
    name: 'Sale',
    component: Sale,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/products/add',
    name: 'AddProduct',
    component: AddProduct,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/products/:id/edit',
    name: 'EditProduct',
    component: EditProduct,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/categories/add',
    name: 'AddCategory',
    component: AddCategory,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/categories/:id/edit',
    name: 'EditCategory',
    component: EditCategory,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/brands/add',
    name: 'AddBrand',
    component: AddBrand,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/brands/:id/edit',
    name: 'EditBrand',
    component: EditBrand,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/sale/add',
    name: 'AddSale',
    component: AddSale,
    meta: {
      requireLogin: true
  }
  },
  {
    path: '/admin/sale/:id/edit',
    name: 'EditSale',
    component: EditSale,
    meta: {
      requireLogin: true
  }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

//if a pae requires login we send to the login screen
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireLogin) && !store.state.isAuthenticated) {
    next({ name: 'LogIn', query: { to: to.path } });
  } else {
    next()
  }
})


export default router
