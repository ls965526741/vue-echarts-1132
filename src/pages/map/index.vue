<template>
  <div class="e-container" ref="mapRef" @dblclick="switchMap('china')"></div>
</template>

<script>
import { getData } from '@/api'
import { debounce } from 'lodash'
import getProvinceMapInfo from '@/utils/map_utils.js'
import { titleSzie } from '@/config'
export default {
  data() {
    return {
      mChart: null,
      dbcDebounce: null
    }
  },
  methods: {
    // 获取散点图数据
    async getList() {
      const res = await getData('map')
      this.update(res)
    },
    // 初始化图标
    async init() {
      this.mChart = this.$echarts.init(this.$refs.mapRef, 'chalk')
      const chinaMap = await getData('map/china')
      this.$echarts.registerMap('china', chinaMap)
      const option = {
        title: {
          text: '▎商家分布',
          left: '3%',
          top: '3%'
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          // 允许拖动及缩放
          roam: true,
          // zoom: 1.1, //默认缩放比例
          itemStyle: {
            // 地图的填充色
            areaColor: '#2E72BF',
            // 省份的边框色
            borderColor: '#333'
          },
          label: {
            show: true,
            color: 'white',
            formatter: '{a}'
          }
        }
      }
      this.mChart.setOption(option)
      this.mChart.on('click', async arg => {
        const params = getProvinceMapInfo(arg.name)
        if (params.key === undefined) {
          return false
        }
        const res = await getData(params.path)
        this.$echarts.registerMap(params.key, res)
        const option = {
          geo: {
            map: params.key
          },
          series: [],
          legend: {}
        }
        this.mChart.setOption(option)
      })
    },
    // 更新图表
    update(res = []) {
      const legendArr = res.map(item => {
        return item.name
      })
      const seriesArr = res.map(item => {
        // return 一个类别下的所有散点数据
        return {
          type: 'effectScatter',
          // 图例的name需要与series的name相同
          name: item.name,
          data: item.children,
          // 让散点图使用地图坐标系统
          coordinateSystem: 'geo',
          // 涟漪动画效果配置
          rippleEffect: {
            // 涟漪效果直径
            scale: 5,
            // 空心的涟漪动画效果
            brushType: 'stroke'
          }
        }
      })
      const option = {
        legend: {
          left: '2%',
          bottom: '5%',
          // 图例的方向
          orient: 'verticle',
          data: legendArr.reverse()
        },
        series: seriesArr
      }
      this.mChart.setOption(option)
    },
    // 屏幕适配
    screenFit() {
      const scaleW = this.$refs.mapRef.offsetWidth / 1440 // 全屏下不缩放
      const option = {
        title: {
          textStyle: {
            fontSize: scaleW * titleSzie
          }
        },
        legend: {
          itemWidth: scaleW * 30,
          // 图例高度
          itemHeight: scaleW * 30,
          // 间隔
          itemGap: scaleW * 30,
          textStyle: {
            fontSize: scaleW * 30
          }
        }
      }
      this.mChart.setOption(option)
      this.mChart.resize()
    },
    // 切换地图
    switchMap(map) {
      const option = {
        geo: {
          map
        }
      }
      this.mChart.setOption(option)
    }
  },
  mounted() {
    this.init()
    this.getList()
    window.addEventListener('resize', debounce(this.screenFit, 20))
    this.screenFit()
  }
}
</script>

<style lang="scss" scoped>
</style>
