import request from '@/utils/request'

// api地址
const api = {
  list: 'mobile_recharge_discount/list',
  get: 'user/getMobile',
  add: 'mobile_recharge/recharge',
  orderList: 'mobile_recharge/list'
}

// 话费充值套餐
export const list = (data) => {
  return request.post(api.list, data)
}

// 查询手机号
export const get = (data) => {
  return request.post(api.get, data)
}

// 下单
export const add = (data) => {
  return request.post(api.add, data)
}

// 充值记录
export const orderList = (data) => {
  return request.post(api.orderList, data)
}


