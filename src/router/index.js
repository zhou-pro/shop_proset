import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import("../components/login")
const Home = () => import("../components/home")
const Welcome = () => import("../components/welcome")
const Users = () => import("../views/uesrs/users")

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
   }
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
