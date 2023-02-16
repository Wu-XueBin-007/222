import request from '@/utils/request'

// api地址
const api = {
  detail: 'common/detail',
  blockChina:'blockChain/status',
  settingdetail:'setting/agent'
}

// 商品评价列表
export const detail = (param) => {
  return request.post(api.detail,param)
}
export const settingdetail = (param) => {
  return request.get(api.settingdetail,param)
}
export const blockChina = (param) => {
  return request.get(api.blockChina, param)
} 
