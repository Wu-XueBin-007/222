import request from '@/utils/request'
import { data } from '../setting'

// api地址
const api = {
  code:'highluxury.index/qr_code',
  list: 'highluxury.index/myOrderList',
  bigviplist: 'bigvip.index/myOrderList',
  index: 'bigvip.index/index',
  myOrderList: 'luckyFree.index/myOrderList',
  goodsList: 'luckyFree.index/goodsList',
  rule: 'highluxury.index/rule',
  create: 'luckyFree.order/create',
  detail: 'highluxury.index/detail',
  inviteList:'bigvip.index/get_my_invite_list',
  balanceLog:'bigvip.index/balance_log',
  todoCounts:'order/todoCounts',
  bigVipdetail: 'bigvip.index/detail',
	equities:'user/equities'
}
// 大会员二维码
export function code(params) {
  return request.post(api.code, params)
}
// 获取活动订单列表
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
// 获取活动规则
export const rule = (data) => {
  return request.post(api.rule, data)
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
// 大会员详情（banner图）
export const bigVipdetail = (data) =>{
	return request.post(api.bigVipdetail, data) 
}
// 大会员成团订单列表
export const bigviplist = (data) =>{
	return request.post(api.bigviplist, data) 
}
// 权益消费额度
export const equities = (data) =>{
	return request.post(api.equities, data) 
}