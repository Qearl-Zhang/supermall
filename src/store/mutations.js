import { ADD_COUNTER, ADD_TO_CART } from './mutation-types'
export default {
  // mutations唯一的目的是修改state中的状态
  // mutations中的每一个方法尽可能完成的事情比较单一
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    // 默认加入购物车后是选中状态
    payload.checked = true
    state.cartList.push(payload)
  }
}