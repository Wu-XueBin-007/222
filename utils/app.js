import store from '../store'
import * as util from './util'
import {
	paginate
} from '@/common/constant'
// #ifdef APP-PLUS
const module = uni.requireNativePlugin('SandPayTypeModule')
// #endif
import {
	urlEncode
} from '@/utils/util.js'

/**
 * 获取当前运行的终端(App H5 小程序)
 * https://uniapp.dcloud.io/platform
 */
// #ifdef APP-PLUS
function wxPay(ret, opt) {
	console.log(ret, 'ret');
	plus.share.getServices(shareList => {
		console.log(shareList, 'shareList');
		let sweixin = shareList.find(val => val.id == 'weixin')
		// let pay_extra = JSON.parse(ret.pay_extra)
		console.log(sweixin, 'sweixin');
		console.log('pages/cashier/index?' + urlEncode(opt.query))
		if (sweixin) {
			sweixin.launchMiniProgram({
				id: 'gh_3031981eafd6', //小程序原始id
				path: 'pages/cashier/index?' + urlEncode(opt.query),
				type: 2,
				envVersion: 'trial',
				success(res) {
					console.log(res, 'res')
					// 打开成功
				},
				fail(err) {
					console.log(err);
				}
			})
			this.endLoading()
		} else {
			uni.showToast({
				icon: 'none',
				title: "未安装微信,无法打开对应小程序"
			})
		}
	}, e => {
		uni.showToast({
			icon: 'none',
			title: "获取微信服务列表失败:" + JSON.stringify(e)
		})
	})

}
// #endif


export const getPlatform = () => {
	// #ifdef APP-PLUS
	const platform = 'App'
	// #endif
	// #ifdef APP-PLUS-NVUE
	const platform = 'App'
	// #endif
	// #ifdef H5
	const platform = 'H5'
	// #endif
	// #ifdef MP-WEIXIN
	const platform = 'MP-WEIXIN'
	// #endif
	// #ifdef MP-ALIPAY
	const platform = 'MP-ALIPAY'
	// #endif
	// #ifdef MP-BAIDU
	const platform = 'MP-BAIDU'
	// #endif
	// #ifdef MP-TOUTIAO
	const platform = 'MP-TOUTIAO'
	// #endif
	// #ifdef MP-QQ
	const platform = 'MP-QQ'
	// #endif
	// #ifdef MP-360
	const platform = 'MP-360'
	// #endif
	return platform
}

/**
 * 显示成功提示框
 */
export const showSuccess = (msg, callback) => {
	uni.showToast({
		title: msg,
		icon: 'success',
		mask: true,
		duration: 1500,
		success() {
			callback && callback()
		}
	})
}

/**
 * 显示失败提示框
 */
export const showError = (msg, callback) => {
	uni.showModal({
		title: '友情提示',
		content: msg,
		showCancel: false,
		success(res) {
			callback && callback()
		}
	})
}

/**
 * 显示纯文字提示框
 */
export const showToast = msg => {
	uni.showToast({
		title: msg,
		icon: 'none'
	})
}

/**
 * tabBar页面路径列表 (用于链接跳转时判断)
 * tabBarLinks为常量, 无需修改
 */
export const getTabBarLinks = () => {
	const tabBarLinks = [
		'pages/index/index',
		'pages/category/index',
		'pages/cart/index',
		'pages/user/index'
	]
	return tabBarLinks
}

/**
 * 生成转发的url参数
 */
export const getShareUrlParams = (params) => {
	let userId = store.getters.userId || 0;
	return util.urlEncode({
		scene: userId, // 推荐人ID
		...params
	})
}

/**
 * 跳转到指定页面url
 * 支持tabBar页面
 * @param {string}  url
 * @param {object}  query
 */
export const navTo = (url, query = {}) => {
	if (!url || url.length == 0) {
		return false
	}
	// tabBar页面, 使用switchTab
	if (util.inArray(url, getTabBarLinks())) {
		uni.switchTab({
			url: `/${url}`
		})
		return true
	}
	// 生成query参数
	const queryStr = !util.isEmpty(query) ? '?' + util.urlEncode(query) : ''
	// 普通页面, 使用navigateTo
	uni.navigateTo({
		url: `/${url}${queryStr}`
	})
	return true
}

/**
 * 记录购物车商品总数量
 * @param {*} value 
 */
export const setCartTotalNum = (value) => {
	uni.setStorageSync('cartTotalNum', Number(value))
	setCartTabBadge()
}

/**
 * 设置购物车tabbar的角标
 * 该方法只能在tabbar页面中调用, 其他页面调用会报错
 */
export const setCartTabBadge = () => {
	const cartTabbarIndex = 2
	const cartTotal = uni.getStorageSync('cartTotalNum') || 0
	if (cartTotal > 0) {
		uni.setTabBarBadge({
			index: cartTabbarIndex,
			text: `${cartTotal}`
		})
	} else {
		uni.removeTabBarBadge({
			index: cartTabbarIndex
		})
	}
	return
}

/**
 * 验证是否已登录
 */
export const checkLogin = () => {
	return !!store.getters.userId
}

/**
 * 发起支付请求
 * @param {Object} 参数
 */
export const wxPayment = (option, opt) => {
	const options = {
		timeStamp: '',
		nonceStr: '',
		prepay_id: '',
		paySign: '',
		...option
	}
	return new Promise((resolve, reject) => {
		let obj = {
			"appid": options.appid,
			"noncestr": options.nonceStr,
			"prepayid": options.prepay_id,
			"package": "Sign=WXPay",
			"partnerid": options.partnerid,
			"timestamp": Number(options.timeStamp),
			"sign": options.paySign,
		}
		// #ifdef APP-PLUS
		// uni.requestPayment({
		// 	provider: 'wxpay',
		// 	orderInfo: JSON.stringify(obj),
		// 	success: res => resolve(res),
		// 	fail: res => reject(res)
		// })
		console.log(option, 'option')
		console.log(opt, 'opt')
		module.cashierPaySingle(options, ret => {
			console.log(ret, 'ret');
			if (ret.payType == '1') {
				wxPay(option, opt)
			} else {
				if (ret.resultCode == '0000') {
					console.log("支付方式:" + ret.payType)
				}
				console.log("支付结果:" + ret.resultCode)
				console.log("错误信息:" + ret.failReason)
				console.log("action:" + ret.action)
			}
		})
		// #endif
		// #ifdef MP-WEIXIN
		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: options.timeStamp,
			nonceStr: options.nonceStr,
			'package': `prepay_id=${options.prepay_id}`,
			signType: options.signType ? options.signType : 'MD5',
			paySign: options.paySign,
			success: res => resolve(res),
			fail: res => reject(res)
		})
		// #endif

	})
}

export const zfbPayment = (option) => {

	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: 'alipay',
			orderInfo: option,
			success: res => resolve(res),
			fail: res => reject(res)
		})
	})
}

/**
 * 加载更多列表数据
 * @param {Object} resList 新列表数据
 * @param {Object} oldList 旧列表数据
 * @param {int} pageNo 当前页码
 */
export const getEmptyPaginateObj = () => {
	return util.cloneObj(paginate)
}

/**
 * 加载更多列表数据
 * @param {Object} resList 新列表数据
 * @param {Object} oldList 旧列表数据
 * @param {int} pageNo 当前页码
 */
export const getMoreListData = (resList, oldList, pageNo) => {
	// 如果是第一页需手动制空列表
	if (pageNo == 1) oldList.data = []
	// 合并新数据
	return oldList.data.concat(resList.data)
}
