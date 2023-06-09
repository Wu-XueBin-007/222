import request from '@/utils/request'

// api地址
const api = {
	login: 'passport/login',
	// #ifdef MP-WEIXIN
	mpWxLogin: 'passport/mpWxLogin',
	// #endif
	// #ifdef MP-QQ
	mpWxLogin: 'passport/mpQqLogin',
	// #endif
	mpQqLoginL: 'passport/mpQqLogin',
	captcha: 'passport/captcha',
	sendSmsCaptcha: 'passport/sendSmsCaptcha',
	wxMobileDecrypt: 'passport/wxMobileDecrypt'
}

// 用户登录
export function login(data) {
	//console.log(data)
	return request.post(api.login, data)
}


// 微信小程序快捷登录
export function mpWxLogin(data, option) {
	console.log(data, 'mpWxLoginoption');
	console.log(option, 'mpWxLoginoption');
	return request.post(api.mpWxLogin, data, option)
}


// 微信小程序自动获取手机号
export function wxMobileDecrypt(data, option) {
	return request.post(api.wxMobileDecrypt, data, option)
}

// 图形验证码
export function captcha() {
	return request.get(api.captcha, {}, {
		load: false
	})
}

// 发送短信验证码
export function sendSmsCaptcha(data) {
	return request.post(api.sendSmsCaptcha, data, {
		load: false
	})
}
