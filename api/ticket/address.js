import request from '@/utils/request'

// api地址
const api = {
  list: 'ticket_address/list',
  detail: 'ticket_address/detail',
  add: 'ticket_address/add',
  edit: 'ticket_address/edit',
  del: 'ticket_address/del',
  default: 'ticket_address/default'
}

// 乘车人列表
export const list = (data) => {
  return request.post(api.list, data)
}

// 乘车人详情
export const detail = (data) => {
  return request.post(api.detail, data)
}

// 乘车人添加
export const add = (data) => {
  return request.post(api.add, data)
}

// 乘车人修改
export const edit = (data) => {
  return request.post(api.edit, data)
}

// 乘车人删除
export const del = (data) => {
  return request.post(api.del, data)
}

// 默认乘车人
export const defaults = (data) => {
  return request.post(api.default, data)
}

