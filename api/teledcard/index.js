import request from '@/utils/request'

// api地址
const api = {
  list: 'toll_card_order/list',
  detail: 'ticket_order/detail',
  add: 'toll_card_order/add',
  cancel: 'ticket_order/cancel',
  refund: 'ticket_order/refund',
  isFreeCollection: 'toll_card/isFreeCollection',
  subordinateOrder:'toll_card_order/subordinateOrder'
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
// 申请退款
export const refund = (data) => {
  return request.post(api.refund, data)
}
// 付款
export const isFreeCollection = (data) => {
  return request.post(api.isFreeCollection, data)
}
export const subordinateOrder = (data) => {
  return request.post(api.subordinateOrder, data)
}