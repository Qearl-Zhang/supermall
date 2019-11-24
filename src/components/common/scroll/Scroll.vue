<template>
  <!-- ref一般绑定给子组件 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null,
      message: "123456哈哈哈"
    };
  },
  mounted() {
    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      // 不加click: true就没办法点击tabcontrol
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    });
    // 2.监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", position => {
        // console.log(position);
        this.$emit("scroll", position);
      });
    }
    // 3.监听scroll滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        // console.log("监听滚动到底部");
        // 子组件向父组件里回调
        this.$emit("pullingUp");
      });
    }
  },
  methods: {
    // 封装方法--返回顶部
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    // 封装方法--刷新
    refresh() {
      this.scroll && this.scroll.refresh();
      // console.log("---------");
    },
    // 封装方法--完成上拉加载更多
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    //封装方法--当前的scrollY
    getScrollY() {
      return this.scroll ? this.scroll.y : 0;
    }
  }
};
</script>

<style scoped></style>
