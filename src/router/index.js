import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Home = () => import('../views/home/Home.vue')
const Category = () => import('../views/category/Category.vue')
const Shopcar = () => import('../views/shopcar/Shopcar.vue')
const Profile = () => import('../views/profile/Profile')
const Detail = () => import('../views/detail/Detail')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/shopcar',
    component: Shopcar
  },
  {
    path: '/profile',
    component: Profile
  },
  /*  {
     // 非动态路由方式传递---query
     path: '/detail',
     component: Detail
   }, */
  {
    path: '/detail/:iid',
    component: Detail
  }

]
const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router