<template>
  <div>
    <div id="home">
      <nav-bar class="home-nav">
        <div slot="center">购物街</div>
      </nav-bar>
      <!-- 轮播图 -->
      <home-swiper :banners="banners" />
      <!-- 下方四个小按钮 -->
      <home-recommend-view :recommends="recommends" />
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import HomeSwiper from "./childComps/HomeSwiper";
import HomeRecommendView from "./childComps/HomeRecommendView";
// import Swiper from 'components/common/swiper/Swiper'
// import SwiperItem from 'components/common/swiper/SwiperItem'
// import { Swiper, SwiperItem } from "components/common/swiper";
import { getHomeMultidata } from "network/home";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    HomeRecommendView
  },
  data() {
    return {
      // result: null
      banners: [],
      recommends: []
    };
  },
  created() {
    //1.请求多个数据(轮播图,下方小导航)
    getHomeMultidata().then(res => {
      // 如果没有关闭eslint,只了解clg会出现解析错误,需要打印window.console.log
      //   window.console.log(res);
      //   在vue.config文件里关闭eslint后就不会报错了
      console.log(res);
      // this.result = res;
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list;
    });
  }
};
</script>

<style scoped>
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
