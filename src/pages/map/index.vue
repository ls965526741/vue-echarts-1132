<template>
  <div class="e-container" ref="mapRef" @dblclick="sendSocket({ key: 'china' })"></div>
</template>

<script>
import { getData } from '@/api'
import { debounce } from 'lodash'
import getProvinceMapInfo from '@/utils/map_utils.js'
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
      chinaMap: {},
      scatterList: []
    }
  },
  watch: {
    theme() {
      this.mChart.dispose()
      this.init()
      this.screenFit()
    }
  },
  mounted() {
    this.getList()
    this.$socket.registerCallBack('switchMap', this.updateC)
    window.addEventListener('resize', this.screenFit)
  },
  destroyed() {
    removeEventListener('resize', this.screenFit)
    this.$socket.unRegisterCallBack('switchMap', this.updateC)
  },
  methods: {
    getAllList() {
      return Promise.all([getData('map/china'), getData('map')])
    },
    async getList() {
      const res = await this.getAllList()
      this.chinaMap = res[0]
      this.scatterList = res[1]
      this.init()
      this.screenFit()
    },
    // 初始化图标
    init() {
      this.mChart = this.$echarts.init(this.$refs.mapRef, this.theme)
      this.$echarts.registerMap('china', this.chinaMap)
      const legendArr = this.scatterList.map(item => {
        return item.name
      })
      const series = this.scatterList.map(item => {
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
        title: {
          text: '▎商家分布',
          left: '3%',
          top: '3%'
        },
        legend: {
          left: '2%',
          bottom: '5%',
          // 图例的方向
          orient: 'verticle',
          data: legendArr.reverse()
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          zoom: 0.9,
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
        },
        series
      }
      this.mChart.setOption(option)
      this.mChart.on('click', arg => {
        const params = getProvinceMapInfo(arg.name)
        if (params.key !== undefined) {
          this.sendSocket(params)
        }
      })
    },
    sendSocket: debounce(function (map) {
      this.$socket.send({
        action: 'itemChange',
        socketType: 'switchMap',
        chartName: map
      })
    }, 200),
    // 更新图表
    async updateC({ chartName }) {
      let option = {}
      if (chartName.key !== 'china') {
        const res = await getData(chartName.path)
        this.$echarts.registerMap(chartName.key, res)
      }
      option = {
        geo: {
          map: chartName.key
        }
      }
      this.mChart.setOption(option)
      this.mChart.resize()
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
