import { RegExp } from "core-js";

// 公共的方法抽取到这里
// 防抖函数--用于优化性能
export function debounce(func, delay = 50) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 正则表达式===>一个字符串匹配利器
// "y+"-->1个或者多个y
// "y*"-->0个或者多个y
// "y?"-->0个或者1个y
// 字符串格式化---时间戳过滤器

// date.getFullYear() + ''--->隐式转换成字符串
// RegExp.$1 --->表示获取的年份
// 字符串.substr(数字)--->表示截取前数字位(例如:前2位)
export function formatDate(date, fmt) {
  // 1.获取年份
  // yy--19
  // yyyy--2019
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  // 2.获取月份,日期等
  // M+:正则表达式中的一个规则
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}
// 补齐成2位
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}