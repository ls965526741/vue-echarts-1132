<template>
  <div class="e-container">
    <div class="e-container hot" ref="hotRef"></div>
    <i :style="iconStyle" class="iconfont icon-left" @click="typeSwitch(currentIndex--)">&#xe6ef;</i>
    <i :style="iconStyle" class="iconfont icon-right" @click="typeSwitch(currentIndex++)">&#xe6ed;</i>
    <span :style="iconStyle" class="cate-name">{{ cateName }}</span>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { getData } from '@/api'
import { titleSzie } from '@/config'
export default {
  data() {
    return {
      mChart: null,
      list: [],
      currentIndex: 0,
      scaleW: 1,
      dbcScreenFit: null
    }
  },
  mounted() {
    this.init()
    this.dbcScreenFit = debounce(this.screenFit, 20)
    window.addEventListener('resize', this.dbcScreenFit)
    this.screenFit()
  },
  destroyed() {
    window.removeEventListener('resize', this.dbcScreenFit)
  },
  computed: {
    iconStyle() {
      return { fontSize: this.scaleW * 60 + 'px' }
    },
    cateName() {
      return this.list[this.currentIndex]?.name
    }
  },
  methods: {
    async init() {
      this.mChart = this.$echarts.init(this.$refs.hotRef, 'chalk')
      this.list = await getData('hotproduct')
      const option = {
        title: {
          text: '▎热销商品占比',
          left: '3%',
          top: '3%'
        },
        legend: {
          icon: 'circle',
          top: '15%',
          left: 30
        },
        tooltip: {
          formatter: ({ data }) => {
            let text = ''
            const total = data.children.reduce((a, b) => a + b.value, 0)
            data.children.forEach(
              item => (text += `${item.name} : ${parseFloat((item.value / total) * 100).toFixed(1)}% <br/>`)
            )
            return text
          }
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '60%'],
            label: {
              show: false
            },
            emphasis: {
              label: {
                // 连接文字的线条
                show: true,
                formatter: '{b}{d}%'
              }
            }
          }
        ]
      }
      this.mChart.setOption(option)
      this.update()
    },
    // 数据更新
    update() {
      const option = {
        series: [
          {
            data: this.list[this.currentIndex].children
          }
        ]
      }
      this.mChart.setOption(option)
    },
    // 屏幕适配
    screenFit() {
      const w = this.$refs.hotRef.offsetWidth

      const scaleW = w / 1440
      this.scaleW = scaleW
      const option = {
        title: {
          textStyle: {
            fontSize: scaleW * titleSzie
          }
        },
        legend: {
          itemWidth: scaleW * 35,
          itemHeight: scaleW * 35,
          // 图例的间隔
          itemGap: scaleW * 35,
          textStyle: {
            fontSize: scaleW * 35
          }
        },
        series: [
          {
            type: 'pie',
            radius: scaleW * 300
          }
        ]
      }
      this.mChart.setOption(option)
      this.mChart.resize()
    },
    typeSwitch() {
      this.currentIndex =
        this.currentIndex >= this.list.length ? 0 : this.currentIndex < 0 ? this.list.length - 1 : this.currentIndex
      this.update()
    }
  }
}
</script>

<style lang="scss" scoped>
.hot {
  position: relative;
}
.icon-left {
  position: absolute;
  top: 60%;
  left: 20%;
  color: #fff;
  transform: translateX(-50%);
  cursor: pointer;
}
.icon-right {
  position: absolute;
  top: 60%;
  left: 80%;
  color: #fff;
  transform: translateX(50%);
}
.cate-name {
  position: absolute;
  bottom: 30px;
  right: 30px;
  color: #fff;
}
</style>
