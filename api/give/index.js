import request from '@/utils/request'

// api地址
const api = {
  rule: 'luckyFree.index/rule',
  luckyList: 'luckyFree.index/list',
  myOrderList: 'luckyFree.index/myOrderList',
  goodsList: 'luckyFree.index/goodsList',
  real_time_order_list: 'luckyFree.order/real_time_order_list',
  create: 'luckyFree.order/create',
  detail: 'luckyFree.index/detail'
}

// 获取活动规则
export const rule = (data) => {
  return request.post(api.rule, data)
}

// 往期活动列表
export const luckyList = (data) => {
  return request.post(api.luckyList, data)
}

// 用户参与列表
export const myOrderList = (data) => {
  return request.post(api.myOrderList, data)
}
// 商品列表
export const goodsList = (data) => {
  return request.get(api.goodsList, data)
}
// 获取实时订单
export const real_time_order_list = (data) => {
  return request.post(api.real_time_order_list, data)
}

// 添加订单
// export const create = (data) => {
//   return request.get(api.create, data)
// }
export const create = (mode, data) => {
  return request.post(api.create, { mode, ...data })
}


// 获取活动信息
export const detail = (data) => {
  return request.post(api.detail, data)
}
