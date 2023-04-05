import request from '@/utils/request'

// api地址
const api = {
	rule: 'exchange.info/rule',
	my: 'team/my',
}

// 分销订单
export function list() {
	return request.post(api.list, {})
}

// 兑换规则
export function rule() {
	return request.get(api.rule, {})
}
