import request from '@/utils/request'

// api地址
const api = {
	list: 'category/list',
	getList: 'category/getList'
}

// 页面数据
export function list() {
	return request.get(api.list)
}
export const getList = (data) => {
	return request.post(api.getList, data)
}
