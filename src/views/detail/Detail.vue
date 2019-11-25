<template>
  <div id="detail">
    <!-- 动态路由方式传入 -->
    <!-- <h2>详情页{{ $route.params.iid }}</h2> -->
    <!-- 使用query方式传入参数 -->
    <!-- <h2>详情页{{ $route.query.iid }}</h2> -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probeType="3">
      <!-- 注意:属性:topImages  传入值:top-images -->
      <!-- 测试 -->
      <!-- <div>{{ $store.state.cartList.length }}</div> -->

      <ul>
        <li v-for="item in $store.state.cartList" :key="item.id">
          {{ item }}
        </li>
      </ul>

      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goodsInfo" />
      <detail-shop-info :shop="shopInfo" />
      <detail-image-info
        :detail-info="detailInfo"
        @detailImageLoad="detailImageLoad"
      />
      <detail-params-info ref="params" :param-info="itemParams" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
// 导入子组件
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailImageInfo from "./childComps/DetailImageInfo";
import DetailParamsInfo from "./childComps/DetailParamsInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

// 导入公共组件
import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

// 导入方法
import { getDetail, Goods, getRecommend } from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin";

export default {
  name: "Detail",
  mixins: [itemListenerMixin, backTopMixin],
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailImageInfo,
    DetailParamsInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goodsInfo: {},
      shopInfo: {},
      detailInfo: {},
      itemParams: {},
      commentInfo: {},
      recommends: [],
      // 监听放到mixin中
      // itemImageListener: null
      // 动态获取对应的offsetTop
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    };
  },
  methods: {
    detailImageLoad() {
      // console.log('-----)
      this.refresh();
      // 对省城的新的函数进行调用
      this.getThemeTopY();
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position) {
      // console.log(position);
      // 获取y值
      const positionY = -position.y;
      // positonY的值与themeTopY进行对比
      let length = this.themeTopYs.length;
      /*
      普通方法--数组中不添加最大值辅助判断
      for (let i = 0; i < length; i++) {
        if (
          this.currentIndex !== i &&
          ((i === length - 1 && positionY >= this.themeTopYs[i]) ||
            (i < length - 1 &&
              positionY >= this.themeTopYs[i] &&
              positionY < this.themeTopYs[i + 1]))
        ) {
          this.currentIndex = i;
          console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      } 
      */
      //  奇怪思路
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
          console.log(this.currentIndex);
        }
      }

      // 判断backtop是否显示
      this.listenShopBackTop(position);
    },
    addToCart() {
      // console.log("---");
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goodsInfo.title;
      product.desc = this.goodsInfo.desc;
      product.price = this.goodsInfo.realPrice;
      product.iid = this.iid;
      // 2.将商品添加到购物车里
      this.$store.dispatch("addCart", product);
    }
  },

  created() {
    // 1.获取并保存传入的iid
    this.iid = this.$route.params.iid;

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      console.log(res);
      // 1.获取数据
      // 将数据进行分离,全部数据都在res.result里
      const data = res.result;

      // 2.获取顶部轮播数据
      // console.log(res.result.itemInfo.topImages);
      this.topImages = data.itemInfo.topImages;

      // 3.获取商品信息
      this.goodsInfo = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 4.获取店铺信息
      this.shopInfo = data.shopInfo;

      // 5.获取商品详细信息
      this.detailInfo = data.detailInfo;

      // 6.保存参数信息
      this.itemParams = data.itemParams;

      // 7.获取评论信息
      if (data.rate.cRate != 0) {
        this.commentInfo = data.rate.list[0];
      }

      // 1.错误一:第一次获取没有值,原因是this.$refs.params.$el压根没有渲染,尝试放入$nextTick函数中
      /*
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      // 参数的offsetTop
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // 评论的offsetTop
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // 推荐的offsetTop
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      console.log(this.themeTopYs);
      */

      //  2.错误二:值不对,原因:图片没有计算在内--->最后还是放到了getThemeTopY
      /*
      this.$nextTick(() => {
        // 根据最新的数据,对应的DOM是已经被渲染出来了,单数图片依然没有加载完(offsetTop不包含图片)
        // 放入nextTick中才可以有数据
        this.themeTopYs = [];

        this.themeTopYs.push(0);
        // 参数的offsetTop
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // 评论的offsetTop
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // 推荐的offsetTop
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        console.log(this.themeTopYs);
      });
      */
    });

    // 3.请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list;
    });

    // 4.给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];

      this.themeTopYs.push(0);
      // 参数的offsetTop
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // 评论的offsetTop
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // 推荐的offsetTop
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // 给一个最大值,方便后续判断
      this.themeTopYs.push(Number.MAX_VALUE);

      // console.log(this.themeTopYs);
    }, 100);
  },
  mounted() {
    /* 放入mixin中
     const refresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemImageListener = () => {
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImageListener); */
  },
  updated() {
    // this.themeTopYs = [];
    // this.themeTopYs.push(0);
    // // 参数的offsetTop
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    // // 评论的offsetTop
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    // // 推荐的offsetTop
    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
    // console.log(this.themeTopYs);
  },
  destroyed() {
    // 离开时取消监听
    this.$bus.$off("itemImageLoad", this.itemImageListener);
  }
};
</script>

<style scoped>
#detail {
  height: 100vh;
  background-color: #fff;
  position: relative;
  z-index: 1;
}
/* 也可以在DetailNavBar里设置
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
} */
.content {
  height: calc(100% - 44px - 49px);
  background-color: #fff;
}
</style>
