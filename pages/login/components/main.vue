<template>
	<view class="container" :style="{'background-image':'url('+(infos.loginBackground?infos.loginBackground.preview_url:'')+')'}">
		<!-- 页面头部 -->
		<view class="header">
			<view class="title">
				
				<template v-if="!ForgetpasswordFlage&&!registerFlag">
					<view @click="loginFlag=false"  class="tab-item" :class="!loginFlag?'selTabItem':''">
						账号登录
					</view>
					<view @click="loginFlag=true" class="tab-item" :class="loginFlag?'selTabItem':''" >
						短信登录
					</view>
				</template>
				<template v-if="ForgetpasswordFlage||registerFlag">
					<view @click="loginFlag=false"  class="tab-item" :class="!loginFlag?'selTabItem':''">
						{{registerFlag?'注册账号':"忘记密码"}}
					</view>
					<view @click="ForgetpasswordFlage=false;registerFlag=false" class="tab-item" :class="loginFlag?'selTabItem':''" >
						返回登录
					</view>
				</template>
				
			</view>
		</view>
		<!-- 表单 -->
		<view class="login-form">
			<view class="form-item">
				<view class="laber">
					账号
				</view>
				<input class="form-item--input" type="number" v-model="mobile" maxlength="11" placeholder-class="pcs" placeholder="请输入手机号码" />
			</view>
			<!-- 图形验证码 -->
			<view class="form-item" v-if="registerFlag || loginFlag||ForgetpasswordFlage">
				<view style="padding-right: 10rpx;" class="laber">
					图形验证码
				</view>
				<input class="form-item--input" type="text" v-model="captchaCode" placeholder-class="pcs" maxlength="5"
					placeholder="请输入图形验证码" />
				<view class="form-item--parts">
					<view class="captcha" @click="getCaptcha()">
						<image class="image" :src="captcha.base64"></image>
					</view>
				</view>
			</view>
			<view class="form-item" v-if="registerFlag || !loginFlag||ForgetpasswordFlage">
				<view class="laber">
					{{ForgetpasswordFlage?'重置密码':"密码"}}
				</view>
				<input class="form-item--input" :type="isPassword" v-model="pass1" placeholder-class="pcs" placeholder="请输入密码" />
				<view class="Forgetpassword">
					<image style="width: 48rpx;height: 48rpx;" v-if="!isnewPwd" @click="showPwd()" src="../../../static/icon_mm_kj.png" mode=""></image>
					<image style="width: 48rpx;height: 48rpx;" v-else @click="showPwd()" src="../../../static/icon_mm_yc.png" mode=""></image>
					<text v-if='!registerFlag&&!ForgetpasswordFlage' @click="ForgetpasswordFlage=true;registerFlag=false" style="margin-left: 18rpx;color: #999999;font-size: 24rpx;">忘记密码</text>
				</view>
			</view>
			<!-- 短信验证码 -->
			<view class="form-item" v-if="registerFlag || loginFlag || ForgetpasswordFlage">
				<view class="laber">
					短信验证码
				</view>
				<input class="form-item--input" type="number" v-model="smsCode" maxlength="6" placeholder-class="pcs" placeholder="请输入短信验证码" />
				<view class="form-item--parts">
					<view class="captcha-sms" @click="handelSmsCaptcha()">
						<text v-if="!smsState" class="activate">获取验证码</text>
						<text v-else class="un-activate">重新发送({{ times }})秒</text>
					</view>
				</view>
			</view>
			<view class="form-item" v-show="registerFlag">
				<view class="laber">
					邀请人手机号 
				</view>
				<input class="form-item--input" type="number"  v-model="pass2" placeholder="请输入邀请人手机号(选填)" />
			</view>
			
			<!-- 登录按钮 -->
			<view class="login-button" @click="handleLogin">
				<text v-if="registerFlag">注册</text>
				<text v-if="!registerFlag || ForgetpasswordFlage">登录</text>
				<!-- <text v-if="ForgetpasswordFlage">登录</text> -->
			</view>
			
			<view class="agreement">
				<label class="all-radio">
					<radio class="radio" :checked="agreementState" @click="radiochange" color="#F97112" />
					<text>已阅读并同意</text>
				</label>
				<view class="agreementText" @click="goRichtext">
					《服务协议》
				</view>
				<view class="">
					与
				</view>
				<view class="agreementText" @click="goPrivacyAgreement">
					《隐私协议》
				</view>
			</view>
			<view class="newRegister" style="transform: translateX(-20rpx); color: #333333;margin-top: 30upx;display: flex;box-sizing: border-box;padding: 0 30upx;" v-if="!registerFlag">
					还没有账号？<text @click="changeRegister" style="color: #F97112;">立即注册</text> 
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import * as LoginApi from '@/api/login'
	import * as commonApi from "@/api/home/rotation.js"
	import {edit_password,check_edit_password} from "@/api/user.js"
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
				infos:{},
				ForgetpasswordFlage:false,
				agreementState: false,
				isPassword:'password',
				isnewPwd:false,
			}
		},
		onShow() {
			this.agreementState = uni.getStorageInfoSync('agreementState')
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
			showPwd(){
				console.log(this.isnewPwd,'this.isnewPwd');
				 if (this.isnewPwd) {
					this.isPassword='password';
					this.isnewPwd = false;
				  } else {
					this.isPassword='text';
					this.isnewPwd = true;
				  }	
			},
			goRichtext(){
				uni.navigateTo({
					url:'/pageHome/setup/serviceAgreement'
				})
			},
			radiochange(e) {
				this.agreementState = !this.agreementState;
				uni.setStorageSync('agreementState', this.agreementState)
			},
			goPrivacyAgreement(){
				uni.navigateTo({
					url:'/pageHome/setup/privacyAgreement'
				})
			},
			getInfo(){
				commonApi.info()
					.then(res=>{
						//console.log(res)
						this.infos = res.data.storeInfo;
					})
			},
			backLogin() {
				this.registerFlag = false;
			},
			changeRegister() {
				this.registerFlag = true;
				this.loginFlag = false
				this.ForgetpasswordFlage = false
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
					})
					.finally(() => app.isLoading = false)
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
				if(app.loginFlag || app.registerFlag){
					if (app.formValidation(SUBMIT_LOGIN)) {
						app.submitLogin()
					}
				}else{
					app.submitLogin()
				}
			},

			// 确认登录
			submitLogin() {
				const app = this
				app.isLoading = true
				let obj = {};
				if(app.registerFlag||app.loginFlag){
					obj.type = 1;
				}else if(app.loginFlag){
					obj.type = 1;
				}else if(!app.loginFlag){
					obj.type = 2;
				}
				// #ifdef MP-WEIXIN
				obj.type = 1;
				// #endif
				console.log(obj.type,'obj.type');
				if(obj.type == 1){
					console.log('obj.type == 1');
					obj.smsCode = app.smsCode;
					obj.mobile = app.mobile;
					obj.isParty = app.isParty;
					obj.partyData = app.partyData;
					console.log(app.pass2.trim(),'app.pass2.trim()');
					if(app.registerFlag){
						// #ifdef APP-PLUS
						if (!app.pass1.trim()) {
							uni.showToast({
								icon: 'none',
								title: '请输入密码',
								duration: 2000
							})
							return false;
						}
						
						if (!app.pass2.trim()) {
							uni.showToast({
								icon: 'none',
								title: '请输入邀请人手机号',
								duration: 2000
							})
							return false;
						}
						obj.password = app.pass1.trim();
						obj.superior_user_phone = app.pass2.trim()
						// #endif
					}
					
				}else if(obj.type == 2){
					console.log('obj.type == 2');
					obj.mobile = app.mobile;
					obj.isParty = app.isParty;
					obj.partyData = app.partyData;
					
					if (!app.pass1.trim()) {
						uni.showToast({
							icon: 'none',
							title:app.ForgetpasswordFlage?'请输入重置密码':'请输入密码',
							duration: 2000
						})
						return false;
					}
					if(app.registerFlag){
						if (!app.pass2.trim()) {
							uni.showToast({
								icon: 'none',
								title: '请输入邀请人手机号',
								duration: 2000
							})
							return false;
						}
						
					}
					obj.password = app.pass1.trim();
				}
				if (APP.globalData.shareId) {
					obj.superior_user_id = APP.globalData.shareId;
				}
				// // #ifdef APP-PLUS
				// if(app.registerFlag){
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
				// // #endif
				
				if(!app.agreementState){
					uni.showToast({
						icon: 'none',
						title: '请勾选同意后再进行下一步操作',
						duration: 2000
					})
					return false;
				}
				console.log(obj,'obj');
				if(app.ForgetpasswordFlage){
						if(!this.pass1.trim()){
							uni.showToast({
								icon:'none',
								title:"请输入密码"
							})
							return false;
						}
						// if(!this.pass2.trim()){
						// 	uni.showToast({
						// 		icon:'none',
						// 		title:"请输入新密码"
						// 	})
						// 	return false;
						// }
						let obj = {};
						obj.smsCode = app.smsCode;
						obj.mobile = app.mobile;
						obj.password = this.pass1;
						// obj.password1 = this.pass1;
						console.log(obj,'objobjobj')
						check_edit_password(obj)
							.then(res=>{
								uni.showToast({
									icon:'none',
									title:"修改成功，请您重新登录",
									duration:2000
								})
								setTimeout(()=>{
									uni.removeStorageSync('AccessToken');
									uni.removeStorageSync('AccessToken_expiry');
									this.$store.state.token = '';
									this.$store.state.user.token = '';
									this.$store.state.user.userId = '';
									uni.navigateBack({
										delta:2
									})
								},1500)
							})
							.catch(err=>{
								uni.showToast({
									icon:'none',
									title:err.message,
									duration:2000
								})
							})
							return
				}
				if (this.loginFlag||this.registerFlag){
					store.dispatch('Login', obj)
						.then(result => {
							console.log(result,'result');
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
				}

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
		padding: 100rpx 40rpx;
		height: 100vh;
		background-color: #fff;
		// background-image: url(../../../static/background/cardVoucher1.png);
		background-size: 100% 100%;
		background-position: 0 0;
	}
	.login-form{
		display: flex;
		align-items: center;
		flex-direction: column;
		
	}

	// 页面头部
	.header {
		margin-bottom: 144rpx;

		.title {
			color: #191919;
			font-size: 28rpx;
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: center;
			// margin-top: 144rpx;
			.tab-item{
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 700;
				font-size: 28rpx;
				color: #CCCCCC;
				margin: 0 30rpx;
			}
			.tab-item.selTabItem{
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 700;
				font-size: 18px;
				color: #333333;
				position: relative;
				&::after{
					content: '';
					position: absolute;
					bottom: -16rpx;
					left: 0;
					margin-left:calc(50% - 20rpx) ;
					width: 40rpx;
					height: 8rpx;
					background: #F97112;
					border-radius: 4rpx;
				}
			}
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
		margin-bottom: 40rpx;
		background: #F9F9F9;
		border-radius: 25px;
		width: 335px;
		height: 50px;
		.laber{
			padding: 30rpx 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 700;
			font-size: 28rpx;
			color: #333333;
		}
		.Forgetpassword{
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 40rpx;
		}

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
		margin-top: 120rpx;
		// background: #cea26a;
		background: #F97112;
		border-radius: 50rpx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 700;
		font-size: 32rpx;
		text-align: center;
		line-height: 86rpx;
		color: #fff;
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
	/* #ifdef APP-PLUS */
	.agreement {
		display: flex;
		font-size: 22upx;
		align-items: center;
		margin-top: 60rpx;
		text-align: left;
		// transform: translateX(-40rpx);
		// margin-left: -20rpx;
	}
	.all-radio {
		/* width: 232upx; */
		display: flex;
		align-items: center;
		margin-left: 38upx;
	}
	
	.all-radio text:nth-child(1) {
		font-size: 22upx;
		color: #5B5B5B;
	}
	
	.radio {
		margin-bottom: -4upx;
		transform: scale(0.76)
	}
	
	.all-radio text {
		font-size: 22upx;
	}
	.agreementText {
		font-size: 22upx;
		color: #F97112;
		line-height: 54upx;
	
	}
	.newRegister{
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 24rpx;
		color: #999999;
	}
	/* #endif */
.pcs{
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 400;
	font-size: 28rpx;
	color: #CCCCCC;
}
.form-item--parts{
	display: flex;
	align-items: center;
	justify-content: center;
}
.logoWrap{
	width: 120rpx;
	height: 120rpx;
	background: #F97112;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	image{
		width: 92rpx;
		height: 70rpx;
	}
}
</style>
