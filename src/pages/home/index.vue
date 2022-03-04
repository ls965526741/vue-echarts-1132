<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <!-- <img :src="headerSrc" alt=""> -->
        <img src="~@/assets/images/header_border_dark.png" alt="" />
        <img src="~@/assets/images/header_border_light.png" alt="" />
      </div>
      <span class="logo">
        <a href="https://www.bookbook.cc">echarts</a>
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <!-- <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme" alt="切换主题" title="切换主题"> -->
        <img
          v-show="theme === 'chalk'"
          @click="themeSwitch('chalk')"
          src="~@/assets/images/qiehuan_dark.png"
          class="qiehuan"
          alt="切换主题"
          title="切换主题"
        />
        <img
          v-show="theme !== 'chalk'"
          @click="themeSwitch('westeros')"
          src="~@/assets/images/qiehuan_light.png"
          class="qiehuan"
          alt="切换主题"
          title="切换主题"
        />
        <div class="datetime">{{}}</div>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="{ fullscreen: isZoom.trend }">
          <!-- 销量趋势图表 -->
          <trend ref="trend"></trend>
          <div class="resize">
            <!-- icon-compress-alt 向内 -->
            <!-- icon-expand-alt -->
            <span
              class="iconfont"
              :class="isZoom.trend ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="zoomCharts('trend')"
            ></span>
          </div>
        </div>
        <div id="left-bottom" :class="{ fullscreen: isZoom.seller }">
          <!-- 商家销售金额图表 -->
          <seller ref="seller"></seller>
          <div class="resize">
            <span
              class="iconfont"
              :class="isZoom.seller ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="zoomCharts('seller')"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="{ fullscreen: isZoom.map }">
          <!-- 商家分布图表 -->
          <china-map ref="map" />
          <div class="resize" :class="{ fullscreen: isZoom.map }">
            <span
              class="iconfont"
              :class="isZoom.map ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="zoomCharts('map')"
            ></span>
          </div>
        </div>
        <div id="middle-bottom" :class="{ fullscreen: isZoom.rank }">
          <!-- 地区销量排行图表 -->
          <rank ref="rank"></rank>
          <div class="resize">
            <span
              class="iconfont"
              :class="isZoom.rank ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="zoomCharts('rank')"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="{ fullscreen: isZoom.hot }">
          <!-- 热销商品占比图表 -->
          <hot ref="hot"></hot>
          <div class="resize">
            <span
              class="iconfont"
              :class="isZoom.hot ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="zoomCharts('hot')"
            ></span>
          </div>
        </div>
        <div id="right-bottom" :class="{ fullscreen: isZoom.stock }">
          <!-- 库存销量分析图表 -->
          <stock ref="stock"></stock>
          <div class="resize">
            <span
              class="iconfont"
              :class="isZoom.stock ? 'icon-compress-alt' : 'icon-expand-alt'"
              @click="zoomCharts('stock')"
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
import Stock from '@/pages/stock'
import Trend from '@/pages/trend'
// import getThemeValue from '@/utils/theme.utils.js'

export default {
  name: 'ScreenPage',
  components: {
    Hot,
    ChinaMap,
    Rank,
    Seller,
    Stock,
    Trend
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
      theme: 'chalk'
    }
  },
  created() {},
  computed: {},
  destroyed() {},
  methods: {
    zoomCharts(index) {
      this.isZoom[index] = !this.isZoom[index]
      this.$nextTick(this.$refs[index].screenFit)
    },
    themeSwitch(theme) {
      this.theme = theme === 'chalk' ? 'westeros' : 'chalk'
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
