import request from '@/utils/request'

// api地址
const api = {
  list: 'user_card_voucher/list',
}

// 我的优惠券列表
export const list = (param, option) => {
  const options = {
    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
    load: true, //（默认 true 说明：本接口是否提示加载动画）
    ...option
  }
  return request.get(api.list, param, options)
}

