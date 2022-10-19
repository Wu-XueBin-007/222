<template>
	<view class="boxs">
		<view class="member">
			<view class="memberMainT">
				<view class="memberImg">
					<image :src="userInfo.big_vip_user.user.avatar_url"></image>
				</view>
				<view class="memberInfo">
					<view class="memberName">
						<view class="vipName">
							{{userInfo.big_vip_user.user.nick_name}}
						</view>
						<view class="vipIcon">
							<image src="../../static/member_icon.png" v-if="userInfo.big_vip_user.is_vip==1"></image>
						</view>
					</view>
					<!-- 					<view class="memberTime" v-if="userInfo.big_vip_user.is_vip==1">
						到期时间：{{userInfo.big_vip_user.expire_time}}
					</view> -->
					<view class="memberTime" v-if="userInfo.big_vip_user.is_vip==0">
						您还不是大会员哦~
					</view>
				</view>
			</view>
			<!-- 			<view class="renewBtn" v-if="userInfo.big_vip_user.is_vip==1" @click="toRenew">
				立即续费
			</view> -->
			<view class="purchasePrice" v-if="userInfo.big_vip_user.is_vip==1">
				<view class="purchasePriceL">
					<view class="price">
						<text>￥</text>
						<view class="priceL">{{userInfo.big_vip_user.reward_withdraw}}</view>
					</view>
					<view class="consumption">
						累计返现金额
					</view>
				</view>
				<view class="purchasePriceR" @click="toRecord" :data-userid="userInfo.big_vip_user.user_id">
					<view class="recordT">
						<image src="../../static/buy_record.png"></image>
					</view>
					<view class="recordM">
						购买记录
					</view>
				</view>
			</view>
			<view :class="['privilege',status==true?'unprivilege':'']">
				<view class="privilegeT">
					会员尊享特权
				</view>

				<view class="privilegeA">
					<!-- <view class="recharge">
						<view class="rechargeT">
							<image src="../../static/icon-recharge.png"></image>
						</view>
						<view class="rechargeInfo">
							<view class="rechargeInfoT">话费充值9折</view>
							<view class="rechargeInfoB">200元话费/月</view>
						</view>
					</view> -->
					<!-- <view class="recharge">
						<view class="rechargeT">
							<image src="../../static/icon-free.png"></image>
						</view>
						<view class="rechargeInfo">
							<view class="rechargeInfoT">专区免单</view>
							<view class="rechargeInfoB">每月4次免单</view>
						</view>
					</view> -->
					<!-- <view class="recharge">
						<view class="rechargeT">
							<image src="../../static/icon-ticket.png"></image>
						</view>
						<view class="rechargeInfo">
							<view class="rechargeInfoT">高铁火车9折</view>
							<view class="rechargeInfoB">优惠24次/年</view>
						</view>
					</view> -->
					<jyf-parser :html="content"></jyf-parser>
					<view class="mask">

					</view>
				</view>
				<view class="checkE" @click="toEquity">
					<view style="z-index: 4;">
						查看会员权益
					</view>
					<view style="z-index: 4;" class="morebtn">
						<image src="../../static/more.png"></image>
					</view>
				</view>
				<view class="vipbtn" v-if="userInfo.big_vip_user.is_vip==0" @click="openMember">
					<image src="../../static/vip_btn.png"></image>
					<view class="vipM">
						￥{{userInfo.setting.vip_price}}, 不回本退差价
					</view>
				</view>
				<!-- <view class="openvip">
					<view class="openvipT">
						开通大会员专区免单
					</view>
					<view class="openvipB">
						<image src="../../static/free.png"></image>
						<view class="openvipM">
							专区免单，每月4次
						</view>
					</view>
				</view> -->

			</view>
			<view class="other">
				<image src="../../static/back_bottomB.png"></image>

			</view>
			<image v-if="userInfo.big_vip_user.is_vip==0"
				style="position: fixed;top: 0;left: 0;right: 0;bottom: 0; z-index: -1; width: 100%; height: 69%;"
				src="../../static/vipback.png"></image>
			<image v-if="userInfo.big_vip_user.is_vip==1"
				style="position: fixed;top: 0;left: 0;right: 0;bottom: 0; z-index: -1; width: 100%; height: 82.8%;"
				src="../../static/vipback.png"></image>
			<view
				style="position:fixed; top: 0 ;right: 0;bottom: 0;left: 0;background: linear-gradient(180deg, #FBF8F3 0%, #F8F8F6 100%);z-index: -99;">
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import * as memberApi from "@/api/member/index.js";
	import wxPayment from '@/utils/app'
	import * as CheckoutApi from '@/api/checkout'
	import * as GoodsApi from '@/api/goods'
	import jyfParser from '@/components/jyf-parser/jyf-parser'
	const App = getApp()
	export default {
		data() {
			return {
				balanceLog: [],
				page: 1,
				limit: 6,
				bottomFlag: true,
				topFlag: true,
				status: false,
				userInfo: [],
				goodsId: '',
				expireTime: '',
				content: ''
			}
		},
		onLoad() {
			this.getUserinfo()
		},
		components: {
			jyfParser
		},
		onShow() {
			// this.getbalanceLog()
			this.getUserinfo()
			// console.log('123')
		},
		onPullDownRefresh() {
			// 下拉
			if (!this.topFlag) {
				return false;
			}
			// this.getgivemap();
			this.bottomFlag = true;
			this.page = 1;
			this.topFlag = false;
			this.getbalanceLog(true);
		},
		onReachBottom() {
			// 触底
			if (!this.bottomFlag) {
				return false;
			}
			this.page = this.page + 1;
			this.bottomFlag = false;
			this.status = "loading";
			// clearInterval(this.timeOut)
			// this.getbalanceLog();


		},
		methods: {
			// getbalanceLog(flag){
			// 	var obj={};
			// 	obj.page=this.page;
			// 	obj.limit=this.limit;
			// 	obj.user_id=this.$store.getters.userId;
			// 	memberApi.balanceLog(obj).then(res=>{
			// 		console.log(res)
			// 		this.balanceLog=res.data.balance_log.data;
			// 		if(res.status==200){
			// 			// this.JgoodsList=res.data.list.data;
			// 			if(flag){
			// 				this.topFlag = true;
			// 				this.bottomFlag = true;
			// 				uni.stopPullDownRefresh()
			// 			}
			// 			if(Math.ceil(res.data.balance_log.total/this.limit)!=this.page&&res.data.balance_log.last_page>0){
			// 				this.bottomFlag = true;
			// 				this.status = "loadmore";
			// 			}else{
			// 				this.status = "normal";
			// 			}
			// 			if(this.page != 1){
			// 				this.balanceLog = this.balanceLog.concat(res.data.balance_log.data)


			// 			}else{
			// 				this.balanceLog = res.data.balance_log.data

			// 			}

			// 		}
			// 	})
			// }
			getUserinfo() {
				memberApi.userInfo().then(res => {
					console.log(res)
					this.userInfo = res.data
					this.goodsId = res.data.setting.vip_goods_id
					// console.log(this.goodsId,10)
					// this.expireTime = Date(res.data.big_vip_user.expire_time).toString()
					this.expireTime = res.data.big_vip_user.expire_time
					// this.expireTime = new Date().format("yyyy-MM-dd")
					// let time = this.expireTime.getFullYear()+(this.expireTime.getMonth()+1)+this.expireTime.getDate();
					// console.log(time,123123)
					GoodsApi.detail(res.data.setting.vip_goods_id)
						.then(result => {
							console.log(result, 'resultresult');
							this.content = result.data.detail.content
							// if (result.status == 500) {
							// 	uni.navigateBack()
							// }

						})
						.catch((err) => {
							console.log(err);
						})
				})
			},
			toRecord(e) {
				console.log(e, 121)
				let userId = e.currentTarget.dataset.userid || e.Target.dataset.userid;
				uni.navigateTo({
					url: './record?userid=' + userId
				})
			},
			toEquity() {
				uni.navigateTo({
					url: './Equitydetails'
				})
			},
			openMember() {
				// console.log(123)
				// let obj = {}
				// obj.mode = 'buyNow'
				// obj.goodsid = this.goodsId
				// obj.goodsSkuId = 0
				// obj.goodsNum = 1
				// CheckoutApi.submit(obj).then(res=>{
				// 	console,log(res)
				// })

				const params = {
					delivery: this.curDelivery || 0,
					couponId: this.selectCouponId || 0,
					isUsePoints: this.isUsePoints ? 1 : 0,
				}
				// 请求api
				CheckoutApi.submit('buyNow', this.getRequestParam())
					.then(result => {
						// this.initData(result.data)
						let order_on = result.data.order_on
						console.log(result.data.order_on, 12)
						uni.navigateTo({
							url: './pay?order_on=' + order_on
						})
					})
					.catch(err => err)

			},
			getRequestParam() {
				const app = this
				const {
					options
				} = app
				// 结算模式的固定参数
				const modeParam = {}
				// 结算模式: 立即购买

				modeParam.goodsId = this.goodsId
				modeParam.goodsNum = 1
				modeParam.goodsSkuId = 0
				modeParam.payType = 0

				// 结算模式: 购物车

				// 订单结算参数(用户选择)
				const orderParam = {
					// delivery: app.curDelivery || 0,
					// couponId: app.selectCouponId || 0,
					// isUsePoints: app.isUsePoints ? 1 : 0,
				}
				return {
					...orderParam,
					...modeParam
				}
			},
			toRenew() {
				uni.navigateTo({
					url: './renew'
				})
			}
		}

	}
</script>

<style scoped lang="scss">
	.boxs {
		width: 100%;
		height: 100%;
		// background-image:url(../../static/vipback.png) ;
		// background-image: url(../../static/vipback.png);
	}

	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
	}

	.member {
		// height: 1400upx;
		height: 100%;
	}

	.memberMainT {
		/* margin: 20upx auto 0; */
		width: 750upx;
		height: 130upx;
		display: flex;
		justify-content: flex-start;
		padding-top: 40upx;
		// padding-bottom: 40upx;
		margin-bottom: 40upx;
		// position: relative;
	}

	.memberImg {
		width: 90upx;
		height: 90upx;
		background-color: white;
		border-radius: 50upx;
		margin: 0 0 0 40upx;

		image {
			width: 100%;
			height: 100%;
			border-radius: 50upx;
		}
	}

	.memberInfo {
		width: 600upx;
		margin: 0 0 0 20upx;
	}

	.memberName {
		width: 600upx;
		display: flex;
		justify-content: flex-start;
	}

	.vipName {
		color: #333333;
		outline-offset: 32upx;
		font-weight: bold;
	}

	.vipIcon {
		width: 80upx;
		height: 40upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.memberTime {
		// width: 264upx;
		height: 34upx;
		color: #4F2A03;
		font-size: 24upx;
		font-weight: 400;

	}

	.renewBtn {
		width: 134upx;
		height: 48upx;
		text-align: center;
		line-height: 48upx;
		color: #A27748;
		border-radius: 24upx 0 0 24upx;
		background-color: #FBEACD;
		position: absolute;
		right: 0;
		top: 60upx;
		font-size: 26upx;
	}

	.purchasePrice {
		width: 702upx;
		height: 200upx;
		margin: 0 auto 0;
		background-color: #F5E7D5;
		border-radius: 10upx;
		display: flex;
		justify-content: space-between;
		// position: relative;
		// top: 0;
	}

	.purchasePriceL {
		width: 300upx;
		height: 150upx;
		margin: 40upx 0 0 40upx;
	}

	.price {
		width: 208upx;
		height: 66upx;
		// text-align: center;
		line-height: 66upx;
		// font-size: 60upx;
		font-weight: 400;
		color: #4F2A03;
		display: flex;
		justify-content: flex-start;
	}

	.priceL {
		font-size: 60upx;
	}

	.consumption {
		color: #4F2A03;
		font-weight: 400;
		font-size: 24upx;
	}

	.purchasePriceR {
		width: 96upx;
		height: 100upx;
		margin: 50upx 40upx 0 0;
	}

	.recordT {
		width: 48upx;
		height: 48upx;
		margin: 0 0 0 24upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.recordM {
		width: 96upx;
		height: 34upx;
		font-size: 24upx;
		color: #A27748;
	}

	.privilege {
		width: 738upx;
		height: 860upx;
		background-image: url(../../static/black_back.png);
		background-size: 738upx 986upx;
		margin: -24rpx auto 0;
		position: relative;
		// position: absolute;
		// top: 340upx;

	}

	.unprivilege {
		width: 738upx;
		height: 538upx;
		background-image: url(../../static/black_back.png);
		background-size: 738upx 986upx;
		margin: -24rpx auto 0;
		// position: absolute;
		// top: 340upx;

	}

	.privilegeT {
		width: 260upx;
		color: #A27748;
		margin: 0 auto;
		font-size: 36rpx;
		padding-top: 20upx;
		font-family: PingFang SC-Bold, PingFang SC;
		font-weight: bold;
		color: #A27748;
	}

	.privilegeA {
		display: flex;
		justify-content: space-between;
		// margin: 20upx 0 0 0;
		// padding-top: 60upx;
		padding: 60upx 60upx 24upx;

		.tiptext {
			font-size: 26rpx;
			font-weight: 400;
			color: #BBBBBB;
		}
	}

	.recharge {
		width: 192upx;
		height: 200upx;
		// margin-left: 60upx;
	}

	.rechargeT {
		width: 84upx;
		height: 84upx;
		margin: 0 0 0 54upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.rechargeInfo {
		width: 192upx;
		height: 68upx;

	}

	.rechargeInfoT {
		width: 192upx;
		height: 40upx;
		color: #EBDCC8;
		font-size: 28upx;
		font-weight: 400;
		text-align: center;
		margin: 12upx 0 0 0;
	}

	.rechargeInfoB {
		width: 192upx;
		height: 34upx;
		color: #FFFFFF;
		font-size: 24upx;
		font-weight: 300;
		text-align: center;
	}

	.checkE {
		width: 184upx;
		height: 34upx;
		margin: 0 auto;
		color: #B4AEA6;
		font-size: 24upx;
		font-weight: 400;
		display: flex;
		justify-content: flex-start;
		text-align: center;
		z-index: 4;
	}

	.morebtn {
		width: 40upx;
		height: 40upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.openvip {
		width: 642upx;
		height: 268upx;
		margin: 20upx auto;
		background: linear-gradient(180deg, #4A4748 0%, #3D3B3C 100%);
		border: 1px solid #56555A;
		opacity: 1;
	}

	.openvipT {
		width: 352upx;
		height: 44upx;
		margin: 20upx auto;
		font-size: 32upx;
		color: #EDC69A;
		font-weight: bold;
	}

	.openvipB {
		width: 546upx;
		height: 156upx;
		margin: 20upx 0 0 48upx;
		// background-image: url(../../static/free.png);
		position: relative;

		image {
			width: 100%;
			height: 100%;
			// z-index: -1;
		}

	}

	.openvipM {
		width: 288upx;
		// height: 104upx;
		font-size: 32upx;
		font-weight: 800;
		color: #4F2A03;
		margin: 52upx 166upx 0;
		// padding-top: 52upx;
		position: absolute;
		top: 0;
	}

	.otherB {
		width: 750upx;
		height: 50upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.other {
		width: 750upx;
		height: 206upx;
		margin-top: -188rpx;
		padding-top: 40rpx;
		position: relative;

		// background-image: url(../../static/back_bottomB.png);
		image {
			width: 100%;
			height: 100%;
		}
	}

	.vipbtn {
		width: 506upx;
		height: 112upx;
		margin: 10rpx auto 0;
		position: absolute;
		bottom: 104rpx;
		left: 135upx;
		z-index: 3;

		image {
			width: 100%;
			height: 100%;
			// margin-top: 10upx;
		}

		// background-image: url(../../static/vip_btn.png);
		// background-size: 750upx 112upx;
	}

	.vipM {
		// width: 400upx;
		height: 66upx;
		color: #A57344;
		font-weight: 800;
		font-size: 36upx;
		margin: 0 auto;
		padding-top: 20upx;
		position: absolute;
		top: 0;
		left: 58upx;
	}

	.otherM {
		width: 750upx;
		height: calc(100% - 592px);
		background: linear-gradient(180deg, #FBF8F3 0%, #F8F8F6 100%);
		;
	}
</style>
