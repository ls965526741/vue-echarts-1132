<template>
  <div class="e-container" ref="stockRef"></div>
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
      list: [],
      dbcScreenFit: null,
      timer: null,
      currentPage: 0,
      // 圆环坐标
      centerArr: [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ],
      // 圆环渐变色
      colorArr: [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
    }
  },
  mounted() {
    this.dbcScreenFit = debounce(this.screenFit, 20)
    this.getList()
  },
  destroyed() {
    removeEventListener('resize', this.screenFit)
    clearInterval(this.timer)
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
      const arr = []
      const res = await getData('stock')
      res.sort((a, b) => b.sales - a.sales)
      for (let i = 0; i < res.length / 5; i++) {
        arr.push(res.slice(i * 5, (i + 1) * 5))
      }
      arr.forEach((item1, index1) => {
        const arr1 = []
        item1.forEach((item2, index2) => {
          const option = {
            type: 'pie',
            // 关闭鼠标移入到饼图的动画效果
            center: this.centerArr[index2],
            hoverAnimation: false,
            labelLine: {
              show: false
            },
            label: {
              position: 'center',
              color: this.colorArr[index2][0]
            },
            data: [
              {
                name: item2.name + '\n\n ' + item2.sales,
                value: item2.sales,
                tooltip: {
                  formatter: `${item2.name}<br/>销量：{c}<br/>占比：{d}%`
                },
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 1,
                    x2: 0,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: this.colorArr[index2][0] // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: this.colorArr[index2][1] // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              },
              {
                value: item2.stock,
                itemStyle: {
                  color: '#bbb'
                },
                tooltip: {
                  formatter: `${item2.name}<br/>库存：{c}<br/>占比：{d}%`
                }
              }
            ]
          }
          arr1.push(option)
        })
        this.list[index1] = arr1
      })

      this.init()
      this.updateC()
      addEventListener('resize', this.screenFit)
      this.screenFit()
      this.startInterval()
    },
    async init() {
      this.mChart = this.$echarts.init(this.$refs.stockRef, this.theme)
      const option = {
        title: {
          text: '▎库存和销量分析',
          left: '3%',
          top: '3%'
        }
      }
      this.mChart.setOption(option)
      this.mChart.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.mChart.on('mouseout', this.startInterval)
    },
    updateC() {
      const option = {
        tooltip: {
          // 这里为item 可以为内部的数据开启 单独的 tooltip
          // trigger: 'item'
        },
        series: this.list[this.currentPage]
      }
      this.mChart.setOption(option)
    },
    screenFit() {
      const scaleW = this.$refs.stockRef.offsetWidth / 1440
      const seriesOption = {
        type: 'pie',
        radius: [150 * scaleW, 130 * scaleW],
        label: {
          fontSize: 40 * scaleW
        }
      }
      const option = {
        title: {
          textStyle: {
            fontSize: scaleW * titleSzie
          }
        },
        series: new Array(5).fill(seriesOption)
      }
      this.mChart.setOption(option)
      this.mChart.resize()
    },
    startInterval() {
      this.timer && clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.currentPage++
        if (this.currentPage > 1) {
          this.currentPage = 0
        }
        this.updateC()
      }, 4000)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
