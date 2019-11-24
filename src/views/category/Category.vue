<template>
  <div class="wrapper" ref="aaaa">
    <div>
      <!-- 无论是否设置click:false(默认是false),button都可以点击 -->
      <button @click="btnClick">按钮</button>
      <!-- 必须设置click:true,div才能监听点击 -->
      <div @click="divClick" class="divbox">哈哈哈哈哈哈</div>
      <ul class="content">
        <li>分类列表</li>
        <li>分类列表1</li>
        <li>分类列表2</li>
        <li>分类列表3</li>
        <li>分类列表4</li>
        <li>分类列表5</li>
        <li>分类列表6</li>
        <li>分类列表7</li>
        <li>分类列表8</li>
        <li>分类列表9</li>
        <li>分类列表10</li>
        <li>分类列表11</li>
        <li>分类列表12</li>
        <li>分类列表13</li>
        <li>分类列表14</li>
        <li>分类列表15</li>
        <li>分类列表16</li>
        <li>分类列表17</li>
        <li>分类列表18</li>
        <li>分类列表19</li>
        <li>分类列表20</li>
        <li>分类列表21</li>
        <li>分类列表22</li>
        <li>分类列表23</li>
        <li>分类列表24</li>
        <li>分类列表25</li>
        <li>分类列表26</li>
        <li>分类列表27</li>
        <li>分类列表28</li>
        <li>分类列表29</li>
        <li>分类列表30</li>
        <li>分类列表31</li>
        <li>分类列表32</li>
        <li>分类列表33</li>
        <li>分类列表34</li>
        <li>分类列表35</li>
        <li>分类列表36</li>
        <li>分类列表37</li>
        <li>分类列表38</li>
        <li>分类列表39</li>
        <li>分类列表40</li>
        <li>分类列表41</li>
        <li>分类列表42</li>
        <li>分类列表43</li>
        <li>分类列表44</li>
        <li>分类列表45</li>
        <li>分类列表46</li>
        <li>分类列表47</li>
        <li>分类列表48</li>
        <li>分类列表49</li>
        <li>分类列表50</li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Category",
  created() {},
  mounted() {
    // new BScroll(document.querySelector(".wrapper"), {});
    // 默认情况下BScroll是不可以实施监听滚动的位置,需要传入第二个参数option,通过probeType侦测.
    // probeType:0  不侦测实时的位置
    // probeType:1  同上
    // probeType:2  在手指滚动过程中侦测,手指离开后的惯性滚动过程不侦测
    // probeType:3  只要是滚动,都侦测

    // click点击
    // click:false  默认是false,无论是true还是false,button都可以点击
    // click:true   只有为true的时候,div的点击才能监听点击

    // pullUpLoad:上拉加载更多
    this.scroll = new BScroll(".wrapper", {
      click: true,
      probeType: 3,
      pullUpLoad: true
    });
    this.scroll.on("scroll", position => {
      // console.log(position);
    });
    this.scroll.on("pullingUp", () => {
      // 只会打印一次"上拉加载更多"
      console.log("上拉加载更多");
      // 发送网络请求,请求更多的数据
      // 等数据请求完成,并且将新的数据展示出来后
      setTimeout(() => {
        this.scroll.finishPullUp();
      }, 2000);
    });
  },
  data() {
    return {
      scroll: null
    };
  },
  methods: {
    btnClick() {
      // console.log("btnClick");
    },
    divClick() {
      // console.log("divClick");
    }
  }
};
</script>

<style scoped>
.wrapper {
  height: 150px;
  background-color: orange;
  overflow: hidden;
  /* overflow-y: scroll; */
}
/* .divbox {
  width: 200px;
  height: 20px;
  background-color: lightgreen;
} */
</style>
