import request from '@/utils/request'

// api地址
const api = {
	receive: 'user.coupon/receive',
	change_refund_way: 'user/change_refund_way',
	get_refund_way: 'user/get_refund_way'
}

// 优惠券列表
export const receive = (data) => {
	return request.post(api.receive, data)
}

// 修改拼团退款路径
export const change_refund_way = (data) => {
	return request.post(api.change_refund_way, data)
}


// 获取退款路径
export const get_refund_way = (data) => {
	return request.post(api.get_refund_way, data)
}
