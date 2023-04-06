import request from '@/utils/request'

// api地址
const api = {
	rule: 'exchange.info/rule',
	detail: 'exchange.goods/detail',
	exchangeorder: 'exchange.order/exchange',
}

// 兑换商品详情
export function detail(params) {
	return request.get(api.detail, params)
}


// 兑换规则
export function rule() {
	return request.get(api.rule, {})
}


export const exchangeorder = (data, options) => {
	return request.post(api.exchangeorder, data, options)
}
