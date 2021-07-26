import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import("../components/login")
const Home = () => import("../components/home")
const Welcome = () => import("../components/welcome")
const Users = () => import("../views/uesrs/users")
const Rights = () => import("../views/power/Rights")
const Roles = () => import("../views/power/roles")
const Cate = () => import("../views/goods/Cate")

Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:'/login'
  },
  {
    path: "/login",
    component:Login,
 },
  {
    path: "/home",
    component:Home,
    redirect:'/welcome',
    children:[
    {
      path:'/welcome',
      component:Welcome
    },
   {
    path:'/users',
    component:Users
   },
   {
    path:'/rights',
    component:Rights
   },
   {
    path:'/roles',
    component:Roles
   },
   {
    path:'/categories',
    component:Cate
   },
  ]
 },
 
]

const router = new VueRouter({
  routes,
  mode:"history"
})
//路由前置导航
router.beforeEach((to,from,next)=>{
if(to.path === '/login') return next();
const tokenStr = window.sessionStorage.getItem('token')
if(!tokenStr) return next('/login') 
next()
})
export default router
