import request from '@/utils/request'

// api地址
const api = {
  timeList: 'seckill.time/list',
  goodsList: 'seckill.goods/list',
  goodsDetails: 'seckill.goods/detail',
  info: 'seckill.order/create',
  pay: 'order/pay',
  bannerList: 'seckill.ad/list',
  randomList: 'seckill.goods/random_list',
  updateAddress: 'order/update_address'
}

// 秒杀分组列表
export const timeList = (data) => {
  return request.get(api.timeList, data)
}

// 秒杀商品列表
export const goodsList = (data) => {
  return request.get(api.goodsList, data)
}

// 秒杀商品详情
export const goodsDetails = (data) => {
  return request.get(api.goodsDetails, data)
}

// 秒杀订单信息
export const info = (mode, param) => {
  return request.get(api.info, { mode, ...param })
}

// 创建秒杀订单
export const add = (mode, data) => {
  return request.post(api.info, { mode, ...data })
}

// 秒杀轮播图列表
export const bannerList = (data) => {
  return request.get(api.bannerList, data)
}

// 随机商品
export const randomList = (data) => {
  return request.get(api.randomList, data)
}

// 修改发货地址
export const updateAddress = (data) => {
  return request.post(api.updateAddress, data)
}

