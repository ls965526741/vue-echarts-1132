import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/rank',
    component: () => import('@/pages/rank')
  },
  {
    path: '/map',
    component: () => import('@/pages/map')
  },
  {
    path: '/hot',
    component: () => import('@/pages/hot')
  },
  {
    path: '/home',
    component: () => import('@/pages/home')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
