<template>
  <div id="detail">
    <!-- 动态路由方式传入 -->
    <!-- <h2>详情页{{ $route.params.iid }}</h2> -->
    <!-- 使用query方式传入参数 -->
    <!-- <h2>详情页{{ $route.query.iid }}</h2> -->
    <detail-nav-bar class="detail-nav" />
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goodsInfo" />
      <detail-shop-info :shop="shopInfo" />
      <detail-image-info
        :detail-info="detailInfo"
        @detailImageLoad="detailImageLoad"
      />
      <detail-params-info :param-info="itemParams" />
      <detail-comment-info :comment-info="commentInfo" />
      <goods-list :goods="recommends" />
    </scroll>
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

// 导入公共组件
import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

// 导入方法
import { getDetail, Goods, getRecommend } from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin } from "common/mixin";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailImageInfo,
    DetailParamsInfo,
    DetailCommentInfo,
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
      recommends: []
      // itemImageListener: null
    };
  },
  methods: {
    detailImageLoad() {
      // console.log('-----)
      this.refresh();
    }
  },
  mixins: [itemListenerMixin],
  created() {
    // 1.获取并保存传入的iid
    this.iid = this.$route.params.iid;

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // console.log(res);
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
    });

    // 3.请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list;
    });
  },
  mounted() {
    /* const refresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemImageListener = () => {
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImageListener); */
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
  height: calc(100% - 44px);
  background-color: #fff;
}
</style>
