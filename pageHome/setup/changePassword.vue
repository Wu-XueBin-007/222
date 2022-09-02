<template>
	<view class="binding">
		<view class="binding-head">
			<view class="binding-head-text">
				设置密码
			</view>
		</view>
		<view class="binding-centre">
			<view class="binding-main">
				<block v-if="editFlag">
					<view class="binding-item">
						<image src="../../static/icon/icon_ymm.png" mode=""></image>
						<input name="pass1" v-model="pass1" type='password' placeholder="请输入原密码" />
					</view>
					<text class="line"></text>
					<view class="binding-item">
						<image src="../../static/icon/icon_xmm.png" mode=""></image>
						<input name="pass2" v-model="pass2" type='password' placeholder="请设置新密码" />
					</view>
					<text class="line"></text>
					<view class="binding-item">
						<image src="../../static/icon/icon_xmm.png" mode=""></image>
						<input name="pass3" v-model="pass3" type='password' placeholder="请再次确认密码" />
					</view>
					<text class="line"></text>
				</block>
				
				<block v-else>
					<view class="form-item">
						<input class="form-item--input" type="number" v-model="mobile" maxlength="11" placeholder="请输入手机号码" />
					</view>
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
				</block>
				
				
				<view class="binding-btn">
					<view @click="btn_binding">确认修改</view>
				</view>
				<view style="margin-top: 30upx;text-align: center;color: #CCCCCC;" @click="changeEdit">{{editFlag?'忘记密码?':'原密码修改'}}</view>
			</view>
		</view>
		<view  style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F5F5F5;z-index: -1;"
					 catchtouchmove="true"></view>
	</view>
</template>

<script>
	import {edit_password,check_edit_password} from "@/api/user.js"
	import store from '@/store'
	import * as LoginApi from '@/api/login'
	import {
		throttle,
		debounce
	} from '@/utils/util'
	import * as Verify from '@/utils/verify'
	const APP = getApp();
	// 表单验证场景
	const GET_CAPTCHA = 10
	const SUBMIT_LOGIN = 20
	// 倒计时时长(秒)
	const times = 60
	export default {
		data() {
			return {
				
				editFlag:true,
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
				pass3: ''
			}
		},
		created() {
			// this.getCaptcha()
		},
		onLoad(optinos) {
			
		},
		components: {
			
		},
		onShareAppMessage() {
			const app = this
			const {
				page
			} = app
			return {
				title: "融汇商城",
				path: "/pages/index/index"
			}
		},
		
		/**
		 * 分享到朋友圈
		 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
		 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
		 */
		onShareTimeline() {
			const app = this
			const {
				page
			} = app
			return {
				title: "融汇商城",
				path: "/pages/index/index"
			}
		},
		methods: {
			changeEdit(){
				this.editFlag = !this.editFlag;
				this.pass1 = '';
				this.pass2 = '';
				this.pass3 = '';
				this.mobile = '';
				this.captchaCode = '';
				this.smsCode = '';
				this.getCaptcha()
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
					app.getCaptcha()
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
				if (!app.isLoading && app.formValidation(SUBMIT_LOGIN)) {
					app.submitLogin()
				}
			},
			//小程序
			btn_binding(){
				if(this.editFlag){
					if(!this.pass1.trim()){
						uni.showToast({
							icon:'none',
							title:"请输入原密码"
						})
						return false;
					}
					if(!this.pass2.trim()){
						uni.showToast({
							icon:'none',
							title:"请输入新密码"
						})
						return false;
					}
					if(this.pass2.trim() != this.pass3.trim()){
						uni.showToast({
							icon:'none',
							title:"两次输入的密码不一致"
						})
						return false;
					}
					let obj = {};
					obj.password = this.pass1;
					obj.password1 = this.pass2;
					edit_password(obj)
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
				}else{
					let app = this;
					let obj = {};
					obj.smsCode = app.smsCode;
					obj.mobile = app.mobile;
					if(!this.pass1.trim()){
						uni.showToast({
							icon:'none',
							title:"请输入原密码"
						})
						return false;
					}
					if(this.pass2.trim() != this.pass1.trim()){
						uni.showToast({
							icon:'none',
							title:"两次输入的密码不一致"
						})
						return false;
					}
					obj.password = this.pass1;
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
				}
			}
		}
	}
</script>

<style scoped lang="scss">
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
	.binding {
		width: 100%;
		background-color: #F1F1F5;
	}

	.line {
		width: 95%;
		height: 2upx;
		display: inline-block;
		margin: 0 auto;
		background-color: #f2f2f2;
		text-align: center;
	}

	.binding-centre {
		background-color: #FFFFFF;
	}
	.binding-head{
		background-color: #FFFFFF;
		padding: 20upx 0;
	}
	.binding-head-text{
		font-size: 28upx;
		color: #909090;
		margin-left: 30upx;
		padding-left: 8upx;
		border-left: 8upx solid #ff5060;
	}
	.binding-main {
		padding-left: 30upx;
		padding-bottom: 30upx;
		background-color: #FFFFFF;
	}


	.binding-item {
		padding: 30upx 0 0 0;
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
	}

	.binding-item>image {
		width: 32upx;
		height: 32upx;
		vertical-align: top;
	}

	.binding-item>input {
		width: 72%;
		padding-left: 28upx;
		font-size: 24upx;
		color: #616161;
		margin-top: -10upx;
	}

	.binding-item1 {
		padding: 30upx 30upx 0 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: #FFFFFF;
	}

	.binding-item1>image {
		width: 32upx;
		height: 32upx;
		vertical-align: top;
	}

	.binding-item1>input {
		width: 66%;
		font-size: 24upx;
		color: #616161;
		margin-top: -10upx;
	}

	.binding-item1-btn {
		font-size: 24upx;
		color: #ff5060;
		border-left: 2upx solid #F1F1F5;
		padding-left: 30upx;
		line-height: 36upx;
	}
	.binding-item1-btn1{
		font-size: 24upx;
		color: #666666;
	}

	.binding-btn{
		margin-top: 48upx;
	}
	.binding-btn view{
		width: 690upx;
		height: 92upx;
		background-color: #ff5060;
		border-radius: 46upx;
		color: #FFFFFF;
		font-size: 28upx;
		line-height: 92upx;
		text-align: center;
		
	}
</style>
