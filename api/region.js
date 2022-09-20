import request from '@/utils/request'

// api地址
const api = {
	all: 'region/all',
	tree: 'region/tree',
	areaInfo: 'region/name',
	isShowRegion: 'goods/isShowRegion'
}

// 获取所有地区
export const all = (param) => {
	return request.get(api.all, param)
}

// 获取所有地区(树状)
export const tree = (param) => {
	return request.get(api.tree, param)
}
// 获取当前设置地区
export const areaInfo = (param) => {
	return request.get(api.areaInfo, param)
}

// 获取当前设置地区
export const isShowRegion = (param) => {
	return request.get(api.isShowRegion, param)
}
