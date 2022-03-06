<template>
  <div class="e-container" ref="sellerRef"></div>
</template>

<script>
import { getData } from '@/api'
import { debounce } from 'lodash'
import { titleSzie } from '@/config'
export default {
  props: {
    theme: {
      type: String,
      default: 'chalk'
    }
  },
  data() {
    return {
      dbcScreenFit: null,
      list: [],
      currentPage: 0,
      mChart: null,
      startValueArr: [],
      timer: null,
      size: 6
    }
  },
  mounted() {
    this.dbcScreenFit = debounce(this.screenFit, 20)
    this.getList()
  },
  destroyed() {
    removeEventListener('resize', this.dbcScreenFit)
  },
  watch: {
    theme() {
      this.mChart.dispose()
      this.init()
      this.screenFit()
      this.updateC()
    }
  },
  methods: {
    async getList() {
      const res = await getData('seller')
      this.list = res.sort((a, b) => a.value - b.value)
      for (let i = 0; i < res.length / this.size; i++) {
        if ((i + 1) * this.size >= res.length) {
          this.startValueArr.push(res.length - this.size - 1)
        } else {
          this.startValueArr.push(i * this.size)
        }
      }
      this.init()
      addEventListener('resize', this.dbcScreenFit)
      this.screenFit()
    },
    init() {
      this.mChart = this.$echarts.init(this.$refs.sellerRef, this.theme)
      const provinceInfo = this.list.map(item => item.name)

      const option = {
        title: {
          text: '▎商家销售统计',
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
          // 当鼠标移入axis(坐标轴)时展示 底层的背景色
          trigger: 'axis',
          axisPointer: {
            // 展示的类型是线条类型
            type: 'line',
            lineStyle: {
              color: '#2d3443'
            },
            // 相等于 z-index 将层级调低
            z: 0
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: provinceInfo
        },
        series: [
          {
            type: 'bar',
            data: this.list,
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: '#5052EE' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#AB6EE5' // 100% 处的颜色
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
      this.updateC()
      this.startInterval()
    },
    updateC() {
      const option = {
        dataZoom: {
          // 区域缩放组件
          show: false,
          yAxisIndex: 0,
          startValue: this.startValueArr[this.currentPage],
          endValue: this.startValueArr[this.currentPage] + this.size
        }
      }
      this.mChart.setOption(option)
    },
    screenFit() {
      const scaleW = this.$refs.sellerRef.offsetWidth / 1440 || 1
      const option = {
        title: {
          textStyle: {
            fontSize: scaleW * titleSzie
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: scaleW * titleSzie
            }
          }
        },
        series: [
          {
            barWidth: scaleW * titleSzie,
            itemStyle: {
              barBorderRadius: [0, (scaleW * titleSzie) / 2, (scaleW * titleSzie) / 2, 0]
            }
          }
        ]
      }
      this.mChart.setOption(option)
      this.mChart.resize()
    },
    startInterval() {
      this.timer && clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.startValueArr.length - 1) {
          this.currentPage = 0
        }
        this.updateC()
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
