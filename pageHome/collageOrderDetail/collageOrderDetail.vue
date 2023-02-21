<template>
	<view>
		<seckill-nav title="拼团详情" backGround="#FFFFFF" backL="transparent" color="#333333"></seckill-nav>
		<view class="" style="width: 750upx;background-color: #F23A3A;padding: 24upx;">
			<view class="prizeWrap">

				<view class="prizeCon">
					<view class="prizeItem" v-for="(item,index) in info.num" :key="index" v-if="info.num">
						<view :class="['prizeItemT',index<info.record.length?'active':'']"
							:style="{'background-image':index<info.record.length?'url('+info.record[index].user.avatar_url+')':''}">
							<image src="../../static/home/askNo.png"
								v-if="index>=info.record.length&&info.status == -1  && info.have_prize == -1"></image>
							<image src="../../static/home/ask.png"
								v-if="index>=info.record.length&&info.status != -1&&info.is_prize==0&&info.have_prize == -1">
							</image>
						</view>
						<!-- <view class="prizeItemB" v-if="index<info.record.length">{{info.record[index].user.nick_name}}</view>
						<view class="prizeItemB" v-else>待邀请</view> -->
						<image src="../../static/home/prize_icon_min.png" class="toSuccess"
							v-if="index<info.record.length&&info.record[index].have_prize==1"></image>
					</view>
				</view>
				<view class="prizeHead" v-if="info.status == 1">
					<view class="prizeHeadL">
						<!-- <image src="../../static/home/gift_icon.png"></image> -->
						<text>结束时间</text>
					</view>
					<view class="prizeHeadR" style="height: 26upx;display: flex;"
						v-if="info.have_prize==-1||info.state==0">
						<u-count-down style="display: flex;" @end="endTime" separator-size="16"
							:timestamp="info.surplusTime" :show-border="false" font-size="28" color="white"
							:bgColor="info.state==1?'#F23A3A':'#999999'"
							:separatorColor="info.state==1?'#F23A3A':'#999999'" :showDays="true" height="46">
						</u-count-down>
					</view>

				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="shareBtn"
					v-if="info.is_prize == 0 && info.num != info.record.length && showFlag">
					<view class="shareBtnCon">邀请好友参团</view>
				</button>
				<!-- #endif -->
				<view v-if="(info.state == 0 || !showFlag) && info.have_prize == -1"
					style="margin-top: 30upx;text-align: center;font-size: 28upx;color: #000000;">
					人数不足，拼团失败!
				</view>
				<!-- <view class="shareBtnCon active" v-if="(info.state == 0 || !showFlag) && info.have_prize == -1">邀请好友参团</view> -->
			</view>
		</view>
		<view class="orderMsg">
			<!-- <view class="orderMsgHead">
				<view class="orderMsgHeadL">
					<image src="../../static/home/order_icon_color.png"></image>
					<text>订单信息</text>
				</view>
				<view class="orderMsgHeadR" style="color: red;" v-if="info.order&&info.order.delivery_status==10&&info.have_prize==1">待发货</view>
				<view class="orderMsgHeadR" v-if="info.order&&info.order.delivery_status==20&&info.have_prize==1">已发货</view>
			</view> -->
			<view class="orderMsgCon" v-if="info.goods">
				<image :src="info.goods.goods_image" class="orderMsgConL"></image>
				<view class="orderMsgConR">
					<view class="orderMsgConRM">
						<view class="orderMsgConRT">{{info.goods.goods_name}}</view>

					</view>
					<!-- <view class="orderMsgConRT">{{info.goods.goods_name}}</view> -->
					<view class="">
						<view class="orderMsgConRCR">
							x1
						</view>
					</view>
					<view class="orderMsgConRC">
						<view class="orderMsgConRCL">
							￥<text>{{info.goods.goods_price}}</text>
						</view>
					</view>

				</view>
			</view>
			<view class="orderMsgConRB" v-if="info.have_prize==-1&&info.state==1">
				实付款：<text>￥{{info.goods.goods_price}}</text>
			</view>
			<view class="orderMsgConRB1" v-if="info.is_prize==1&&info.state==1&&info.have_prize==1">
				实付款：<text>￥{{info.goods.goods_price}}</text>
			</view>
			<view class="orderMsgConRB1" v-if="(info.is_prize==1&&info.state==1&&info.have_prize==0) || info.state==0">
				已退回：<text>￥{{info.goods.goods_price}}</text>
			</view>
			<view class="orderMsgConRB1" v-if="info.is_prize==1&&info.state==1&&info.have_prize==0"
				style="margin-top: 6upx;">
				未拼中奖励：<text>￥{{info.prize_money}}</text>
			</view>
			<!-- <image src="../../static/home/prize_icon.png" class="prize_icon" v-if="info.have_prize==1&&info.state==1"></image> -->
			<!-- <image src="../../static/home/prize_icon_no.png" class="prize_icon" v-if="info.have_prize==0&&info.state==1"></image> -->
			<!-- <image src="../../static/home/collageFail.png" class="prize_icon" v-if="info.state==0"></image> -->
		</view>

		<view class="addressWrap" @click="onSelectAddress">
			<image src="../../static/home/address_icon.png" class="addressWrapL"></image>
			<view class="addressWrapC" v-if="info.order">
				<view class="addressWrapCB">
					{{info.order.region.province+info.order.region.city+info.order.region.region+info.order.address_detail}}
				</view>
				<view class="addressWrapCT">
					<view class="addressWrapCTL">{{info.order.name}}</view>
					<view class="addressWrapCTR">{{info.order.phone}}</view>
				</view>

			</view>
			<view class="addressWrapC" v-else>暂无收货地址</view>
			<!-- <image src="../../static/icon/more_gray.png" class="addressWrapR"></image> -->
		</view>
		<view class="orderInfo">
			<view class="orderNo">
				<view class="orderNoL">
					订单编号：
				</view>
				<view class="orderNoR" @click="copyOrder">
					<text>{{info.order?info.order.order_no:"暂无编号"}}</text>复制
				</view>
			</view>
			<view class="orderItem">创建时间：<text>{{info.order?info.order.create_time:'---'}}</text> </view>
			<!-- <view class="orderItem" v-if="info.order&&info.order.pay_type==10">余额支付：{{info.order.pay_price}}</view>
			<view class="orderItem" v-if="info.order&&info.order.pay_type==20">微信支付：{{info.order.pay_price}}</view> -->
			<view class="orderItem">支付时间：<text>{{info.order?info.order.pay_time:'---'}}</text> </view>
		</view>
		<view class=""
			style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: #F8F8F8;z-index: -1;">
		</view>
	</view>

</template>

<script>
	import seckillNav from "@/components/seckillNav.vue";
	import * as collageApi from "@/api/collage/collage.js";
	const app = getApp();
	export default {
		data() {
			return {
				orderid: 0,
				orderId: 0,
				info: {
					surplusTime: 0
				},
				showFlag: true,
				// 正在加载
				isLoading: true,
				// 物流信息
				express: {}
			}
		},
		components: {
			seckillNav
		},
		onLoad(options) {
			console.log(options)
			this.orderid = options.orderid;
			this.orderId = options.orderId;
			this.type = options.type;

			this.getDetail();

		},
		onShow() {
			if (this.orderid) {
				this.getDetail();
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
		onShareAppMessage() {
			let app = this;
			console.log("/pages/collageDetail/collageDetail?" + app.$getShareUrlParams({
				groupid: app.info.group_task_id
			}));
			return {
				title: "拼团详情",
				path: "/pages/collageDetail/collageDetail?" + app.$getShareUrlParams({
					groupid: app.info.group_task_id
				}),
				// imageUrl: App.$vm.globalData.setting.GroupShareImageId.preview_url
			}
		},
		onPullDownRefresh() {
			this.getDetail();
		},
		methods: {
			copyOrder() {
				uni.setClipboardData({
					data: this.info.order.order_no.toString()
				})
			},
			endTime() {
				this.showFlag = false;
			},
			getDetail() {
				console.log(app.$vm)
				let obj = {};
				obj.task_record_id = this.orderid;
				collageApi.orderInfo(obj).then(res => {
					console.log(res)
					res.data.detail.prize_money = (Math.round(Number(res.data.detail.goods
						.goods_price) * Number(
						res.data.detail.prize_ratio)) / 100).toFixed(2)
					let surplusTime = res.data.detail.expire_time - Math.floor(new Date().getTime() /
						1000);
					if (surplusTime <= 0) {
						surplusTime = 0;
						this.showFlag = false;
					}
					res.data.detail.order.pay_time = app.$vm.getTime(res.data.detail.order.pay_time *
						1000, "-",
						"time");
					res.data.detail.surplusTime = surplusTime;
					this.info = res.data.detail;
					uni.stopPullDownRefresh();
				})
			},
			getCollageExpress() {
				const app = this
				app.isLoading = true;
				collageApi.express(app.orderId)
					.then(result => {
						app.express = result.data.express
						app.isLoading = false
					})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.orderInfo {
		width: 702upx;
		padding: 30upx;
		background: #FFFFFF;
		// box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5);
		margin: 30upx auto 44upx;
		border-radius: 12upx;
	}

	.orderNo {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.orderNoL {
		font-size: 28upx;
		font-family: PingFang;
		font-weight: bold;
		color: #333333;
	}

	.orderNoR {
		font-size: 28upx;
		font-family: PingFang;
		font-weight: bold;
		color: #333333;
	}

	.orderNoR>text {
		font-size: 28upx;
		font-family: PingFang;
		font-weight: 400;
		color: #666666;
		line-height: 24upx;
		margin-right: 20upx;
	}

	.orderItem {
		font-size: 28upx;
		font-family: PingFang;
		font-weight: 700;
		color: #333333;
		line-height: 24upx;
		margin-top: 40upx;
		display: flex;
		justify-content: space-between;
	}

	.orderItem>text {
		color: #666666;
		font-weight: 400;
	}


	.orderMsgConRC {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 16upx;
		width: 100%;
	}

	.orderMsgConRCL {
		font-size: 22upx;
		line-height: 28upx;
		color: #EF343D;
		margin-right: 100upx;
	}

	.orderMsgConRCL>text {
		font-size: 28upx;
		font-weight: bold;
		line-height: 28upx;
		color: #EF343D;
	}

	.orderMsgConRCR {
		display: flex;
		justify-content: flex-end;
		color: #666666;
		font-size: 28upx;
		margin-top: 8upx;
	}

	.shareBtn {
		width: 272upx;
		padding: 0;
		margin: 0;
		line-height: 0;
		background-color: rgba(0, 0, 0, 0.01);
		margin: 30upx auto 0;
	}

	.shareBtnCon {
		width: 272upx;
		height: 80upx;
		border-radius: 40upx;
		text-align: center;
		line-height: 80upx;
		color: #F23A3A;
		border: 2upx solid #F23A3A;
		// background: linear-gradient(45deg, #FF5F60 0%, #DE6BAD 100%);
		font-size: 26upx;
		font-weight: bold;
	}

	.shareBtnCon.active {
		background: #999999;
		margin: 30upx auto 0;
	}




	.toSuccess {
		width: 44upx;
		height: 44upx;
		position: absolute;
		top: -20upx;
		right: 8upx;
	}

	.prizeWrap {
		width: 702upx;
		padding: 24upx;
		background: #FFFFFF;
		border-radius: 20upx;
	}

	.prizeHead {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 36upx;

	}

	.prizeHeadL {
		display: flex;
		align-items: center;
		margin-right: 22upx;
	}

	.prizeHeadL>image {
		width: 28upx;
		height: 28upx;
		margin-right: 16upx;
	}

	.prizeHeadL>text {
		font-size: 28upx;
		line-height: 28upx;
		color: #000;
	}

	.prizeCon {
		display: flex;
		flex-wrap: wrap;
		width: 94%;
		margin: 0 auto 0;
		// margin-top: 30upx;
	}

	.prizeItem {
		width: 102upx;
		margin-right: 24upx;
		margin-top: 28upx;
		position: relative;
	}

	// .prizeItem:nth-child(1),
	// .prizeItem:nth-child(2),
	// .prizeItem:nth-child(3),
	// .prizeItem:nth-child(4),
	// .prizeItem:nth-child(5){
	// 	margin-top: 0;
	// }
	.prizeItem:nth-child(5n+5) {
		margin-right: 0;
	}

	.prizeItemT {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		box-sizing: border-box;
		// border: 2upx dashed #FF5F60;
		// background: #FEE2E2;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.prizeItemT.active {
		border: 2upx solid #FF5F60;
		background-position: center;
		background-size: cover;
	}

	.prizeItemT>image {
		width: 80upx;
		height: 80upx;
	}

	.prizeItemB {
		font-size: 20upx;
		/* line-height: 20upx; */
		width: 102upx;
		text-align: center;
		margin-top: 20upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}



	.prize_icon {
		position: absolute;
		bottom: 30upx;
		right: 30upx;
		width: 116upx;
		height: 116upx;
	}

	.orderMsg {
		width: 702upx;
		margin: 30upx auto 0;
		padding: 24upx 28upx 24upx 24upx;
		background: white;
		box-sizing: border-box;
		// box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5);
		border-radius: 12upx;
		position: relative;
	}

	.orderMsgHead {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 16upx;
		border-bottom: 2upx solid #E5E5E5;
	}

	.orderMsgHeadL {
		display: flex;
		align-items: center;
	}

	.orderMsgHeadL>image {
		width: 28upx;
		height: 28upx;
		margin-right: 22upx;
	}

	.orderMsgHeadL>text {
		font-size: 28upx;
		line-height: 28upx;
		color: #000;
	}

	.orderMsgHeadR {
		font-size: 28upx;
		line-height: 28upx;
		color: #000;
	}

	.orderMsgCon {
		margin-top: 16upx;
		display: flex;
		/* align-items: center; */
	}

	.orderMsgConL {
		width: 180upx;
		height: 180upx;
		border-radius: 20upx;
		margin-right: 24upx;
	}

	.orderMsgConR {
		display: flex;
		flex-direction: column;
		/* justify-content: space-between; */
		/* height: 140upx; */
		width: calc(100% - 202upx);
	}

	.orderMsgConRM {
		display: flex;
		justify-content: space-between;
		height: 82upx;
	}

	.orderMsgConRT {
		font-size: 28upx;
		font-weight: bold;
		line-height: 36upx;
		color: #333333;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2; //行数需设置
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.orderMsgConRB {
		display: flex;
		justify-content: flex-end;
		color: #666666;
		font-size: 28upx;
		margin-top: 24upx;
	}

	.orderMsgConRB text {
		color: #333333;
		font-weight: bold;
	}

	.orderMsgConRB1 {
		display: flex;
		justify-content: flex-end;
		color: #666666;
		font-size: 28upx;
		margin-top: 24upx;
	}

	.orderMsgConRB1 text {
		color: #333333;
		font-weight: bold;
	}

	.orderMsgConRBT {
		font-size: 26upx;
		line-height: 26upx;
		color: #333333;
	}

	.orderMsgConRBB {
		/* margin-top: 8upx; */
	}

	.orderMsgConRBB>text {
		color: #333333;
		font-size: 28upx;
		line-height: 26upx;
		font-weight: bold;
	}

	.addressWrap {
		width: 702upx;
		margin: 30upx auto 0;
		padding: 24upx 24upx;
		background: white;
		box-sizing: border-box;
		/* box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5); */
		border-radius: 20upx;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
	}

	.addressWrapL {
		width: 40upx;
		height: 40upx;
		margin-right: 26upx;
	}

	.addressWrapC {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: calc(100% - 102upx);
		margin-right: 30upx;
	}

	.addressWrapCT {
		display: flex;
		align-items: center;
		margin-top: 16upx;
	}

	.addressWrapCTL {
		font-size: 26upx;
		line-height: 24upx;
		font-family: PingFang;
		font-weight: 400;
		color: #666666;
		margin-right: 30upx;
	}

	.addressWrapCTR {
		font-size: 26upx;
		line-height: 24upx;
		font-family: PingFang;
		font-weight: 400;
		color: #666666;
	}

	.addressWrapCB {
		font-size: 30upx;
		/* line-height: 24upx; */
		font-family: PingFang;
		font-weight: bold;
		color: #000000;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

	}

	.addressWrapR {
		width: 10upx;
		height: 18upx;
	}

	// 通栏卡片
	.i-card {
		background: #fff;
		padding: 24rpx 24rpx;
		// width: 94%;
		box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
		// margin: 0 auto 20rpx auto;
		// border-radius: 20rpx;
	}
</style>
