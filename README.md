# 专项 echarts 数据展示项目

## 安装依赖

```js
npm install // 安装前端依赖
cd server
npm install // 安装后端依赖
```

### 项目运行

```js
npm run serve// 运行前端项目
npm run dev // 运行后端项目
```

### 使用技术

```js
echarts // 开源可视化图表库
axios
webSocket // 互联网交互架构应用层的协议
koa2 // 基于 nodejs 平台的 web 开发框架
```

### 实现功能

#### 视图模块

- 支持大屏展示

#### 屏幕适配模块

- 通过监听屏幕改变的事件，从新计算字体的大小，实现字体大小的适配
- 通过 echartsInstance.resize（）实现改变图表尺寸
- 通过 debounce 函数实现屏幕响应函数的频繁调用

#### 换肤模块

- 当主题发生改变时重新初始化视图

#### 视图联动模块

- 一端操作，多端联动
- 通过 webSocket 实现数据推送

### 部分截图

#### 登陆页面

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/340013f7-c090-49e6-8783-9c8226f2487f.png" alt="">

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/31fa1bce-c46a-4fff-99bf-6e8839e8e2d0.png" alt="">

<img style="width:100%; margin-top:10px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-e3306813-c467-4fe2-a5b0-4f80a8d3051e/a5d5f482-b0d5-4003-9a25-fb63349ea7a2.png" alt="">

### 关于我

###### QQ:965536741 微信：xlh950829
