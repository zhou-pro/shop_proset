import Vue from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/css/global.css"
import '../src/plugins/plugins'
import axios from 'axios'
import './assets/tools/dateForm'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Treeable from 'vue-table-with-tree-grid'
Vue.component('tree-table',Treeable)

axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  //console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueQuillEditor)



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
