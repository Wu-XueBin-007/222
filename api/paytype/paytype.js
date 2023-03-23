import request from '@/utils/request'

// api地址
const api = {
	payType: 'payType.index/list',

}


// 交易设置查询
export const payType = (params) => {
	return request.post(api.payType,
		params
	)
}
