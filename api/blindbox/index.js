import request from '@/utils/request'

// api地址
const api = {
  list: 'blindbox.index/index',
  detail: 'blindbox.index/detail',
  recordList: 'blindbox.order/record_list',
  pay: 'blindbox.order/create',
  pick_up_goods: 'blindbox.order/pick_up_goods',
  getpick_up_goods: 'blindbox.order/pick_up_goods',
  select_prize_goods: 'blindbox.order/select_prize_goods',
  free_trial: 'blindbox.index/free_trial',
  groupInfo: 'group.goods/group_task_info',
  groupList: 'group.goods/group_task_list',
  taskList: 'group.category/task_list',
  taskListAll: 'group.category/task_list_all'
}

// 盒子列表列表
export const list = (data) => {
  return request.post(api.list, data)
}

// 盒子详情
export const detail = (data) => {
  return request.post(api.detail, data)
}

// 我的盲盒
export const recordList = (data) => {
  return request.post(api.recordList, data)
}
// 立即提货获取信息
export const getpick_up_goods = (data) => {
  return request.get(api.getpick_up_goods, data)
}
// 立即提货
export const pick_up_goods = (data) => {
  return request.post(api.pick_up_goods, data)
}

// 发起支付
export const pay = (data) => {
  return request.post(api.pay, data)
}

// 查看中奖
export const select_prize_goods = (data) => {
  return request.post(api.select_prize_goods, data)
}

// 免费试玩
export const free_trial = (data) => {
  return request.get(api.free_trial, data)
}

// 拼团列表
export const groupList = (data) => {
  return request.get(api.groupList, data)
}

// 拼团详情
export const groupInfo = (data) => {
  return request.get(api.groupInfo, data)
}

// 专区拼团列表（随机）
export const taskList = (data) => {
  return request.get(api.taskList, data)
}

// 专区拼团列表（全部）
export const taskListAll = (data) => {
  return request.get(api.taskListAll, data)
}