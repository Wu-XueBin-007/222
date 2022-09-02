import request from '@/utils/request'

// api地址
const api = {
  detail: 'common/detail'
}

// 优惠券列表
export const detail = (data) => {
  return request.post(api.detail, data)
}

