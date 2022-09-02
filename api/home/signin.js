import request from '@/utils/request'

// api地址
const api = {
  SameMonthSignIn: 'sign_in/SameMonthSignIn',
  signin:'sign_in/SignIn',
  listAll:'sign_in/ListAll',
  IfUserSignIn:'sign_in/IfUserSignIn'
}

// 签到记录
export const SameMonthSignIn = (param, option) => {
  const options = {
    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
    load: true, //（默认 true 说明：本接口是否提示加载动画）
    ...option
  }
  return request.get(api.SameMonthSignIn, param, options)
}
//用户签到
export const signin = (param, option) => {
  const options = {
    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
    load: true, //（默认 true 说明：本接口是否提示加载动画）
    ...option
  }
  return request.get(api.signin, param, options)
}
//签到积分赠送规则
export const listAll = (param, option) => {
  const options = {
    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
    load: true, //（默认 true 说明：本接口是否提示加载动画）
    ...option
  }
  return request.get(api.listAll, param, options)
}
//签到积分赠送规则
export const IfUserSignIn = (param, option) => {
  const options = {
    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
    load: true, //（默认 true 说明：本接口是否提示加载动画）
    ...option
  }
  return request.get(api.IfUserSignIn, param, options)
}