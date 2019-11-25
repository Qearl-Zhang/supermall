import { debounce } from "./utils";
// import { back_position } from "./const";
import BackTop from "components/content/backTop/BackTop";

// 混入
export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 200);
    this.itemImageListener = () => {
      this.refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImageListener);
    // console.log('我是混入的内容');
  }
}

// 返回顶部
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      // console.log("监听点击");
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    listenShopBackTop(position) {
      this.isShowBackTop = -position.y > 1000;
    },
  },
} 
