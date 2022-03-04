<template>
  <div class="e-container" ref="trendRef"></div>
</template>

<script>
import { getData } from '@/api'
import { debounce } from 'lodash'
export default {
  data() {
    return {
      list: null,
      dbcScreenFit: null
    }
  },
  mounted() {
    this.dbcScreenFit = debounce(this.screenFit, 20)
    this.init()
    addEventListener('resize', this.dbcScreenFit)
    this.screenFit()
  },
  destroyed() {
    removeEventListener('resize', this.dbcScreenFit)
  },
  methods: {
    async init() {
      this.mChart = this.$echarts.init(this.$refs.trendRef, 'thalk')
      const res = await getData()
      console.log(res)
      const option = {}
      this.mChart.setOption(option)
    },
    update() {
      const option = {}
      this.mChart.setOption(option)
    },
    screenFit() {
      const option = {}
      this.mChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
