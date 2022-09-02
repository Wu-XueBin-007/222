import request from '@/utils/request'

// api地址
const api = {
  list: 'discount_toll_card/list',
  detail: 'vip_toll_card_apply/detail',
  add: 'vip_toll_card_apply/add',
  cancel: 'vip_toll_card_apply/cancel',
  gList:'counter_goods/list',
  goods_order:'counter_goods_order/add',
  goodsOrderList:'counter_goods_order/list',
  goodsOrderDetail:'counter_goods_order/detail',
  user_goods_stockList:'user_goods_stock/list'
}

// 我的订单列表
export function list(param, option) {
  return request.post(api.list, param, option)
}

// 订单详情
export const detail = (data) => {
  return request.post(api.detail, data)
}
// 添加订单
export const add = (data) => {
  return request.post(api.add, data)
}
// 取消订单
export const cancel = (data) => {
  return request.post(api.cancel, data)
}

export function gList(param, option) {
  return request.post(api.gList, param, option)
}
// 
export const goods_order = (data) => {
  return request.post(api.goods_order, data)
}
export const goodsOrderList = (data) => {
  return request.post(api.goodsOrderList, data)
}
export const goodsOrderDetail = (data) => {
  return request.post(api.goodsOrderDetail, data)
}
export const user_goods_stockList = (data) => {
  return request.post(api.user_goods_stockList, data)
}