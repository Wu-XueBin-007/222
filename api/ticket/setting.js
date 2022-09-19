import request from '@/utils/request'

// api地址
const api = {
	detail: 'common/detail',
	get_info_by_key: 'setting/get_info_by_key'
}

// 优惠券列表
export const detail = (data) => {
	return request.post(api.detail, data)
}

export const get_info_by_key = (data) => {
	return request.get(api.get_info_by_key, data)
}
