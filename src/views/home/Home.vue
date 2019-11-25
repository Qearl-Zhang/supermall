<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!-- 复制一份tab-control组件对象,利用它实现停留效果 -->
    <!-- 当滚动到一定位置时,这个tab-control显示出来;没有滚动到时,隐藏起来 -->
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="topTabControl"
      class="tab-control"
      v-show="isTabFixed"
    ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <!-- 轮播图 -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <!-- 下方四个小按钮 -->
      <home-recommend-view :recommends="recommends" />
      <!-- 推荐特征 -->
      <feature-view />
      <!-- 控制栏 -->
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl"
      ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
// 公共组件导入
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
// Better-Scroll组件
import Scroll from "components/common/scroll/Scroll";
// 返回顶部组件,放入mixin
import BackTop from "components/content/backTop/BackTop";

// 子组件导入
import HomeSwiper from "./childComps/HomeSwiper";
import HomeRecommendView from "./childComps/HomeRecommendView";
import FeatureView from "./childComps/FeatureView";

// 方法导入
import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin";

export default {
  name: "Home",
  mixins: [backTopMixin],
  components: {
    HomeSwiper,
    HomeRecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    // 放入mixin.js
    BackTop
  },
  data() {
    return {
      // result: null
      banners: [],
      recommends: [],
      goods: {
        pop: {
          page: 0,
          list: []
        },
        new: {
          page: 0,
          list: []
        },
        sell: {
          page: 0,
          list: []
        }
      },
      currentType: "pop",
      // 放入mixin
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
      // itemImageListener: null
    };
  },
  mixins: [itemListenerMixin],
  created() {
    // 1.请求多个数据(轮播图,下方推荐)
    this.getHomeMultidata();
    // 2.请求商品数据(流行,新款,精选)
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    /* 使用混入mixin
    // 1.item中图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    // 对监听的事件进行保存
    this.itemImageListener = () => {
      // console.log("---------");
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImageListener);
    // 2.获取tabControl的offsetTop
    // 所有组件都有一个属性$el:用于获取组件中的元素
    // this.tabOffsetTop = this.$refs.tabControl.$el;
    // console.log(this.$refs.tabControl.$el.offsetTop);
    */
  },
  destroyed() {
    // console.log("home destroyed");
  },
  activated() {
    // console.log("activated");
    // 重新回到时,设置位置
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    // 最好回来时,进行一次刷新refresh()
    this.$refs.scroll.refresh();
  },
  deactivated() {
    // console.log("deactivated");
    // 1.离开页面时,保存saveY的值
    this.saveY = this.$refs.scroll.getScrollY();
    // 2.取消全局事件的监听
    this.$bus.$off("itemImageLoad", this.itemImageListener);
  },
  methods: {
    /* 网络请求相关方法*/
    getHomeMultidata() {
      //1.请求多个数据(轮播图,下方推荐)
      getHomeMultidata().then(res => {
        // 如果没有关闭eslint,只了解clg会出现解析错误,需要打印window.console.log
        //   window.console.log(res);
        //   在vue.config文件里关闭eslint后就不会报错了
        //   console.log(res);
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        // console.log(res.data);
        // 为了防止res(局部变量)被垃圾回收机制回收,所以要将数据保存起来(把一个数组放到另一个数组里)
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 上拉加载更多默认只执行一次
        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    },

    /* 事件监听相关方法 */
    tabClick(index) {
      // console.log(index);
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          //   最后这个break可写可不写
          break;
      }
      // 两个tab-control点击保持一致
      this.$refs.topTabControl.currentIndex = index;
      this.$refs.tabControl.currentIndex = index;
    },

    // 回到顶部,放入mixin.js
    backClick() {
      // console.log("监听点击");
      this.$refs.scroll.scrollTo(0, 0, 500);
    },

    // 滚动区域>1000时,显示返回顶部按钮
    contentScroll(position) {
      // console.log(position);
      // --------方法methods内部的内容不能再抽取到mixin中
      // 1.判断backtop是否显示
      this.isShowBackTop = -position.y > 1000;
      // 2.决定tab-control是否吸顶(position:fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },

    // 加载更多
    loadMore() {
      // console.log("加载更多");
      this.getHomeGoods(this.currentType);
    },
    // 轮播图图片加载完成
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  }
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 使用浏览器原生滚动时,为了让导航不跟随一起滚动,所以使用下方代码 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999; */
}

.content {
  /* height: 300px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
}
/* .content {
  css3里的计算属性calc,注意#home的高度应该是100vh(视口高度)
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */

.tab-control {
  position: relative;
  z-index: 999;
  background-color: #fff;
}
</style>
