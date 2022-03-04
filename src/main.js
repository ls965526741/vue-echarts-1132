import Vue from 'vue'
import App from './App.vue'
import router from './router'
import * as echarts from 'echarts'
// 引入echarts的主题
import './assets/mytheme'
import './assets/theme/chalk'
import './assets/theme/vintage'
import './assets/theme/westeros'
// 引入全局样式
import '@/assets/css/global.css'
// 引入iconfont
import '@/assets/font/iconfont.css'

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
