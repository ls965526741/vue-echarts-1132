<template>
  <div class="screen-container" :class="theme === 'chalk' ? '' : 'screen-color'">
    <header class="screen-header">
      <div>
        <img src="~@/assets/images/header_border_dark.png" alt="" />
        <img src="~@/assets/images/header_border_light.png" alt="" />
      </div>
      <span class="logo">
        <a href="https://echarts.apache.org/examples/zh/index.html">echarts</a>
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img
          v-show="theme === 'chalk'"
          @click="sendTheemChange('chalk')"
          src="~@/assets/images/qiehuan_dark.png"
          class="qiehuan"
          alt="切换主题"
          title="切换主题"
        />
        <img
          v-show="theme !== 'chalk'"
          @click="sendTheemChange('westeros')"
          src="~@/assets/images/qiehuan_light.png"
          class="qiehuan"
          alt="切换主题"
          title="切换主题"
        />
        <div class="datetime">{{ currentData }}</div>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="{ fullscreen: isZoom.trend }">
          <!-- 销量趋势图表 -->
          <trend ref="trend" :theme="theme" />
          <div class="resize">
            <span
              class="iconfont"
              :class="isZoom.trend ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="sendScreenChange('trend')"
            ></span>
          </div>
        </div>
        <div id="left-bottom" :class="{ fullscreen: isZoom.seller }">
          <!-- 商家销售金额图表 -->
          <seller ref="seller" :theme="theme" />
          <div class="resize">
            <span
              class="iconfont"
              :class="isZoom.seller ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="sendScreenChange('seller')"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="{ fullscreen: isZoom.map }">
          <!-- 商家分布图表 -->
          <china-map ref="map" :theme="theme" />
          <div class="resize">
            <span
              class="iconfont"
              :class="isZoom.map ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="sendScreenChange('map')"
            ></span>
          </div>
        </div>
        <div id="middle-bottom" :class="{ fullscreen: isZoom.rank }">
          <!-- 地区销量排行图表 -->
          <rank ref="rank" :theme="theme" />
          <div class="resize">
            <span
              class="iconfont"
              :class="isZoom.rank ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="sendScreenChange('rank')"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="{ fullscreen: isZoom.hot }">
          <!-- 热销商品占比图表 -->
          <hot ref="hot" :theme="theme" />
          <div class="resize">
            <span
              class="iconfont"
              :class="isZoom.hot ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="sendScreenChange('hot')"
            ></span>
          </div>
        </div>
        <div id="right-bottom" :class="{ fullscreen: isZoom.stock }">
          <!-- 库存销量分析图表 -->
          <stock ref="stock" :theme="theme" />
          <div class="resize">
            <span
              class="iconfont"
              :class="isZoom.stock ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="sendScreenChange('stock')"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '@/pages/hot'
import ChinaMap from '@/pages/map'
import Rank from '@/pages/rank'
import Seller from '@/pages/seller'
import Trend from '@/pages/trend'
import Stock from '@/pages/stock'
import { formatDate } from '@/utils/common.js'

export default {
  name: 'ScreenPage',
  components: {
    Hot,
    ChinaMap,
    Rank,
    Seller,
    Trend,
    Stock
  },
  data() {
    return {
      isZoom: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      },
      theme: 'chalk',
      currentData: '',
      timer: null
    }
  },
  created() {
    this.$socket.registerCallBack('fullScreen', this.fullScreen)
    this.$socket.registerCallBack('themeChange', this.themeChange)
    this.startInterval()
  },
  destroyed() {
    clearInterval(this.timer)
    this.$socket.unRegisterCallBack('fullScreen', this.fullScreen)
    this.$socket.unRegisterCallBack('themeChange', this.themeChange)
  },
  methods: {
    sendScreenChange(index) {
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: index
      })
    },
    fullScreen({ chartName }) {
      this.isZoom[chartName] = !this.isZoom[chartName]
      this.$nextTick(this.$refs[chartName].screenFit)
    },

    sendTheemChange(theme) {
      theme = theme === 'chalk' ? 'westeros' : 'chalk'
      this.$socket.send({
        action: 'themeChange',
        socketType: 'themeChange',
        isChalk: theme
      })
    },
    themeChange({ isChalk }) {
      this.theme = isChalk
    },
    startInterval() {
      this.timer && clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.currentData = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 9999;
}
// 切换主题的样式
.screen-color {
  background-color: #dddddd !important;
  color: #161522 !important;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    a {
      text-decoration: none;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
