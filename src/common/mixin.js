import { debounce } from "common/utils";
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
