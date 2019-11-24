import { request } from './request';

export function getDetail(iid) {
  return request({
    url: '/detail',
    params: {
      // iid:iid
      // es6语法--此处可以省略写成
      iid
    }
  })
}

// 推荐信息
export function getRecommend() {
  return request({
    url: '/recommend'
  })
}

// es6里定义class,必须掌握构造函数constructor
// 把杂乱无章的数据整合到一起

// 商品信息
export class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title
    this.desc = itemInfo.desc
    this.newPrice = itemInfo.price
    this.oldPrice = itemInfo.oldPrice
    this.discount = itemInfo.discountDesc
    this.discountBgColor = itemInfo.discountBgColor
    this.columns = columns
    this.services = services
    this.realPrice = itemInfo.lowNowPrice
  }
}

// 店铺信息---因为数据都是在shopInfo中,所以可以不做提取
/* export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods
  }
}
 */
