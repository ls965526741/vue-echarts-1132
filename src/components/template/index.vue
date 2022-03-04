<template>
  <div class="e-container" ref="stockRef"></div>
</template>

<script>
import { getData } from '@/api'
import { debounce } from 'lodash'
export default {
  data() {
    return {
      list: null, // 数据存放
      // 屏幕的延迟函数
      dbcScreenFit: null
    }
  },
  mounted() {
    this.dbcScreenFit = debounce(this.screenFit, 20)
    this.init() // 初始化ecs
    addEventListener('resize', this.dbcScreenFit)
    this.screenFit() // 首次屏幕适配
  },
  destroyed() {
    removeEventListener('resize', this.dbcScreenFit) // 销毁事件监听
  },
  methods: {
    // 初始化echarts
    async init() {
      this.mChart = this.$echarts.init(this.$refs.stockRef, 'thalk')
      const res = await getData()
      console.log(res)
      const option = {}
      this.mChart.setOption(option)
    },
    // 更新数据
    update() {
      const option = {}
      this.mChart.setOption(option)
      this.mChart.resize()
    },
    // 屏幕适配
    screenFit() {
      const option = {}
      this.mChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
