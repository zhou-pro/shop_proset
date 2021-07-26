import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/css/global.css"
import '../src/plugins/plugins'
import axios from 'axios'

import Treeable from 'vue-table-with-tree-grid'
Vue.component('tree-table',Treeable)

axios.defaults.baseURL='http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  //console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
