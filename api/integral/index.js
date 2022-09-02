import request from '@/utils/request'

// api地址
const api = {
  list: 'integral_goods/list',
  detail: 'integral_goods/detail',
  orderList: 'integral_goods_order/list',
  orderAdd: 'integral_goods_order/add',
  receipt: 'integral_goods_order/receipt'
}

// 积分商品列表
export const list = (param) => {
  return request.get(api.list, param)
}

// 积分商品详情
export const detail = (param) => {
  return request.post(api.detail, param)
}

// 积分商品兑换记录
export const orderList = (param) => {
  return request.post(api.orderList, param)
}

// 积分商品下单
export const orderAdd = (param) => {
  return request.post(api.orderAdd, param)
}

// 积分商品确认收货
export const receipt = (param) => {
  return request.post(api.receipt, param)
}
