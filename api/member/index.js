import request from '@/utils/request'

// api地址
const api = {
  code:'bigvip.index/qr_code',
  list: 'goods/list',
  index: 'bigvip.index/index',
  myOrderList: 'luckyFree.index/myOrderList',
  goodsList: 'luckyFree.index/goodsList',
  real_time_order_list: 'luckyFree.order/real_time_order_list',
  create: 'luckyFree.order/create',
  detail: 'luckyFree.index/detail',
  inviteList:'bigvip.index/get_my_invite_list',
  balanceLog:'bigvip.index/balance_log',
  todoCounts:'order/todoCounts',
 userInfo:'bigvip.index/index',
 goodsLists:'goods/list',
 invitationCode:'bigvip.index',
 Cash:'bigvip.index/balance_log',
 invitationList:'bigvip.index/get_my_invite_list',
 upgradeRecord:'bigvip.index/upgrade_log'
}


//大会员二维码
export function code(params) {
  return request.post(api.code, params)
}

// 商品列表
export const list = (data) => {
  return request.post(api.list, data)
}

// 往期活动列表
export const index = (data) => {
  return request.post(api.index, data)
}

// 用户参与列表
export const myOrderList = (data) => {
  return request.post(api.myOrderList, data)
}

// 商品列表
export const goodsList = (data) => {
  return request.get(api.goodsList, data)
}

// 获取实时订单
export const real_time_order_list = (data) => {
  return request.post(api.real_time_order_list, data)
}

// 添加订单
// export const create = (data) => {
//   return request.get(api.create, data)
// }
export const create = (mode, data) => {
  return request.post(api.create, { mode, ...data })
}


// 获取活动信息
export const detail = (data) => {
  return request.post(api.detail, data)
}

// 获取大会员邀请列表
export const inviteList = (data) => {
  return request.post(api.inviteList, data)
}

// 大会员返现记录
export const balanceLog = (data) => {
  return request.post(api.balanceLog, data)
}

// 大会员返现记录
export const todoCounts = (data) => {
  return request.post(api.todoCounts, data)
}

//获取用户大会员信息
export const userInfo = (data) => {
  return request.get(api.userInfo, data)
}

//获取商品列表
export const goodsLists = (data) => {
  return request.get(api.goodsLists, data)
}

//获取邀请二维码
export const invitationCode = (data) => {
  return request.get(api.invitationCode, data)
}

//大会员返现记录
export const Cash = (data) => {
  return request.post(api.Cash, data)
}

//大会员邀请列表
export const invitationList = (data) => {
  return request.post(api.invitationList, data)
}

//大会员升级记录
export const upgradeRecord = (data) => {
  return request.post(api.upgradeRecord, data)
}