import Vue from 'vue'
import App from './App.vue'
import router from './router'
import * as echarts from 'echarts'
// 引入echarts的主题
import './assets/theme/chalk'
import './assets/theme/westeros'
// 引入全局样式
import '@/assets/css/global.css'
// 引入iconfont
import '@/assets/font/iconfont.css'
import SocketService from '@/utils/socket_service'
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
