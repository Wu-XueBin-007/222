import request from '@/utils/request'

// api地址
const api = {
	groupinfo: 'group.log/info',
	grouplist: 'group.log/list',
}

export const groupinfo = (param, option) => {
	const options = {
		isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
		load: true, //（默认 true 说明：本接口是否提示加载动画）
		...option
	}
	return request.get(api.groupinfo, param, options)
}

export const grouplist = (param, option) => {
	const options = {
		isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
		load: false, //（默认 true 说明：本接口是否提示加载动画）
		...option
	}
	return request.get(api.grouplist, param, options)
}
