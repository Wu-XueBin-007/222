import request from '@/utils/request'

// api地址
const api = {
  userInfo: 'user/info',
  assets: 'user/assets',
  integralList: 'points.log/list',
  withdrawalAdd: 'withdrawal/add',
  edit_avatar: 'user/edit_avatar',
  edit_nick_name: 'user/edit_nick_name',
  edit_password: 'user/edit_password',
  check_edit_password: 'user/check_edit_password',
  profit: 'team/profit',
  profit_record: 'team/profit_record'
}

// 当前登录的用户信息
export const info = (param, option) => {
  const options = {
    isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
    load: true, //（默认 true 说明：本接口是否提示加载动画）
    ...option
  }
  return request.get(api.userInfo, param, options)
}

// 账户资产
export const assets = (param, option) => {
  return request.get(api.assets, param)
}

// 积分记录
export const integralList = (param, option) => {
  return request.get(api.integralList, param)
}

// 提现
export const withdrawalAdd = (param, option) => {
  return request.post(api.withdrawalAdd, param)
}

// 修改头像
export const edit_avatar = (param, option) => {
  return request.post(api.edit_avatar, param)
}

// 修改昵称
export const edit_nick_name = (param, option) => {
  return request.post(api.edit_nick_name, param)
}

// 修改密码
export const edit_password = (param, option) => {
  return request.post(api.edit_password, param)
}

// 验证码修改密码
export const check_edit_password = (param, option) => {
  return request.post(api.check_edit_password, param)
}

// 团队收益
export const profit = (param) => {
  return request.get(api.profit, param)
}

// 团队收益明细
export const profit_record = (param) => {
  return request.get(api.profit_record, param)
}