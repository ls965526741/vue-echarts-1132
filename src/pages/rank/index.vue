<template>
  <div ref="rank" class="rank"></div>
</template>

<script>
import { getRank } from '@/api'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      mChart: null,
      timer: null,
      currentPage: 0,
      list: [],
      total: 0,
      size: 6
    }
  },
  methods: {
    // 初始化echarts
    initChart() {
      this.mChart = echarts.init(this.$refs.rank, 'chalk')
      const initPoint = {}
      this.mChart.setOption(initPoint)
    },
    async getList() {
      this.list = []
      const res = await getRank()
      res.sort((a, b) => a.value - b.value)
      this.total = res.length % this.size === 0 ? res.length / this.size : Math.floor(res.length / this.size) + 1
      for (let index = 0; index < res.length / this.size; index++) {
        this.list.push(res.slice(index * this.size, (index + 1) * this.size))
      }

      console.log(res)

      const option = {
        title: {
          text: '▎地区销售排行',
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
      this.updateChart()
      this.startInterval()
    },
    updateChart() {
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
    startInterval() {
      this.timer = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.total - 1) {
          this.currentPage = 0
        }
        this.updateChart()
      }, 3000)
    }
  },
  mounted() {
    this.getList()
    this.initChart()
  }
}
</script>

<style lang="scss" scoped>
.rank {
  width: 100%;
  height: 100%;
}
canvas {
  border-radius: 20px;
}
</style>
