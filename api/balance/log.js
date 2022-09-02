import request from '@/utils/request'

// api地址
const api = {
  list: 'balance.log/list',
  backList: 'refund/list',
  info: 'balance.log/info'
  
}

// 余额账单明细
export const list = (param) => {
  return request.get(api.list, param)
}

// 退款明细
export const backList = (param) => {
  return request.get(api.backList, param)
}

// 统计
export const info = (param) => {
  return request.get(api.info, param)
}
