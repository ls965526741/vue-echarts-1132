import Vue from 'vue'
import App from './App.vue'
import router from './router'
import * as echarts from 'echarts'
import './assets/mytheme'
import './assets/theme/chalk'
import './assets/theme/vintage'
import './assets/theme/westeros'
import '@/assets/css/global.css'

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
