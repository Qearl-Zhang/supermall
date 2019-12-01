module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px-to-viewport": {
      viewportWidth: 375, //视口宽度,对应设计稿宽度
      viewportHeight: 375, //视口高度,对应设计稿高度(也可不配置)
      unitPrecision: 5, //指定'px'转换为视口单位值的小数位数
      viewportUnit: 'vw',
      selectorBlackList: ['ignore', 'tab-bar', 'tab-bar-item'], //指定不需要转换的类
      minPixelValue: 1, //小于或等于1px不转换为视口单位
      mediaQuery: false, //允许在媒体查询中转换为'px'
      // exclude: ['TabBarItem.vue']
      exclude: [/TabBar/]
    },
  }
}