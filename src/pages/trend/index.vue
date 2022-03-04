<template>
  <div class="e-container">
    <div class="e-container trend" ref="trendRef"></div>
    <div class="e-title">
      <div @click="switchTitle()">
        <span>▎ {{ currentTitle }} </span>
        <i class="iconfont icon-arrows">&#xe6eb;</i>
      </div>
      <div
        @click="switchTitle(item.key)"
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
  data() {
    return {
      list: {},
      classify: 'commodity',
      dbcScreenFit: null,
      isShow: false
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
  computed: {
    currentTitle() {
      return this.list[this.classify]?.title
    },
    selectTitle() {
      const list = this.list.type ? this.list.type : []
      return list.filter(item => item.key !== this.classify)
    }
  },
  methods: {
    async init() {
      this.mChart = this.$echarts.init(this.$refs.trendRef, 'chalk')
      const res = await getData('trend')
      this.list = res

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
          data: res.common.month,
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
      this.update()
    },
    update() {
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
    switchTitle(key, e) {
      if (key) {
        this.classify = key
        this.update()
        this.isShow = false
      } else {
        this.isShow = !this.isShow
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.trend {
  position: relative;
}
.e-title {
  position: absolute;
  top: 3%;
  left: 3%;
  background-color: #222733;
  color: #fff;
  padding-left: 8px;
  border-radius: 4px;
  font-size: 6%;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .icon-arrows {
    font-size: 10%;
  }
  .select-title {
    text-indent: 1em;
    padding-left: 6%;
  }
}
.e-title:hover {
  background-color: #000;
}
</style>
