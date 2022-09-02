import request from '@/utils/request'

// api地址
const api = {
  todoCounts: 'order/todoCounts',
  list: 'order/list',
  detail: 'order/detail',
  express: 'order/express',
  cancel: 'order/cancel',
  receipt: 'order/receipt',
  pay: 'order/pay',
  SinceCarry: 'order/SinceCarry',
  ScanCodeReceipt: 'order/ScanCodeReceipt',
  mergePay: 'order/merge_pay',
  merge_detail: 'order/merge_detail'
  
}

// 当前用户待处理的订单数量
export function todoCounts(param) {
  return request.get(api.todoCounts, param)
}

// 我的订单列表
export function list(param, option) {
  return request.get(api.list, param, option)
}

// 订单详情
export function detail(orderId, param) {
  return request.get(api.detail, { orderId, ...param })
}

// 组合订单详情
export function merge_detail(payOrderNo, param) {
  return request.get(api.merge_detail, { payOrderNo, ...param })
}

// 获取物流信息
export function express(orderId, param) {
  return request.get(api.express, { orderId, ...param })
}

// 取消订单
export function cancel(orderId, data) {
  return request.post(api.cancel, { orderId, ...data })
}

// 确认收货
export function receipt(orderId, data) {
  return request.post(api.receipt, { orderId, ...data })
}

// 立即支付
export function pay(orderId, payType, param) {
  return request.get(api.pay, { orderId, payType, ...param })
}

// 组合支付
export function mergePay(payOrderNo, payType, param) {
  return request.get(api.mergePay, { payOrderNo, payType, ...param })
}

// 核销码
export function SinceCarry(param) {
  return request.post(api.SinceCarry, param)
}

// 核销自提码
export function ScanCodeReceipt(param) {
  return request.post(api.ScanCodeReceipt, param)
}
