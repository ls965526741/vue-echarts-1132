<template>
  <div ref="rank" class="rank"></div>
</template>

<script>
import { getData } from '@/api'
import * as echarts from 'echarts'
import { titleSzie } from '@/config'
export default {
  data() {
    return {
      mChart: null,
      list: [],
      currentIndex: 0,
      timer: null
    }
  },
  mounted() {
    this.getList()
    this.init()
    addEventListener('resize', this.screenFit)
    this.screenFit()
    this.startInterval()
  },
  destroyed() {
    removeEventListener('resize', this.screenFit)
    clearInterval(this.timer)
  },
  methods: {
    // 初始化echarts
    init() {
      this.mChart = echarts.init(this.$refs.rank, 'chalk')
      const initPoint = {}
      this.mChart.setOption(initPoint)
    },
    async getList() {
      const res = await getData('rank')
      this.list = res.sort((a, b) => b.value - a.value)
      const option = {
        title: {
          text: '▎地区销售排行',
          left: '3%',
          top: '3%'
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
        xAxis: {
          type: 'category'
        },
        yAxis: {
          value: 'value'
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              color: 'white'
            },
            itemStyle: {
              borderRadius: [25, 25, 0, 0]
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
      this.updateC()
    },
    updateC() {
      // 渐变色数组
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const provinceInfo = this.list.map(item => item.name)

      const option = {
        xAxis: {
          data: provinceInfo
        },
        dataZoom: {
          // 区域缩放组件
          show: false,
          startValue: this.currentIndex,
          endValue: this.currentIndex + 10
        },
        series: [
          {
            data: this.list,
            itemStyle: {
              color: ({ data }) => {
                let targetColorArr = null
                if (data.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (data.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: targetColorArr[0] // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: targetColorArr[1] // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            }
          }
        ]
      }
      this.mChart.setOption(option)
    },
    screenFit() {
      const scaleW = this.$refs.rank.offsetWidth / 1440
      const option = {
        title: {
          textStyle: {
            fontSize: scaleW * titleSzie
          }
        },
        series: [
          {
            barWidth: scaleW * 50
          }
        ]
      }
      this.mChart.setOption(option)
      this.mChart.resize()
    },
    startInterval() {
      this.timerId && clearInterval(this.timerId)
      this.timer = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > this.list.length - 11) {
          this.currentIndex = 0
        }
        this.updateC()
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.rank {
  width: 100%;
  height: 100%;
}
</style>
