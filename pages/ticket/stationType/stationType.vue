<template>
	<view style="padding: 60upx 24upx 0;height: 100vh;background: white;">
		<view class="typeItem" @click="toStation">
			<view>铁路出行</view>
			<image src="../../../static/order/ticket_icon_go.png"></image>
		</view>
		<view class="typeItem active" @click="toSub" style="margin-bottom: 30upx;">
			<view>飞机出行</view>
			<image src="../../../static/order/ticket_icon_go.png"></image>
		</view>
		<rich-text :nodes="info.ticket_agreement" v-if="info.ticket_agreement"></rich-text>
		<!-- <view style="box-sizing: border-box;margin-top: 30upx;color: #333333;">*购票订单处理时间段：8:30-17:30。（如当日17:30后下单，订单将于次日8:30后处理。）</view>
		<view style="box-sizing: border-box;margin-top: 30upx;color: #333333;">*可购买发车前5小时的车票。（如当日12:00可购买当日17:00以后出发的车票。）</view>
		<view style="box-sizing: border-box;margin-top: 30upx;color: #333333;">*用户在正常订单处理时间内下单，且车次余票充足的情况下，一般5小时左右出票。</view>
		<view style="box-sizing: border-box;margin-top: 30upx;color: #333333;">*小程序仅显示直达方案，中转方案需自行查询。</view>
		<view style="box-sizing: border-box;margin-top: 30upx;color: #333333;">*如遇退票退款的情况，请在小程序“我的”-“我的钱包”-右上角“购票及话费余额”中查收退款，并自行操作提现。</view> -->
	</view>
</template>

<script>
	import {detail} from "@/api/common.js";
	export default {
		data() {
			return {
				info:{}
			}
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
		onLoad() {
			detail()
				.then(res=>{
					this.info = res.data.detail;
				})
		},
		methods: {
			toSub(){
				
				// let _this = this;
				// uni.showModal({
				// 	content:`${_this.info.ticket_remind}`,
				// 	success(res) {
				// 		if(res.confirm){
				// 			_this.$navTo("pages/ticket/index",{type:3})
				// 		}
				// 	}
				// })
				uni.showToast({
					icon:"none",
					title:'此功能暂未开放，敬请期待',
					duration: 1500
				})
			},
			toStation(){
				let _this = this;
				uni.showModal({
					content:`${_this.info.ticket_remind}`,
					success(res) {
						if(res.confirm){
							_this.$navTo("pages/ticket/stationPos/stationPos")
						}
					}
				})
				
			}
		}
	}
</script>

<style scoped>
	.typeItem{
		width: 100%;
		height: 140upx;
		box-sizing: border-box;
		padding: 0 70upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-image: url(../../../static/order/bg_ticket_train.png);
		background-size: cover;
		background-position: center;
		margin-bottom: 40upx;
	}
	.typeItem.active{
		background-image: url(../../../static/order/bg_ticket_plane.png);
		margin-bottom: 0;
	}
	.typeItem>view{
		font-size: 36upx;
		font-weight: bold;
		color: #333333;
	}
	.typeItem>image{
		width: 64upx;
		height: 52upx;
	}
</style>
