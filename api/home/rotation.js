import request from '@/utils/request'

// api地址
const api = {
  list: 'rotation_chart/list',
  info:'store/info',
  big_vip:'setting/big_vip'
}

// 轮播图列表
export const list = (param, option) => {
  const options = {
    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
    load: true, //（默认 true 说明：本接口是否提示加载动画）
    ...option
  }
  return request.get(api.list, param, options)
}

export const info = (param, option) => {
  const options = {
    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
    load: true, //（默认 true 说明：本接口是否提示加载动画）
    ...option
  }
  return request.get(api.info, param, options)
}

export const big_vip = (data) => {
  return request.post(api.big_vip, data)
}
