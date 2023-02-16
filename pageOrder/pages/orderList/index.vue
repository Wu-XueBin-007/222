<template>
	<view class="order-list">
		<view @click="toorder" class="orderitem">
			<view class="flex">
				<image class="orderimg" src="../../static/order.png" mode=""></image> <text>商城订单</text>
			</view>
		</view>
		<view @click="toorder" class="orderitem">
			<view class="flex">
				<image class="orderimg" src="../../static/order.png" mode=""></image> <text>秒杀订单</text>
			</view>
		</view>
		<view @click="toorder" class="orderitem">
			<view class="flex">
				<image class="orderimg" src="../../static/order.png" mode=""></image> <text>拼团订单</text>
			</view>
		</view>
		<view @click="toorder" class="orderitem">
			<view class="flex">
				<image class="orderimg" src="../../static/order.png" mode=""></image> <text>会员订单</text>
			</view>
		</view>
		<view @click="toorder" class="orderitem">
			<view class="flex">
				<image class="orderimg" src="../../static/order.png" mode=""></image> <text>高奢订单</text>
			</view>
		</view>
		<view @click="toorder" class="orderitem">
			<view class="flex">
				<image class="orderimg" src="../../static/order.png" mode=""></image> <text>大会员订单</text>
			</view>
		</view>
		<view @click="toorder" class="orderitem">
			<view class="flex">
				<image class="orderimg" src="../../static/order.png" mode=""></image> <text>盲盒订单</text>
			</view>
		</view>
	</view>

</template>

<script>
	export default {

		data() {
			return {

			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {

		},
		onShow() {


		},
		methods: {
			toorder() {
				uni.navigateTo({
					url: '/pageHome/order/index'
				})
			}
		},


		/**
		 * 设置分享内容
		 */
		onShareAppMessage() {},

		/**
		 * 分享到朋友圈
		 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
		 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
		 */
		onShareTimeline() {}

	}
</script>

<style lang="scss" scoped>
	.order-list {
		padding: 20rpx;
		box-sizing: border-box;
		margin: 20rpx;
		background: white;
		border-radius: 10rpx;

		.orderitem {
			padding: 20rpx;
			font-size: 30rpx;
			position: relative;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #e8e8e8;
			justify-content: space-between;

			&::after {
				content: '';
				width: 12rpx;
				height: 12rpx;
				background-color: transparent;
				/* 模块背景为透明 */
				border-color: #f02c57;
				border-style: solid;
				border-width: 1px 1px 0 0;
				transform: rotate(45deg);
			}

			.orderimg {
				width: 40rpx;
				height: 40rpx;
				margin-right: 20rpx;
				display: inline-block;
				vertical-align: middle;
			}
		}
	}
</style>
