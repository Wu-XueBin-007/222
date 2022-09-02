<template>
	<view class="binding">
		<view class="binding-head">
			<view class="binding-head-text">
				验证手机号
			</view>
		</view>
		<view class="binding-centre">
			<view class="binding-main">
				<view class="binding-item">
					<image src="../../static/icon/icon_phone.png" mode=""></image>
					<input name="mobile" v-model="mobile" type='number' placeholder="请输入手机号" />
				</view>
				<text class="line"></text>
				<view class="binding-item1">
					<image src="../../static/icon/icon_mm.png" mode=""></image>
					<input name="code" v-model="code" type='text' placeholder="请输入验证码" />
					<view v-if="showText==true" class="binding-item1-btn" @click="getCode">发送验证码</view>
					<view v-else class="binding-item1-btn1">{{second}}s重新发送</view>
				</view>	
				<text class="line"></text>
				<view class="binding-btn">
					<!-- #ifdef MP-WEIXIN -->
					<view @click="btn_binding">换绑手机号</view>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view @click="btn_binding1">换绑手机号</view>
					<!-- #endif -->
				</view>
			</view>
			
		</view>
		
		<view  style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F5F5F5;z-index: -1;"
					 catchtouchmove="true"></view>
	</view>
</template>

<script>
	const app=getApp();
	export default {
		data() {
			return {
				second: 60,
				showText: true,
				code:'',
				mobile:''
			}
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
			getCode() { //倒计时
				this.showText = false
				var interval = setInterval(() => {
					let times = --this.second
					this.second = times < 10 ? '0' + times : times //小于10秒补 0
				}, 1000)
				setTimeout(() => {
					clearInterval(interval)
					this.second = 60
					this.showText = true
				}, 60000)
				//#ifdef MP-WEIXIN
				app.$vm.$options.api.codeDx({
					mobile:this.mobile,
					type:3
				}).then(res=>{
					//console.log(res)
					uni.showToast({
						icon:"none",
						title:res.data.msg
					})
				})
				//#endif
				//#ifdef H5
				app.$options.api.codeDx({
					mobile:this.mobile,
					type:3
				}).then(res=>{
					//console.log(res)
					uni.showToast({
						icon:"none",
						title:res.data.msg
					})
				})
				//#endif
			},
			//小程序
			btn_binding(){
				if(!this.code.trim()){
					uni.showToast({
						icon:'none',
						title:"请输入验证码"
					})
					return false;
				}
				app.$vm.$options.api.MobileUpd({
					mobile:this.mobile,
					code:this.code
				}).then(res=>{
					//console.log(res)
					if(res.data.code=='success'){
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
						uni.switchTab({
							url:"../index/index"
						})
					}else{
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
					}
				})
			},
			//公众号
			btn_binding1(){
				if(!this.code.trim()){
					uni.showToast({
						icon:'none',
						title:"请输入验证码"
					})
					return false;
				}
				app.$options.api.MobileUpd({
					mobile:this.mobile,
					code:this.code
				}).then(res=>{
					//console.log(res)
					if(res.data.code=='success'){
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
						uni.switchTab({
							url:"../index/index"
						})
					}else{
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
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
