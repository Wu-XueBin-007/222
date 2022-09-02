import request from '@/utils/request'

// api地址
const api = {
  flow_list: 'advert.money/flow_list',
  get_balance: 'advert.money/get_balance',
  withdraw: 'advert.money/withdraw',
  beforeProfit: 'advert.money/beforeProfit',
  profit: 'advert.money/profit',
  advert_register: 'advert.plan/advert_register',
  list: 'advert.plan/list',
  detail: 'advert.plan/detail',
  no_interest: 'advert.plan/no_interest',
  video_mid: 'advert.plan/video_mid',
  report: 'advert.plan/report',
  cardForm: 'advert.plan/cardForm'
}

// 获取用户收益/提现记录
export const flow_list = (data) => {
  return request.post(api.flow_list, data)
}

// 获取用户余额
export const get_balance = (data) => {
  return request.post(api.get_balance, data)
}

// 发起提现
export const withdraw = (data) => {
  return request.post(api.withdraw, data)
}
// 广告主注册链接
export const advert_register = (data) => {
  return request.get(api.advert_register, data)
}
// 获取收益
export const profit = (data) => {
  return request.post(api.profit, data)
}

// 点开广告开始时请求
export const beforeProfit = (data) => {
  return request.post(api.beforeProfit, data)
}

// 获取广告列表
export const list = (data) => {
  return request.post(api.list, data)
}

// 获取广告详情
export const detail = (data) => {
  return request.post(api.detail, data)
}

// 点击视频广告中间页
export const video_mid = (data) => {
  return request.post(api.video_mid, data)
}

// 不感兴趣
export const no_interest = (data) => {
  return request.post(api.no_interest, data)
}

// 举报
export const report = (data) => {
  return request.post(api.report, data)
}

// 提交名片表单
export const cardForm = (data) => {
  return request.post(api.cardForm, data)
}