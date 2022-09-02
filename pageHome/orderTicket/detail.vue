<template>
	<view v-if="!isLoading" class="container">

		<view class="header">
			<!-- 订单状态 -->
			<view class="order-status">
				订单号：{{order.order_number}}
			</view>
			<!-- 下一步操作 -->
			<view class="next-action">
				{{order.state_text}}
			</view>
		</view>
		<view class="divider"></view>
		<!-- 结算信息 -->
		<view class="trade-info i-card">
			<view class="info-item">
				<view class="item-lable">下单时间</view>
				<view class="item-content">
					<text>{{order.create_time}}</text>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">出行工具</view>
				<view class="item-content">
					<text v-if="order.traffic_type == 1">飞机</text>
					<text v-if="order.traffic_type == 2">火车</text>
					<text v-if="order.traffic_type == 3">高铁</text>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">座席</view>
				<view class="item-content">
					<text v-if="order.seat_type == 1">商务座</text>
					<text v-if="order.seat_type == 2">一等座</text>
					<text v-if="order.seat_type == 3">二等座</text>
					<text v-if="order.seat_type == 4">硬座</text>
					<text v-if="order.seat_type == 5">硬卧</text>
					<text v-if="order.seat_type == 6">软卧</text>
					<text v-if="order.seat_type == 7">无座</text>
					<text v-if="order.seat_type == 8">头等舱</text>
					<text v-if="order.seat_type == 9">公务舱</text>
					<text v-if="order.seat_type == 10">经济舱</text>
					<text v-if="order.seat_type == 11">高级软卧</text>
					<text v-if="order.seat_type == 12">动卧</text>
					<text v-if="order.seat_type == 13">软座</text>
					<text v-if="order.seat_type == 14">特等座</text>
				</view>
			</view>
			
			<view class="info-item">
				<view class="item-lable">出发站点</view>
				<view class="item-content">
					<text>{{order.starting_point}}</text>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">目的站点</view>
				<view class="item-content">
					<text>{{order.finishing_point}}</text>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">出行时间</view>
				<view class="item-content">
					<text>{{order.set_out_time_str}}</text>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">车次</view>
				<view class="item-content">
					<text>{{order.train_number}}</text>
				</view>
			</view>
			<view class="info-item" v-if="order.ticket_image_id">
				<view class="item-lable">出票图片</view>
				<view class="item-content">
					<image :src="order.ticketImage.preview_url" style="width: 80upx;height: 80upx;" @click="previewUrl" :data-url="order.ticketImage.preview_url"></image>
				</view>
			</view>
		</view>
		<view class="trade-info i-card">
			<view class="info-item">
				<view class="item-lable">姓名</view>
				<view class="item-content">
					<text>{{order.name}}</text>
				</view>
			</view>
			<!-- <view class="info-item">
	    <view class="item-lable">性别</view>
	    <view class="item-content">
	      <text>{{order.gender == 1 ? '男' : '女'}}</text>
	    </view>
	  </view> -->
			<view class="info-item">
				<view class="item-lable">证件类型</view>
				<view class="item-content">
					<text>{{order.certificates_type == 1 ? '中国居民身份证' : '护照'}}</text>
				</view>
			</view>
			<view class="info-item" v-if="order.image_id">
				<view class="item-lable">证件图片</view>
				<view class="item-content">
					<image :src="order.image.preview_url" style="width: 80upx;height: 80upx;" @click="previewUrl" :data-url="order.image.preview_url"></image>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">证件号码</view>
				<view class="item-content">
					<text>{{order.certificates_number}}</text>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">联系电话</view>
				<view class="item-content">
					<text>{{order.mobile}}</text>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">12306账号</view>
				<view class="item-content">
					<text>{{order.train_account_number}}</text>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">12306密码</view>
				<view class="item-content">
					<text>{{order.train_password}}</text>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">旅客类型</view>
				<view class="item-content">
					<text v-if="order.passenger_discount_type == 1">成人</text>
					<text v-if="order.passenger_discount_type == 2">儿童</text>
					<text v-if="order.passenger_discount_type == 3">学生</text>
					<text v-if="order.passenger_discount_type == 4">残疾人</text>
					<text v-if="order.passenger_discount_type == 5">军人</text>
				</view>
			</view>
			<view class="info-item">
				<view class="item-lable">原价</view>
				<view class="item-content">
					<text>{{order.primary_price}}</text>
				</view>
			</view>
			<!-- <view class="divider"></view> -->
			<view class="trade-total">
				<text class="lable">实付款</text>
				<view class="goods-price">
					<text class="unit">￥</text>
					<text class="value">{{ order.price }}</text>
				</view>
			</view>
		</view>

		<!-- 底部操作按钮 -->
		<view class="footer-fixed">
			<view class="btn-wrapper">
				<block v-if="(order.type == 2 || order.type == 3) && order.is_refund == 1">
					<view class="btn-item" @click="onCancel()">申请退款</view>
				</block>
				<block v-if="order.type == 1">
					<view class="btn-item active" @click="onPay()">去支付</view>
				</block>
			</view>
		</view>
		<view
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background: #F3F3F3;z-index: -1;">
		</view>
	</view>
</template>

<script>
	import {
		DeliveryStatusEnum,
		DeliveryTypeEnum,
		OrderStatusEnum,
		PayStatusEnum,
		PayTypeEnum,
		ReceiptStatusEnum
	} from '@/common/enum/order'
	import * as OrderApi from '@/api/ticket/index.js'
	import {
		wxPayment
	} from '@/utils/app'

	export default {
		data() {
			return {
				// 枚举类
				DeliveryStatusEnum,
				DeliveryTypeEnum,
				OrderStatusEnum,
				PayStatusEnum,
				PayTypeEnum,
				ReceiptStatusEnum,
				// 当前订单ID
				orderId: null,
				// 加载中
				isLoading: true,
				// 当前订单详情
				order: {},
				// 当前设置
				setting: {},
				// 支付方式弹窗
				showPayPopup: false
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad({
			orderId
		}) {
			// 当前订单ID
			this.orderId = orderId

		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// 获取当前订单信息
			this.getOrderDetail()
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
			previewUrl(e){
				let url = e.target.dataset.url || e.currentTarget.dataset.url;
				uni.previewImage({
					urls:[url]
				})
			},
			// 获取当前订单信息
			getOrderDetail() {
				const app = this
				app.isLoading = true
				OrderApi.detail({
						id: app.orderId
					})
					.then(result => {
						//console.log(result)
						app.order = result.data.detail
						let item = app.order;
						if (item.type == 1) {
							item.state_text = "待支付"
						} else if (item.type == 2) {
							item.state_text = "待出票"
						} else if (item.type == 3) {
							item.state_text = "已出票"
						} else if (item.type == 4) {
							item.state_text = "已完结"
						} else if (item.type == 5) {
							item.state_text = "已取消"
						} else if (item.type == 6) {
							item.state_text = "已过期"
						}
						let year = new Date(item.set_out_time * 1000).getFullYear();
						let month = (new Date(item.set_out_time * 1000).getMonth() + 1) > 9 ? (new Date(item
							.set_out_time * 1000).getMonth() + 1) : ('0' + (new Date(item.set_out_time * 1000)
							.getMonth() + 1));
						let day = new Date(item.set_out_time * 1000).getDate() > 9 ? new Date(item.set_out_time * 1000)
							.getDate() : '0' + new Date(item.set_out_time * 1000).getDate();
						let hour = new Date(item.set_out_time*1000).getHours() > 9 ? new Date(item.set_out_time*1000).getHours() : '0' + new Date(item.set_out_time*1000).getHours();
						  let min = new Date(item.set_out_time*1000).getMinutes() > 9 ? new Date(item.set_out_time*1000).getMinutes() : '0' + new Date(item.set_out_time*1000).getMinutes();
						  let sec = new Date(item.set_out_time*1000).getSeconds() > 9 ? new Date(item.set_out_time*1000).getSeconds() : '0' + new Date(item.set_out_time*1000).getSeconds();
						item.set_out_time_str = year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
						// app.setting = result.data.setting
						app.order = item;
						app.isLoading = false
					})
			},

			// 复制指定内容
			handleCopy(value) {
				const app = this
				uni.setClipboardData({
					data: value.toString(),
					success() {
						app.$toast('复制成功')
					}
				})
			},

			// 跳转到物流跟踪页面
			handleTargetExpress() {
				this.$navTo('pageHome/order/express/index', {
					orderId: this.orderId
				})
			},

			// 跳转到商品详情页面
			handleTargetGoods(goodsId) {
				this.$navTo('pages/goods/detail', {
					goodsId
				})
			},

			// 跳转到申请售后页面
			handleApplyRefund(orderGoodsId) {
				this.$navTo('pageHome/refund/apply', {
					orderGoodsId
				})
			},

			// 取消订单
			onCancel() {
				const app = this
				uni.showModal({
					title: '友情提示',
					content: '确认要申请退款吗？',
					success(o) {
						if (o.confirm) {
							OrderApi.refund({
									id: app.orderId
								})
								.then(result => {
									// 显示成功信息
									app.$success(result.message)
									// 刷新订单列表
									app.getOrderDetail()
								})
						}
					}
				});
			},

			// 确认收货
			onReceipt() {
				const app = this
				uni.showModal({
					title: '友情提示',
					content: '确认收到商品了吗？',
					success(o) {
						if (o.confirm) {
							OrderApi.receipt(app.orderId)
								.then(result => {
									// 显示成功信息
									app.$success(result.message)
									// 刷新当前订单数据
									app.getOrderDetail()
								})
						}
					}
				});
			},

			// 点击去支付
			onPay() {
				// 显示支付方式弹窗
				// this.showPayPopup = true
				this.$navTo('pages/cashier/rechargeTicket', {
					order_id: this.orderId
				})
			},


		},

	}
</script>
<style lang="scss" scoped>
	.container {
		padding-bottom: 140rpx;
		background-color: #FFFFFF;
	}

	// 页面顶部
	.header {
		display: flex;
		justify-content: space-between;
		padding: 0 30rpx 0 30rpx;
		border: 2upx solid #EFEFEF;

		.order-status {
			display: flex;
			align-items: center;
			height: 128rpx;

			.status-icon {
				width: 128rpx;
				height: 128rpx;

				.image {
					display: block;
					width: 100%;
					height: 100%;
				}
			}

			.status-text {
				padding-left: 20rpx;
				color: #fff;
				font-size: 38rpx;
				font-weight: bold;
			}
		}

		.next-action {
			display: flex;
			align-items: center;
			height: 128rpx;
			font-size: 36upx;
			font-weight: bold;
			color: #ff5060;
		}
	}

	// 通栏卡片
	.i-card {
		background: #fff;
		// padding: 24rpx 24rpx;
		width: 94%;
		box-shadow: 0 1upx 5upx 0px rgba(0, 0, 0, 0.05);
		margin: 20upx auto 20upx auto;
		padding-bottom: 20upx;
	}

	// 交易信息
	.trade-info {

		.info-item {
			display: flex;
			margin-top: 24upx;
			margin-bottom: 24rpx;

			.item-lable {
				font-size: 24rpx;
				color: #333333;
				margin-right: 24rpx;
			}

			.item-content {
				flex: 1;
				font-size: 24rpx;
				color: #333333;
				text-align: right;
			}
		}

		.divider {
			height: 1rpx;
			background: #f1f1f1;
			margin-bottom: 24rpx;
		}

		.trade-total {
			display: flex;
			justify-content: flex-end;

			.goods-price {
				margin-left: 12rpx;
				vertical-align: bottom;
				color: $uni-text-color-active;

				.unit {
					margin-right: -2rpx;
					font-size: 24rpx;
				}

			}
		}

	}


	/* 底部操作栏 */

	.footer-fixed {
		position: fixed;
		bottom: var(--window-bottom);
		left: 0;
		right: 0;
		height: 96rpx;
		z-index: 11;
		box-shadow: 0 -4rpx 40rpx 0 rgba(97, 97, 97, 0.1);
		background: #fff;

		.btn-wrapper {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 0 30rpx;
		}

		.btn-item {
			min-width: 164rpx;
			// border-radius: 28rpx;
			padding: 10rpx 24rpx;
			font-size: 28rpx;
			color: #383838;
			text-align: center;
			border: 1rpx solid #a8a8a8;
			margin-left: 24rpx;

			&.active {
				color: #fff;
				border: none;
				background: linear-gradient(to right, #f9211c, #ff6335);
			}
		}


	}
</style>
