<template>
  <div class="e-container">
    <div class="e-container hot" ref="hotRef"></div>
    <i :style="iconStyle" class="iconfont icon-left" @click="sendSocket(currentIndex--)">&#xe6ef;</i>
    <i :style="iconStyle" class="iconfont icon-right" @click="sendSocket(currentIndex++)">&#xe6ed;</i>
    <span :style="iconStyle" class="cate-name">{{ cateName }}</span>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { getData } from '@/api'
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
      mChart: null,
      list: [],
      currentIndex: 0,
      scaleW: 1,
      iconStyle: { fontSize: '', color: '' },
      dbcScreenFit: null
    }
  },
  mounted() {
    this.$socket.registerCallBack('hotSelect', this.typeSwitch)
    this.getList()
  },
  destroyed() {
    window.removeEventListener('resize', this.dbcScreenFit)
    this.$socket.unRegisterCallBack('hotSelect', this.typeSwitch)
  },
  computed: {
    cateName() {
      return this.list[this.currentIndex]?.name
    }
  },
  watch: {
    theme(newVal) {
      this.iconStyle.color = newVal === 'chalk' ? '#fff' : '#000'
      this.mChart.dispose()
      this.init()
      this.screenFit()
      this.updateC()
    }
  },
  methods: {
    async getList() {
      this.list = await getData('hotproduct')
      this.init()
      this.dbcScreenFit = debounce(this.screenFit, 20)
      window.addEventListener('resize', this.dbcScreenFit)
      this.screenFit()
    },
    init() {
      this.mChart = this.$echarts.init(this.$refs.hotRef, this.theme)
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
            labelLine: {
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
      this.updateC()
    },
    // 数据更新
    updateC() {
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
      this.iconStyle.fontSize = this.scaleW * 60 + 'px'
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
    sendSocket() {
      const i =
        this.currentIndex >= this.list.length ? 0 : this.currentIndex < 0 ? this.list.length - 1 : this.currentIndex
      this.$socket.send({
        action: 'itemChange',
        socketType: 'hotSelect',
        chartName: i
      })
    },
    // 切换饼图数据
    typeSwitch({ chartName }) {
      this.currentIndex = chartName
      this.updateC()
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
  left: 15%;
  color: #fff;
  transform: translateX(-0);
  cursor: pointer;
}
.icon-right {
  position: absolute;
  top: 60%;
  right: 15%;
  color: #fff;
  transform: translateX(0);
}
.cate-name {
  position: absolute;
  bottom: 30px;
  right: 30px;
  color: #fff;
}
</style>
