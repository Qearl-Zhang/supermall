<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-all"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      />
      <span>全选</span>
    </div>
    <div class="total-price">合计:{{ totalPrice }}</div>
    <div class="calculate" @click="calcClick">去计算({{ checkLength }})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

import { mapGetters } from "vuex";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(["cartList", "cartLength"]),
    totalPrice() {
      return (
        "¥" +
        this.cartList
          .filter(item => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      // 要判断如果商品数量为0的情况
      if (this.cartLength === 0) return false;
      // 使用find性能会比reduce高一些,因为不会遍历所有,一旦找到就会停止查找
      return !this.cartList.find(item => !item.checked);
      // 先从数组里遍历找有没有不被选中的,如果有,说明有长度,再取反
      // return !(this.cartList.filter(item=>item.checked).length)

      // 普通for遍历
      /*  for (let item of this.cartList) {
        if (!item.checked) {
          return false;
        }
      }
      return true; */
    }
  },
  methods: {
    checkClick() {
      // console.log("---");
      // 判断如果全部选中,那就全部不选中
      if (this.isSelectAll) {
        this.cartList.forEach(item => (item.checked = false));
      } else {
        this.cartList.forEach(item => (item.checked = true));
      }
    },
    calcClick() {
      // 判断不严谨,如果不是全选也会弹出,待优化
      if (!this.isSelectAll) {
        this.$toast.show("请选择商品", 1500);
      }
    }
  }
};
</script>

<style scoped>
.bottom-bar {
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background-color: #ccc;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.total-price {
  margin-left: 20px;
  flex: 1;
}
.check-all {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.calculate {
  width: 90px;
  background-color: orange;
  color: #fff;
  text-align: center;
}
</style>
