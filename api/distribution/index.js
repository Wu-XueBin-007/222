import request from '@/utils/request'

// api地址
const api = {
  list: 'order_distribution_log/list',
  code: 'user/qr_code',
  relationship: 'user/UserSuperiorAndSubordinate',
  withdrawalHis: 'withdrawal/list',
  user_price_log: 'user_price_log/list',
  my: 'team/my',
  team_list: 'team/team_list'
}

// 分销订单
export function list() {
  return request.post(api.list, {})
}

// 我的团队信息
export function my() {
  return request.get(api.my, {})
}

// 团队列表
export function team_list(params) {
  return request.get(api.team_list, params)
}

// 分销二维码
export function code(params) {
  return request.post(api.code, params)
}

// 分销上下级
export function relationship(params) {
  return request.post(api.relationship, params)
}

// 提现记录
export function withdrawalHis(params) {
  return request.get(api.withdrawalHis, params)
}

// 提现记录
export function user_price_log(params) {
  return request.post(api.user_price_log, params)
}
