import request from '@/utils/request'

// api地址
const api = {
	list: 'group.category/list',
	goodsList: 'group.goods/list',
	goodsDetails: 'group.goods/detail',
	add: 'group.order/create',
	info: 'group.order/info',
	pay: 'group.order/pay',
	orderList: 'group.my_order/order_list',
	orderInfo: 'group.my_order/order_info',
	groupInfo: 'group.goods/group_task_info',
	groupList: 'group.goods/group_task_list',
	taskList: 'group.category/task_list',
	taskListAll: 'group.category/task_list_all',
	express: 'group.my_order/express',
	isReach: "group.user_info/isReach",
	pickPartakeType: "group.user_info/pickPartakeType",
	drawSync: 'group.user_info/drawSync',
	exchange: 'group.exchange/order '
}

// 拼团分组列表
export const list = (data) => {
	return request.get(api.list, data)
}

// 拼团商品列表
export const goodsList = (data) => {
	return request.get(api.goodsList, data)
}

// 拼团商品详情
export const goodsDetails = (data) => {
	return request.get(api.goodsDetails, data)
}

// 创建拼团订单
export const add = (data) => {
	return request.post(api.add, data)
}

// 订单详情
export const info = (data) => {
	return request.post(api.info, data)
}

// 发起支付
export const pay = (data) => {
	return request.post(api.pay, data)
}

// 我的拼团列表
export const orderList = (data, options) => {
	return request.get(api.orderList, data, options)
}

// 我的拼团详情
export const orderInfo = (data) => {
	return request.get(api.orderInfo, data)
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
// 获取物流信息
export function express(orderId, param) {
	return request.get(api.express, {
		orderId,
		...param
	})
}

// 用户是否达成显示
export const isReach = (data, options) => {
	return request.post(api.isReach, data, options)
}


// 选择参与类型
export const pickPartakeType = (data, options) => {
	return request.post(api.pickPartakeType, data, options)
}


// 选择参与类型
export const drawSync = (data, options) => {
	return request.post(api.drawSync, data, options)
}
//立即兑换
export const exchange = (data, options) => {
	return request.post(api.exchange, data, options)
}
