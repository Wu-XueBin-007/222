<template>
	<view class="container"
		:style="{'background-image':'url('+(infos.loginBackground?infos.loginBackground.preview_url:'')+')'}">
		<!-- 页面头部 -->
		<view class="header">
			<view class="title">
				<text>手机号登录</text>
			</view>
			<view class="sub-title">
				<text>未注册的手机号登录后将自动注册</text>
			</view>
		</view>
		<!-- 表单 -->
		<view class="login-form">
			<!-- #ifdef APP-PLUS -->
			<!-- 			<view class="form-item" v-if="registerFlag">
				<input class="form-item--input" type="text" v-model="nick_name" placeholder="请输入用户名" />
			</view> -->
			<!-- #endif -->
			<!-- 手机号 -->
			<view class="form-item">
				<input class="form-item--input" type="number" v-model="mobile" maxlength="11" placeholder="请输入手机号码" />
			</view>

			<!-- #ifdef APP-PLUS -->
			<!-- 图形验证码 -->
			<view class="form-item" v-if="registerFlag || loginFlag">
				<input class="form-item--input" type="text" v-model="captchaCode" maxlength="5"
					placeholder="请输入图形验证码" />
				<view class="form-item--parts">
					<view class="captcha" @click="getCaptcha()">
						<image class="image" :src="captcha.base64"></image>
					</view>
				</view>
			</view>
			<view class="form-item" v-if="registerFlag || !loginFlag">
				<input class="form-item--input" type="password" v-model="pass1" placeholder="请输入密码" />
			</view>
			<view class="form-item" v-if="registerFlag">
				<input class="form-item--input" type="password" v-model="pass2" placeholder="请再次输入密码" />
			</view>
			<!-- 短信验证码 -->
			<view class="form-item" v-if="registerFlag || loginFlag">
				<input class="form-item--input" type="number" v-model="smsCode" maxlength="6" placeholder="请输入短信验证码" />
				<view class="form-item--parts">
					<view class="captcha-sms" @click="handelSmsCaptcha()">
						<text v-if="!smsState" class="activate">获取验证码</text>
						<text v-else class="un-activate">重新发送({{ times }})秒</text>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- 图形验证码 -->
			<view class="form-item">
				<input class="form-item--input" type="text" v-model="captchaCode" maxlength="5"
					placeholder="请输入图形验证码" />
				<view class="form-item--parts">
					<view class="captcha" @click="getCaptcha()">
						<image class="image" :src="captcha.base64"></image>
					</view>
				</view>
			</view>
			<view class="form-item">
				<input class="form-item--input" type="password" v-model="pass1" placeholder="请输入密码" />
			</view>
			<view class="form-item">
				<input class="form-item--input" type="password" v-model="pass2" placeholder="请再次输入密码" />
			</view>
			<view class="form-item">
				<input class="form-item--input" type="number" v-model="smsCode" maxlength="6" placeholder="请输入短信验证码" />
				<view class="form-item--parts">
					<view class="captcha-sms" @click="handelSmsCaptcha()">
						<text v-if="!smsState" class="activate">获取验证码</text>
						<text v-else class="un-activate">重新发送({{ times }})秒</text>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- 登录按钮 -->
			<view class="login-button" @click="handleLogin">
				<text>登录</text>
			</view>

			<!-- #ifdef APP-PLUS -->
			<view v-if="!registerFlag"
				style="text-align: center;color: #333333;margin-top: 30upx;display: flex;justify-content: space-between;box-sizing: border-box;padding: 0 30upx;">
				<view @click="changeLogin">
					{{loginFlag?'密码登录':'验证码登录'}}
				</view>
				<view @click="changeRegister">
					<text>立即注册</text>
				</view>
			</view>
			<view v-if="registerFlag" style="text-align: center;color: #333333;margin-top: 30upx;" @click="backLogin">
				返回登录</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import * as LoginApi from '@/api/login'
	import * as commonApi from "@/api/home/rotation.js"
	import {
		throttle,
		debounce
	} from '@/utils/util'
	import * as Verify from '@/utils/verify'
	const APP = getApp();

	// 倒计时时长(秒)
	const times = 60

	// 表单验证场景
	const GET_CAPTCHA = 10
	const SUBMIT_LOGIN = 20

	export default {
		props: {
			// 是否存在第三方用户信息
			isParty: {
				type: Boolean,
				default: () => false
			},
			// 第三方用户信息数据
			partyData: {
				type: Object
			}
		},

		data() {
			return {
				// 正在加载
				isLoading: false,
				// 图形验证码信息
				captcha: {},
				// 短信验证码发送状态
				smsState: false,
				// 倒计时
				times,
				// 手机号
				mobile: '',
				// 图形验证码
				captchaCode: '',
				// 短信验证码
				smsCode: '',
				nick_name: '',
				pass1: '',
				pass2: '',
				loginFlag: false,
				registerFlag: false,
				infos: {}
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		created() {
			// 获取图形验证码
			this.getInfo()
			this.getCaptcha()
		},

		methods: {
			getInfo() {
				commonApi.info()
					.then(res => {
						//console.log(res)
						this.infos = res.data.storeInfo;
					})
			},
			backLogin() {
				this.registerFlag = false;
			},
			changeRegister() {
				this.registerFlag = true;
			},
			changeLogin() {
				this.loginFlag = !this.loginFlag;
			},
			// 获取图形验证码
			getCaptcha() {
				const app = this
				LoginApi.captcha()
					.then(result => app.captcha = result.data)
			},

			// 点击发送短信验证码
			handelSmsCaptcha() {
				const app = this
				if (!app.isLoading && !app.smsState && app.formValidation(GET_CAPTCHA)) {
					app.sendSmsCaptcha()
					// app.getCaptcha()
				}
			},

			// 表单验证
			formValidation(scene = GET_CAPTCHA) {
				const app = this
				// 验证获取短信验证码
				if (scene === GET_CAPTCHA) {
					if (!app.validteMobile(app.mobile) || !app.validteCaptchaCode(app.captchaCode)) {
						return false
					}
				}
				// 验证提交登录
				if (scene === SUBMIT_LOGIN) {
					if (!app.validteMobile(app.mobile) || !app.validteSmsCode(app.smsCode)) {
						return false
					}
				}
				return true
			},

			// 验证手机号
			validteMobile(str) {
				if (Verify.isEmpty(str)) {
					this.$toast('请先输入手机号')
					return false
				}
				if (!Verify.isMobile(str)) {
					this.$toast('请输入正确格式的手机号')
					return false
				}
				return true
			},

			// 验证图形验证码
			validteCaptchaCode(str) {
				if (Verify.isEmpty(str)) {
					this.$toast('请先输入图形验证码')
					return false
				}
				return true
			},

			// 验证短信验证码
			validteSmsCode(str) {
				if (Verify.isEmpty(str)) {
					this.$toast('请先输入短信验证码')
					return false
				}
				return true
			},

			// 请求发送短信验证码接口
			sendSmsCaptcha() {
				const app = this
				app.isLoading = true
				// console.log( app.captcha)
				LoginApi.sendSmsCaptcha({
						form: {
							captchaKey: app.captcha.key,
							captchaCode: app.captchaCode,
							mobile: app.mobile
						}

					})
					.then(result => {
						// 显示发送成功
						app.$toast(result.message)
						// 执行定时器
						app.timer()
					}).catch(err => {
						console.log(err)
						// this.getCaptcha()
					})
					.finally(() => {
						app.isLoading = false;

					})
			},

			// 执行定时器
			timer() {
				const app = this
				app.smsState = true
				const inter = setInterval(() => {
					app.times = app.times - 1
					if (app.times <= 0) {
						app.smsState = false
						app.times = times
						clearInterval(inter)
					}
				}, 1000)
			},

			// 点击登录
			handleLogin() {
				const app = this
				if (app.loginFlag || app.registerFlag) {
					if (app.formValidation(SUBMIT_LOGIN)) {
						app.submitLogin()
					}
				} else {
					app.submitLogin()
				}
			},

			// 确认登录
			submitLogin() {
				const app = this
				app.isLoading = true
				let obj = {};
				obj.nick_name = "";
				if (app.registerFlag) {
					obj.type = 1;
				} else if (app.loginFlag) {
					obj.type = 1;
				} else if (!app.loginFlag) {
					obj.type = 2;
				}
				// #ifdef MP-WEIXIN
				obj.type = 1;
				// #endif
				if (obj.type == 1) {
					obj.smsCode = app.smsCode;
					obj.mobile = app.mobile;
					obj.isParty = app.isParty;
					obj.partyData = app.partyData;

					if (app.registerFlag) {
						// #ifdef APP-PLUS
						if (!app.pass1.trim()) {
							uni.showToast({
								icon: 'none',
								title: '请输入密码',
								duration: 2000
							})
							return false;
						}
						if (app.pass1.trim() != app.pass2.trim()) {
							uni.showToast({
								icon: 'none',
								title: '两次输入的密码不一致',
								duration: 2000
							})
							return false;
						}
						obj.password = app.pass1.trim();
						// #endif
					}

				} else if (obj.type == 2) {
					obj.mobile = app.mobile;
					obj.isParty = app.isParty;
					obj.partyData = app.partyData;
					if (!app.pass1.trim()) {
						uni.showToast({
							icon: 'none',
							title: '请输入密码',
							duration: 2000
						})
						return false;
					}
					if (app.registerFlag) {
						if (app.pass1.trim() != app.pass2.trim()) {
							uni.showToast({
								icon: 'none',
								title: '两次输入的密码不一致',
								duration: 2000
							})
							return false;
						}
					}
					obj.password = app.pass1.trim();
				}
				console.log(APP.globalData.shareId)
				if (APP.globalData.shareId) {
					obj.superior_user_id = APP.globalData.shareId;
				}
				// #ifdef APP-PLUS
				// if (app.registerFlag) {
				// 	if (!app.nick_name) {
				// 		uni.showToast({
				// 			icon: 'none',
				// 			title: '请输入用户名',
				// 			duration: 2000
				// 		})
				// 		return false;
				// 	}
				// 	obj.nick_name = app.nick_name;
				// }
				// #endif

				store.dispatch('Login', obj)
					.then(result => {
						// 显示登录成功
						app.$toast(result.message)
						// 跳转回原页面
						setTimeout(() => {
							app.onNavigateBack(1)
						}, 2000)
					})
					.catch(err => {
						if (err.result.data.isBack) {
							// 跳转回原页面
							setTimeout(() => {
								app.onNavigateBack(1)
							}, 2000)
						}
					})
					.finally(() => app.isLoading = false)
			},

			/**
			 * 登录成功-跳转回原页面
			 */
			onNavigateBack(delta) {
				uni.navigateBack({
					delta: Number(delta || 1)
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 100rpx 60rpx;
		height: 100vh;
		background-color: #fff;
		// background-image: url(../../../static/background/cardVoucher1.png);
		background-size: 100% 100%;
		background-position: 0 0;
	}

	// 页面头部
	.header {
		margin-bottom: 50rpx;

		.title {
			color: #191919;
			font-size: 50rpx;
		}

		.sub-title {
			margin-top: 20rpx;
			color: #b3b3b3;
			font-size: 25rpx;
		}
	}

	// 输入框元素
	.form-item {
		display: flex;
		padding: 18rpx;
		border-bottom: 1rpx solid #f3f1f2;
		margin-bottom: 25rpx;
		height: 96rpx;

		&--input {
			font-size: 26rpx;
			letter-spacing: 1rpx;
			flex: 1;
			height: 100%;
		}

		&--parts {
			min-width: 100rpx;
			height: 100%;
		}

		// 图形验证码
		.captcha {
			height: 100%;

			.image {
				display: block;
				width: 192rpx;
				height: 100%;
			}
		}

		// 短信验证码
		.captcha-sms {
			font-size: 22rpx;
			line-height: 50rpx;
			padding-right: 20rpx;

			.activate {
				color: #cea26a;
			}

			.un-activate {
				color: #9e9e9e;
			}
		}
	}


	// 登录按钮
	.login-button {
		width: 100%;
		height: 86rpx;
		margin-top: 70rpx;
		// background: #cea26a;
		background: linear-gradient(to right, #ecb53c, #ff9211);
		text-align: center;
		line-height: 86rpx;
		color: #fff;
		border-radius: 80rpx;
		box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
		letter-spacing: 5rpx;
	}

	// 微信授权登录
	.wechat-auth {
		display: flex;
		justify-content: center;
		margin-top: 40rpx;

		.icon {
			width: 38rpx;
			height: 38rpx;
			margin-right: 15rpx;
		}

		.title {
			font-size: 28rpx;
			color: #666666;
		}
	}
</style>
