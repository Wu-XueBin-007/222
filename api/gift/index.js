import request from '@/utils/request'

// api地址
const api = {
  list: 'user_sign_in_gift/list',
  giftAdd: 'user_sign_in_gift/fill_address',
  receipt: 'user_sign_in_gift/receipt'
}

// 优惠券列表
export const list = (data) => {
  return request.post(api.list, data)
}

// 添加订单
export const giftAdd = (data) => {
  return request.post(api.giftAdd, data)
}

// 确定收货
export const receipt = (data) => {
  return request.post(api.receipt, data)
}
