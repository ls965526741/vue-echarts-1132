<template>
  <div class="e-container" ref="sellerRef"></div>
</template>

<script>
import { getData } from '@/api'
import { debounce } from 'lodash'
export default {
  data() {
    return {
      list: [],
      dbcScreenFit: null,
      currentPage: 0,
      mChart: null,
      timer: null,
      total: 0,
      size: 6
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
      this.mChart = this.$echarts.init(this.$refs.sellerRef, 'thalk')
      const res = await getData('seller')
      res.sort((a, b) => a.value - b.value)
      this.total = res.length % this.size === 0 ? res.length / this.size : Math.floor(res.length / this.size) + 1
      for (let index = 0; index < res.length / this.size; index++) {
        if ((index + 1) * this.size > res.length) {
          this.list.push(res.slice(res.length - this.size, res.length))
        } else {
          this.list.push(res.slice(index * this.size, (index + 1) * this.size))
        }
      }
      const option = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          // 把x轴和y轴纳入 grid
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: { value: 'value' },
        yAxis: {
          type: 'category'
        },
        series: [
          {
            type: 'bar',
            barWidth: 50,
            label: {
              show: true,
              position: 'right',
              color: 'white'
            },
            itemStyle: {
              borderRadius: [0, 25, 25, 0],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: 'blue' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'skyblue' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        ]
      }
      this.mChart.setOption(option)

      this.mChart.on('mouseover', () => {
        clearInterval(this.timer)
      })
      // 鼠标离开 开启动画效果
      this.mChart.on('mouseout', () => {
        this.startInterval()
      })
      this.update()
      this.startInterval()
    },
    update() {
      const provinceInfo = this.list[this.currentPage].map(item => item.name)
      const option = {
        yAxis: {
          data: provinceInfo
        },
        series: [
          {
            data: this.list[this.currentPage]
          }
        ]
      }
      this.mChart.setOption(option)
    },
    screenFit() {
      const option = {}
      this.mChart.setOption(option)
    },
    startInterval() {
      this.timer = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.total - 1) {
          this.currentPage = 0
        }
        this.update()
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
