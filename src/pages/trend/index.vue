<template>
  <div class="e-container">
    <div class="e-container trend" ref="trendRef"></div>
    <div class="e-title" :class="theme === 'chalk' ? '' : 'screen-color'">
      <div @click="sendSwitchTitle()">
        <span class="title-name"><span>▎</span>{{ currentTitle }} </span>
        <i class="iconfont icon-arrows">&#xe6eb;</i>
      </div>
      <div
        @click="sendSwitchTitle(item.key)"
        v-show="isShow"
        v-for="(item, index) in selectTitle"
        :key="index"
        class="select-title"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { getData } from '@/api'
import { debounce } from 'lodash'
import {} from '@/config'
export default {
  props: {
    theme: {
      type: String,
      default: 'chalk'
    }
  },
  data() {
    return {
      list: {},
      classify: 'commodity',
      dbcScreenFit: null,
      isShow: false
    }
  },
  created() {
    this.$socket.registerCallBack('switchTitle', this.switchTitle)
  },
  mounted() {
    this.dbcScreenFit = debounce(this.screenFit, 20)
    this.getList()
  },
  destroyed() {
    removeEventListener('resize', this.dbcScreenFit)
    this.$socket.registerCallBack('switchTitle', this.switchTitle)
  },
  computed: {
    currentTitle() {
      return this.list[this.classify]?.title
    },
    selectTitle() {
      const list = this.list.type ? this.list.type : []
      return list.filter(item => item.key !== this.classify)
    }
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
      this.list = await getData('trend')
      this.init()
      this.updateC()
      addEventListener('resize', this.dbcScreenFit)
      this.screenFit()
    },
    init() {
      this.mChart = this.$echarts.init(this.$refs.trendRef, this.theme)
      const option = {
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '3%',
          // 把x轴和y轴纳入 grid
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.list.common.month,
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        legend: {
          icon: 'circle',
          top: '14%'
        },
        tooltip: {
          trigger: 'axis'
        }
      }
      this.mChart.setOption(option)
    },
    updateC() {
      const seriesArr = []
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      this.list[this.classify].data.forEach((item, index) => {
        const obj = {
          name: item.name,
          data: item.data,
          stack: this.classify,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: colorArr1[index] // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: colorArr2[index] // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
        seriesArr.push(obj)
      })
      const option = {
        series: seriesArr
      }
      this.mChart.setOption(option)
    },
    screenFit() {
      const scaleW = this.$refs.trendRef.offsetWidth / 1440
      const option = {
        legend: {
          itemWidth: scaleW * 40,
          itemHeight: scaleW * 40,
          // 间距
          itemGap: scaleW * 40,
          textStyle: {
            fontSize: scaleW * 40
          }
        }
      }
      this.mChart.setOption(option)
      this.mChart.resize()
    },
    sendSwitchTitle(key, e) {
      if (key) {
        this.$socket.send({
          action: 'itemChange',
          socketType: 'switchTitle',
          chartName: key
        })
      } else {
        this.isShow = !this.isShow
      }
    },
    switchTitle({ chartName }) {
      this.classify = chartName
      this.updateC()
      this.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
// 切换主题的样式
.screen-color {
  background-color: #fff !important;
  color: #161522 !important;
}
.trend {
  position: relative;
}
.e-title {
  position: absolute;
  top: 3%;
  left: 3%;
  background-color: #222733;
  color: #fff;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .title-name {
    position: relative;
    span {
      position: absolute;
      left: -8px;
    }
  }
  > div {
    padding: 5px 10px 5px 15px;
  }
  .icon-arrows {
    font-size: 18px;
  }
  > div:hover {
    background-color: #dddddd;
    border-radius: 6px;
    color: #161522;
  }
}
.e-title:hover {
  background-color: #222733;
}
</style>
