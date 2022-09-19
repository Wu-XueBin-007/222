import request from '@/utils/request'

// api地址
const api = {
	order: 'checkout/order',
	submit: 'checkout/submit',
	getDeliveryType: 'order/getDeliveryType'
}

// mode: 结算模式 (buyNow立即购买 cart购物车)

// 结算台订单信息
export const order = (mode, param) => {
	return request.get(api.order, {
		mode,
		...param
	})
}

// 结算台订单提交
export const submit = (mode, data) => {
	return request.post(api.submit, {
		mode,
		...data
	})
}
// 配送方式
export const getDeliveryType = (mode, param) => {
	return request.post(api.getDeliveryType, {
		mode,
		...param
	})
}
