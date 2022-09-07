<template>
	<view class="caShier">
		<!-- {{test}},{{test1}} -->
		<view class="caShier-content">
			<view class="caShier-header">
				<view class="caShier-header-title">
					<text class="caShier-header-txte1">支付金额</text>
					<!-- <text class="caShier-header-txte2">{{orderDetailsList.order_number}}</text> -->
				</view>
				<view class="caShier-header-title">
					<text class="caShier-header-txte3">￥</text>
					<text class="caShier-header-txte4">{{order.pay_price}}</text>
				</view>
				<view class="caShier-footer-text">
					剩余时间{{beOverdueTime | dateFormat}}
				</view>
			</view>
			<view class="caShier-item">
				<!-- #ifdef APP-PLUS -->
				<!-- <view class="caShier-item-list caShier-color" @click="btn_payTa(PayTypeEnum.ZHIFUBAO.value)">
					<view class="caShier-item-icon">
						<image src="../../static/icon/icon_zfbzf.png" mode=""></image>
						<text>{{PayTypeEnum.ZHIFUBAO.name}}</text>
					</view>
					<view class="coupons-item-chbox">
						<checkbox class="checks1-h5" :checked="paymentType==PayTypeEnum.ZHIFUBAO.value"></checkbox>
					</view>

				</view> -->
				<!-- #endif -->
				<view class="caShier-item-list caShier-color" @click="btn_payTa(PayTypeEnum.WECHAT.value)">
					<view class="caShier-item-icon">
						<image src="../../static/icon/icon_wxzf.png" mode=""></image>
						<text>{{PayTypeEnum.WECHAT.name}}</text>
					</view>
					<view class="coupons-item-chbox">
						<checkbox class="checks1-h5" :checked="paymentType==PayTypeEnum.WECHAT.value"></checkbox>
					</view>
				</view>
				<view class="caShier-item-list" @click="btn_payTa(PayTypeEnum.BALANCE.value)">
					<view class="caShier-item-icon" style="display: flex;align-items: center;">
						<image src="../../static/icon/icon_ye.png" mode="widthFix"></image>
						<text>{{PayTypeEnum.BALANCE.name}}（可用余额：{{userInfo.balance ? userInfo.balance : 0}}）</text>
					</view>
					<view class="coupons-item-chbox">
						<checkbox class="checks1-h5" :checked="paymentType==PayTypeEnum.BALANCE.value"></checkbox>
					</view>
				</view>
			</view>
            
           
            
		</view>

		<view class="caShier-footer">

			<view class="caShier-footer-btn" @click="btn_backTran">
				支付
			</view>
		</view>
		<view style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F3F3F3;z-index: -1;">
		</view>
	</view>
</template>

<script>
	// let timer = null;
	import {
		DeliveryStatusEnum,
		DeliveryTypeEnum,
		OrderStatusEnum,
		PayStatusEnum,
		PayTypeEnum,
		ReceiptStatusEnum
	} from '@/common/enum/order'
	import * as OrderApi from '@/api/order'
	import * as UserApi from "@/api/user.js";
	import {
		detail
	} from '@/api/order/comment.js'
	import {
		wxPayment,zfbPayment
	} from '@/utils/app'
	
	export default {
		data() {
			return {
				PayTypeEnum,
				orderDetailsList: {},
				order_id: '',
				CommonLst: {},
				countdownTime: '',
				timeOut: '',
				paymentType: null,
				order: {},
				setting: {},
				beOverdueTime: 0,
				test:"",
				test1:"",
				timer:null,
				userInfo:{},
				type:1
				// test2:"",
				// test3:"",
				// test4:"",
				// test5:"",
				// test6:""
			}
		},
		onLoad(options) {
			// this.test5 = options.order_id;
			// this.test6 = 1234;
			console.log(options)
			if(options.order_on){
				this.order_id = options.order_on;
				this.type = 2;
			}else{
				this.order_id = parseInt(options.order_id);
				this.type = 1;
			}
			// this.test4 = this.order_id;
			detail().then(res => {
				//console.log(res)
				this.settings = res.data.values;
				this.getOrderDetail()
			})
			this.getUserInfo();
		},
		onShow() {

		},
		// onBackPress(options) {
		// 	uni.showModal({
		// 		title: '确认放弃付款？',
		// 		content: '您的订单在规定时间内未完成支付将被取消，请尽快完成支付!',
		// 		cancelText: "放弃支付",
		// 		confirmText: "我在想想",
		// 		success: function(res) {
		// 			if (res.confirm) {
		// 				// 退出当前应用，改方法只在App中生效  
		// 				// plus.runtime.quit();  
		// 			} else if (res.cancel) {
		// 				//console.log('用户点击取消');
		// 				uni.redirectTo({
		// 					url: '/pages/order/order?type=0'
		// 				})
		// 			}
		// 		}
		// 	});
		// 	return true

		// },
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
		filters: {
			dateFormat: function(value) {
				var date = new Date(value);
				var sdate = Math.floor(value / 1000 / 60 / 60 / 24);
				var hour = Math.floor((value - sdate * 1000 * 60 * 60 * 24) / 1000 / 60 / 60);
				var minute = Math.floor((value - sdate * 1000 * 60 * 60 * 24 - hour * 1000 * 60 * 60) / 1000 / 60);
				var second = Math.floor((value - sdate * 1000 * 60 * 60 * 24 - hour * 1000 * 60 * 60 - minute * 1000 *
					60) / 1000);
				sdate = sdate < 10 ? "0" + sdate : sdate;
				hour = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				var result = sdate + "天" + hour + "时" + minute + "分" + second + "秒";
				return result;
			}
		},
		beforeDestroy() {
			clearTimeout(this.timeOut)
			clearInterval(this.timer)
		},
		methods: {
			// 获取会员信息
			getUserInfo() {
			  UserApi.info()
			    .then(result => {
			      this.userInfo = result.data.userInfo;
			    })
			},
			getOrderDetail() {
				const app = this
				app.isLoading = true
				if(app.type == 1){
					OrderApi.detail(app.order_id)
						.then(result => {
							// app.test3 = 123123;
							// app.test2 = JSON.stringify(result)
							app.order = result.data.order
							app.setting = result.data.setting
							// app.test = new Date(result.data.order.create_time).getTime();
							// app.test1 = result.data.order.create_time;
							// app.test2 = JSON.stringify(result)
							result.data.order.create_time = result.data.order.create_time.replace(/-/g,"/");
							// app.test = result.data.order.create_time;
							console.log(app.settings)
							let times = 0;
							if(result.data.order.order_source==20){
								times = new Date(result.data.order.create_time).getTime() + Number(app.settings.order
									.seckill_close_time) * 60 * 1000 - new Date().getTime();
							}else{
								times = new Date(result.data.order.create_time).getTime() + Number(app.settings.order
									.close_days) * 24 * 60 * 60 * 1000 - new Date().getTime();
							}
							// app.test1 = times;
							if (times > 0) {
								this.beOverdueTime = times;
								let sTime = times;
								this.timer = setInterval(() => {
									sTime = sTime - 1000;
									if (sTime > 0) {
										this.beOverdueTime = sTime;
									} else {
										this.beOverdueTime = 0;
										clearInterval(this.timer)
										uni.showModal({
											title: '提示',
											content: '订单已过期！即将跳转订单列表!',
											// cancelText: "放弃支付",
											showCancel: false,
											confirmText: "立即跳转",
											success: function(res) {
												if (res.confirm) {
													uni.redirectTo({
														url:"/pageHome/order/index?dataType=all"
													})
												}
											}
										});
									}
								}, 1000)
							} else {
								uni.showModal({
									title: '提示',
									content: '订单已过期！即将跳转订单列表!',
									// cancelText: "放弃支付",
									showCancel: false,
									confirmText: "立即跳转",
									success: function(res) {
										if (res.confirm) {
											uni.redirectTo({
												url:"/pageHome/order/index?dataType=all"
											})
										}
									}
								});
							}
					
							app.isLoading = false
						})
				}else{
					OrderApi.merge_detail(app.order_id)
						.then(result => {
							// app.test3 = 123123;
							// app.test2 = JSON.stringify(result)
							app.order = result.data.order
							app.setting = result.data.setting
							// app.test = new Date(result.data.order.create_time).getTime();
							// app.test1 = result.data.order.create_time;
							// app.test2 = JSON.stringify(result)
							result.data.order.create_time = result.data.order.create_time.replace(/-/g,"/");
							// app.test = result.data.order.create_time;
							console.log(app.settings)
							let times = 0;
							if(result.data.order.order_source==20){
								times = new Date(result.data.order.create_time).getTime() + Number(app.settings.order
									.seckill_close_time) * 60 * 1000 - new Date().getTime();
							}else{
								times = new Date(result.data.order.create_time).getTime() + Number(app.settings.order
									.close_days) * 24 * 60 * 60 * 1000 - new Date().getTime();
							}
							// app.test1 = times;
							if (times > 0) {
								this.beOverdueTime = times;
								let sTime = times;
								this.timer = setInterval(() => {
									sTime = sTime - 1000;
									if (sTime > 0) {
										this.beOverdueTime = sTime;
									} else {
										this.beOverdueTime = 0;
										clearInterval(this.timer)
										uni.showModal({
											title: '提示',
											content: '订单已过期！即将跳转订单列表!',
											// cancelText: "放弃支付",
											showCancel: false,
											confirmText: "立即跳转",
											success: function(res) {
												if (res.confirm) {
													uni.redirectTo({
														url:"/pageHome/order/index?dataType=all"
													})
												}
											}
										});
									}
								}, 1000)
							} else {
								uni.showModal({
									title: '提示',
									content: '订单已过期！即将跳转订单列表!',
									// cancelText: "放弃支付",
									showCancel: false,
									confirmText: "立即跳转",
									success: function(res) {
										if (res.confirm) {
											uni.redirectTo({
												url:"/pageHome/order/index?dataType=all"
											})
										}
									}
								});
							}
					
							app.isLoading = false
						})
				}
			},
			btn_payTa(type) {
				this.paymentType = type;

			},
			btn_backTran() {
				const app = this
				if (app.paymentType == null) {
					uni.showToast({
						icon: 'none',
						title: '请选择支付方式'
					});
					return;
				}
				let paymentType = app.paymentType;
				// #ifdef APP-PLUS
				if(paymentType == 20){
					paymentType = 40;
				}
				// #endif
				if(paymentType == PayTypeEnum.BALANCE.value){
					uni.showModal({
						content:"确认支付吗?",
						success:res=>{
							if(res.confirm){
								if(this.type == 2){
									OrderApi.mergePay(app.order_id, paymentType)
										.then(result => app.onSubmitCallback(result))
								}else{
									OrderApi.pay(app.order_id, paymentType)
										.then(result => app.onSubmitCallback(result))
								}
							}
						}
					})
				}else{
					if(this.type == 2){
						OrderApi.mergePay(app.order_id, paymentType)
							.then(result => app.onSubmitCallback(result))
					}else{
						OrderApi.pay(app.order_id, paymentType)
							.then(result => app.onSubmitCallback(result))
					}
				}
				
			},
			// 订单提交成功后回调
			onSubmitCallback(result) {
				//console.log(result)
				const app = this
				// 发起微信支付
				if (result.data.pay_type == PayTypeEnum.WECHAT.value || result.data.pay_type == 40) {
					//console.log(result)
					wxPayment(result.data.payment)
						.then(() => {
							app.$success('支付成功')
							setTimeout(() => {
								app.navToMyOrder()
							}, 1500)
						})
						.catch(err => {
							//console.log(err)
							app.$error('订单未支付')
						})
						.finally(() => {
							app.disabled = false
						})
				}
				// 余额支付
				if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
					app.$success('支付成功')
					app.disabled = false
					setTimeout(() => {
						app.navToMyOrder()
					}, 1500)
				}
				//console.log(result.data.data)
				//console.log(decodeURIComponent(result.data.data))
				if(result.data.pay_type == PayTypeEnum.ZHIFUBAO.value){
					
					zfbPayment(result.data.data)
						.then((res) => {
							//console.log(res)
							app.$success('支付成功')
							setTimeout(() => {
								app.navToMyOrder()
							}, 1500)
						})
						.catch(err => {
							//console.log(err)
							app.$error('订单未支付')
						})
						.finally(() => {
							app.disabled = false
						})
				}
			},
			navToMyOrder(order_id) {
				setTimeout(() => {
					// this.$navTo('pageHome/order/index', {
					// 	dataType:"all"
					// })
					uni.redirectTo({
						url:"/pageHome/order/index?dataType=all"
					})
				}, 1000)
			},

		}
	}
</script>
<!-- <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script> -->

<style>
	/* checkbox样式修改 */
	checkbox .wx-checkbox-input {
		border-radius: 50%;
		/* 		background-color: #ff5060;
		color: #FFFFFF !important; */
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 2upx solid #ff5060;
		background: #ff5060;
		color: #FFFFFF !important;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		font-size: 28upx;
	}

	.checks1-h5>>>.uni-checkbox-input {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
	}

	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	.checks1-h5>>>.uni-checkbox-input.uni-checkbox-input-checked {
		border: 2upx solid #ff5060;
		/* border: none; */
		background: #ff5060;
		color: #FFFFFF !important;
	}

	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	.checks1-h5>>>.uni-checkbox-input.uni-checkbox-input-checked::before {
		border-radius: 50%;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	.checks1-wx>>>.uni-checkbox-input {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
	}

	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	.checks1-wx>>>.uni-checkbox-input.uni-checkbox-input-checked {
		border: 2upx solid #ff5060;
		/* border: none; */
		background: #ff5060;
		color: #FFFFFF !important;
	}

	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	.checks1-wx>>>.uni-checkbox-input.uni-checkbox-input-checked::before {
		border-radius: 50%;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	.checks>>>.uni-checkbox-input {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
	}

	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	.checks>>>.uni-checkbox-input.uni-checkbox-input-checked {
		border: 2upx solid #ff5060;
		/* border: none; */
		background: #ff5060;
		color: #FFFFFF !important;
	}

	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	.checks>>>.uni-checkbox-input.uni-checkbox-input-checked::before {
		border-radius: 50%;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	.caShier-content {
		padding: 30upx;
		/* background-color: #FFFFFF; */
		margin-top: 16upx;
	}

	.caShier-header {
		/* display: flex; */
		/* justify-content: space-between; */
		padding: 10upx 0 50upx 0;
		text-align: center;
		/* border-bottom: 2upx solid #F5F5F5; */
	}

	.caShier-header-title {
		margin-top: 32upx;
	}

	.caShier-header-txte1 {
		font-size: 24upx;
		color: #333333;
	}

	.caShier-header-txte2 {
		font-size: 20upx;
		color: #000000;
		margin-left: 16upx;
	}

	.caShier-header-txte3 {
		font-size: 24upx;
		color: #000000;
	}

	.caShier-header-txte4 {
		font-size: 28upx;
		color: #333333;
		font-weight: bold;
	}

	.caShier-main {
		margin-top: 30upx;
	}

	.caShier-main-title {
		font-size: 26upx;
		color: #333333;
	}

	.caShier-main-list {
		display: flex;
		margin-top: 32upx;
	}

	.caShier-main-laber {
		width: 130upx;
		font-size: 24upx;
		color: #333333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.caShier-main-text1 {
		font-size: 24upx;
		color: #333333;
		margin-left: 40upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.caShier-main-text2 {
		font-size: 24upx;
		color: #DB0B0B;
		margin-left: 40upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.caShier-careful {
		width: 690upx;
		margin: 32upx auto 0;
		font-size: 20upx;
		color: #999999;
	}

	.caShier-footer {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.caShier-footer-text {
		width: 100%;
		font-size: 24upx;
		color: #D0D0D0;
		text-align: center;
		margin-bottom: 24upx;
		margin-top: 16upx;
	}

	.caShier-footer-btn {
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		font-size: 34upx;
		font-weight: bold;
		color: #FFFFFF;
		background-color: #ff5060;
	}

	.caShier-item {
		width: 702upx;
		margin: 20upx auto 30upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
		/* padding: 16upx; */
		overflow: hidden;
	}

	.caShier-item-list {
		display: flex;
		justify-content: space-between;
		padding: 30upx 20upx;
		/* margin: 20upx 0 0 0; */

	}

	.caShier-color {
		border-bottom: 2upx solid #F5F5F5;
	}

	.caShier-item-icon {}

	.caShier-item-icon>image {
		width: 48upx;
		height: 40upx;
	}

	.caShier-item-icon>text {
		display: inline-block;
		font-size: 32upx;
		color: #333333;
		font-weight: Normal;
		vertical-align: top;
		line-height: 40upx;
		margin-left: 16upx;
	}

	.caShier-careful {
		font-size: 20upx;
		color: #DB0B0B;
	}
</style>
