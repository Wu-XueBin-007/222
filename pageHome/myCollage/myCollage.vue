<template>
	<view style="height: 100vh;">
		<nav-head title="我的拼团" backGround="#F23A3A" backL="transparent" color="white"></nav-head>

		<view :style="{'height': 'calc(100% - '+navInfo.navH+'px)'}" class="conWrapBox">
			<view class="headWrap">
				<view class="head">
					<view :class="['headItem',headIndex==0?'active':'']" data-index="0" @click="changeNav">拼团中</view>
					<view :class="['headItem',headIndex==1?'active':'']" data-index="1" @click="changeNav">已拼中</view>
					<view :class="['headItem',headIndex==2?'active':'']" data-index="2" @click="changeNav">未拼中</view>
					<view :class="['headItem',headIndex==3?'active':'']" data-index="3" @click="changeNav">拼团失败</view>
					<!-- <view :class="['headItem',headIndex==4?'active':'']" data-index="4" @click="changeNav">已超时</view> -->
				</view>
			</view>
			<view style="display: flex;height: calc(100% - 88upx);">
				<swiper :indicator-dots="false" :autoplay="false" :interval="3000" :duration="1000"
					style="height: 100%;width: 100%;" @change="changeSwiper" :current="headIndex">
					<swiper-item v-for="index of 4" style="height: 100%;">
						<scroll-view :scroll-y="true" @scrolltolower="loadMore" class="con"
							style="height: 100%;padding-top: 30upx;">
							<view class="conItem" v-for="(item,index) in list" :key="index">
								<!-- <view class="conItemT">
									<view class="conItemTL">
										<view class="conItemTLImg" v-if="item.record5&&item.record5.length>0" :style="{'background-image': 'url('+pitem.user.avatar_url+')'}" v-for="(pitem,pindex) in item.record5" :key="pindex"></view>
										<view class="conItemTLTxt">{{item.create_time}}</view>
									</view>
									<view class="conItemTR" @click.stop="">
										<text v-if="headIndex==0">还差{{item.num - item.current_num}}人成团</text>
										<text v-if="headIndex==3||headIndex==4" style="font-size: 24upx;">已失败</text>
										<button open-type="share" class="conItemTRShare" :data-index="index" data-type="detail" v-if="headIndex!=3&&headIndex!=4">
											<image src="../../static/home/share_icon_act.png"></image>
										</button>
									</view>
								</view> -->

								<view :class="['conItemB',(headIndex==1||headIndex==2)?'active':'']" v-if="item.goods">
									<image :src="item.goods.goods_image" class="conItemBL"></image>
									<image src="../../static/home/prize_icon.png" class="prize"
										v-if="item.have_prize==1&&headIndex!=3&&headIndex!=4"></image>
									<view class="" v-if="item.have_prize==1&&headIndex!=3&&headIndex!=4"
										style="position: absolute;left: 24upx;top: 24upx;width: 180upx;height: 180upx;border-radius: 20upx;background-color:rgba(0, 0, 0, 0.2);">

									</view>
									<view class="conItemBR">
										<view class="conItemBRT">
											<view class="conItemBRTT"></text>{{item.goods.goods_name}}</view>
											<!-- <view class="conItemBRC">
												<text class="conItemBRCL">订单号：{{item.order_no?item.order_no:"暂无订单号"}}</text>
												<text class="conItemBRCR" :data-index="index" @click.stop="copyOrderNo" v-if="item.have_prize==-1">复制</text>
											</view> -->
											<view class="conItemBRTB"><text>￥{{item.goods.goods_price}}</text></view>
										</view>
										<view class="conItemBRB">
											<view class="conItemBRP">
												X1
											</view>
										</view>
									</view>

								</view>
								<view class="collageMain">
									<view class="collageMainL" v-if="headIndex==0">
										拼团中
									</view>
									<view class="collageMainL2" v-if="headIndex==1">
										已拼中
									</view>
									<view class="collageMainL" v-if="headIndex==2">
										未拼中
									</view>
									<view class="collageMainL" v-if="headIndex==3">
										拼团失败
									</view>
									<!-- 									<view class="collageMainL" v-if="headIndex==4">
										已超时
									</view> -->
									<view class="collageMainR">
										拼团价：<text>￥{{item.order.pay_price}}</text>
									</view>
								</view>
								<view class="collageBtn">
									<!-- <image src="../../static/home/prize_icon_no.png" class="prize" v-if="item.have_prize==0&&headIndex!=3&&headIndex!=4"></image> -->
									<view class="conItemBRBCheckDetail2" v-if="headIndex==1&&item.delivery_status==10"
										:data-index="index" @click="handleExchange(item.order_no,item.exchange_status)">
										{{item.exchange_status==0?'立即兑换':'已兑换'}}
									</view>
									<view class="conItemBRBCheckDetail2"
										v-if="item.have_prize==1&&headIndex!=3&&headIndex!=4&&item.exchange_status!=1"
										:data-index="index" @click="handleTargetExpress(item.order_id)">查看物流</view>
									<view class="conItemBRBCheckDetail"
										v-if="item.have_prize==-1||headIndex==3||headIndex==4" :data-index="index"
										@click="toDetail">查看详情</view>

									<view class="conItemBRBCheckDetail1" v-else :data-index="index" @click="toDetail">
										查看详情</view>
								</view>
							</view>
							<view style="padding-top: 100upx;" v-if="list.length==0">
								<u-empty text="暂无拼团订单"></u-empty>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import navHead from "@/components/navHead.vue";
	import * as collageApi from "@/api/collage/collage.js";
	const App = getApp();
	let falg = false;
	export default {
		data() {
			return {
				headIndex: 0,
				page: 1,
				list: [],
				moreFlag: false,
				navInfo: {
					leftDistance: 0,
					lineHeight: 0,
					navH: 0,
					paddingTop: 0
				}
			}
		},
		components: {
			navHead
		},
		onLoad() {
			let obj = {};
			obj.leftDistance = App.globalData.leftDistance;
			obj.lineHeight = App.globalData.lineHeight;
			obj.navH = App.globalData.navH;
			obj.paddingTop = App.globalData.paddingTop;
			console.log(obj)
			this.navInfo = obj;

		},
		onShow() {
			this.getList();
		},
		// onReachBottom() {
		// 	console.log(123)
		// 	if(!this.moreFlag){
		// 		return false;
		// 	}
		// 	this.moreFlag = false;
		// 	this.page = this.page + 1;
		// 	this.getList();
		// },
		onShareAppMessage(e) {
			console.log(e)
			console.log(App.$vm.globalData.setting)
			let type = e.target.dataset.type;
			if (type) {
				let index = e.target.dataset.index;
				console.log(index, this.list[index])
				return {
					title: "拼团详情",
					path: "/pages/collageDetail/collageDetail?groupid=" + this.list[index].group_task_id,
					imageUrl: App.$vm.globalData.setting.GroupShareImageId.preview_url
				}
			} else {
				return {
					title: "我的拼团",
					path: "/pageHome/myCollage/myCollage",
					imageUrl: App.$vm.globalData.setting.GroupShareImageId.preview_url
				}
			}
		},
		methods: {
			loadMore() {
				if (!this.moreFlag) {
					return false;
				}
				this.moreFlag = false;
				this.page = this.page + 1;
				this.getList();
			},
			changeSwiper(e) {
				console.log(e)
				this.headIndex = e.detail.current;
				this.page = 1;
				this.list = [];
				this.getList();
			},
			copyOrderNo(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				uni.setClipboardData({
					data: this.list[index].order_no.toString()
				})
			},
			toMyWallet() {
				this.$navTo('pageHome/wallet/index')
			},
			toDetail(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				let type = Number(this.headIndex) + 1
				uni.navigateTo({
					url: "/pageHome/collageOrderDetail/collageOrderDetail?orderid=" + this.list[index].id +
						"&orderId=" + this.list[index].order_id + "&type=" + type
				})
			},
			handleTargetExpress(orderId) {
				console.log(orderId)
				this.$navTo('pageHome/express/express', {
					orderId: orderId
				})
			},
			handleExchange(id, exchange_status) {
				let _this = this
				if (exchange_status > 0) return;
				uni.showModal({
					content: '是否确定兑换',
					success(res) {
						if (res.confirm) {
							collageApi.exchange({
								order_no: id
							}, {
								load: false
							}).then(res => {
								console.log(res);
								uni.showToast({
									title: res.data.text,
									icon: 'none',
									success() {
										_this.getList()
									}
								})
							})
						}

					}
				})

			},
			changeNav(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				this.headIndex = index;
				this.page = 1;
				this.getList();
			},
			getList() {
				let obj = {};
				obj.type = Number(this.headIndex) + 1;
				obj.page = this.page;
				if (falg) return;
				falg = true
				collageApi.orderList(obj, {
					load: false
				}).then(res => {
					falg = false
					console.log(res)
					if (this.page == 1) {
						this.list = res.data.list.data;
					} else {
						this.list = this.list.concat(res.data.list.data);
					}
					if (res.data.list.last_page > this.page) {
						this.moreFlag = true;
					} else {
						this.moreFlag = false;
					}
					console.log(this.list, 'this.list');
				})
			}
		}
	}
</script>

<style scoped>
	.conWrapBox {
		/* padding-top: 50upx; */
		box-sizing: border-box;
	}

	.conItemTLTxt {
		font-size: 24upx;
		color: #595656;
	}

	.con {
		width: 100%;
		padding: 0 16upx 16upx;
		box-sizing: border-box;
	}

	.conItem {
		width: 702upx;
		/* height: 412upx; */
		background: #FFFFFF;
		/* box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5); */
		margin-bottom: 30upx;
		box-sizing: border-box;
		/* padding: 0 24upx; */
		border-radius: 20upx;
	}

	.conItemT {
		padding: 26upx 0 16upx;
		border-bottom: 2upx solid #E5E5E5;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.conItem:last-child {
		margin-bottom: 0;
	}

	.conItemTL {
		display: flex;
	}

	.conItemTLImg {
		width: 40upx;
		height: 40upx;
		border-radius: 50%;
		background-position: center;
		background-size: cover;
		/* transform: translateX(-16upx); */
		/* position: relative; */
		margin-left: -16upx;
	}

	.conItemTLImg:nth-child(1) {
		margin-left: 0;
	}

	.conItemTR {
		display: flex;
		align-items: center;
	}

	.conItemTR>text {
		font-size: 28upx;
		line-height: 28upx;
		color: #595656;
		margin-right: 20upx;
	}

	.conItemTRShare {
		padding: 0;
		margin: 0;
		background: transparent;
		line-height: 0;
		border-radius: 0;
	}

	.conItemTRShare>image {
		width: 28upx;
		height: 28upx;
	}

	.conItemB {
		padding: 24upx;
		display: flex;
		position: relative;
	}

	.conItemB.active {
		padding: 24upx;
	}

	.prize {
		position: absolute;
		width: 122upx;
		height: 122upx;
		left: 54upx;
		bottom: 54upx;
		z-index: 9;
	}

	.conItemBL {
		width: 180upx;
		height: 180upx;
		border-radius: 20upx;
		margin-right: 24upx;
	}

	.conItemBR {
		width: calc(100% - 206upx);
		/* height: 140upx; */
	}

	.conItemBRT {
		display: flex;
		justify-content: space-between;
		height: 82upx;
	}

	.conItemBRTT {
		font-size: 28upx;
		line-height: 36upx;
		font-weight: bold;
		color: #333333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 22upx;
		width: 70%;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2; //行数需设置
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.conItemBRTB>text {
		font-size: 28upx;
		line-height: 36upx;
		color: #333333;
		font-weight: bold;
	}

	.conItemBRB {
		margin-top: 20upx;
		display: flex;
		justify-content: flex-end;
	}

	.conItemBRP {
		font-size: 28upx;
		color: #666666;
	}

	.conItemBRC {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 22upx;
	}

	.conItemBRCL {
		font-size: 22upx;
		line-height: 22upx;
		color: #999999;
	}

	.conItemBRCR {
		font-size: 22upx;
		line-height: 22upx;
		color: #FF5F60;
	}

	.conItemBRB {
		font-size: 28upx;
		line-height: 36upx;
		color: #999999;
	}

	.conItemBRB>text {
		color: #E60012;
		font-size: 28upx;
		line-height: 36upx;
	}

	.conItemBRB1 {
		display: flex;
		align-items: center;
		font-size: 28upx;
		line-height: 28upx;
		color: #999999;
		justify-content: space-between;
	}

	/* .conItemBRB1>text:nth-child(1){
		font-size: 28upx;
		line-height: 28upx;
		color: #999999;
	} */
	.conItemBRB1>text:last-child {
		/* padding: 0 16upx; */
		box-sizing: border-box;
		height: 28upx;
		/* border: 2upx solid #FF5F60; */
		/* border-radius: 14upx; */
		line-height: 28upx;
		text-align: center;
		color: #FF5F60;
		/* margin-left: 16upx; */
		font-size: 28upx;
	}



	.headWrap {
		width: 750upx;
		height: 88upx;
		box-sizing: border-box;
		/* border-radius: 24upx; */
		/* border-image: linear-gradient(-90deg, #FF5F60, #DE6BAD) 10 10; */
		background: #FFFFFF;
		/* padding: 2upx; */
		margin: 0 auto 0;
	}

	.head {
		width: 750upx;
		height: 88upx;
		display: flex;
		align-items: center;
	}

	.headItem {
		width: 25%;
		height: 88upx;
		line-height: 88upx;
		font-size: 30upx;
		font-weight: 500;
		color: #333333;
		text-align: center;
	}

	.headItem.active {
		/* background: linear-gradient(45deg, #FF5F60 0%, #DF6BAA 100%); */
		color: #F23A3A;
		font-weight: bold;
	}

	.collageMain {
		display: flex;
		justify-content: space-between;
	}

	.collageMainL {
		width: 120upx;
		height: 60upx;
		background-color: #F3F3F3;
		border-radius: 0 40upx 40upx 0;
		font-size: 26upx;
		color: #333333;
		font-weight: bold;
		text-align: center;
		line-height: 60upx;
	}

	.collageMainL2 {
		width: 120upx;
		height: 60upx;
		background-color: #FFF6F7;
		border-radius: 0 40upx 40upx 0;
		font-size: 26upx;
		color: #EF343D;
		font-weight: bold;
		text-align: center;
		line-height: 60upx;
	}

	.collageMainR {
		font-size: 28upx;
		color: #666666;
		font-weight: bold;
		margin-right: 24upx;
		line-height: 60upx;
	}

	.collageMainR text {
		color: #333333;
	}

	.collageBtn {
		display: flex;
		justify-content: flex-end;
		margin-top: 40upx;
		padding-right: 24upx;
		padding-bottom: 24upx;
	}

	.conItemBRBCheckDetail {
		width: 176upx;
		height: 80upx;
		line-height: 80upx;
		box-sizing: border-box;
		border-radius: 40upx;
		border: 2upx solid #F23A3A;
		text-align: center;
		font-size: 28upx;
		font-weight: bold;
		color: #F23A3A;
		/* position: absolute;
		right: 0;
		bottom: 24upx; */
	}

	.conItemBRBCheckDetail1 {
		width: 176upx;
		height: 80upx;
		line-height: 80upx;
		box-sizing: border-box;
		border-radius: 40upx;
		border: 2upx solid #F23A3A;
		text-align: center;
		font-size: 28upx;
		font-weight: bold;
		color: #F23A3A;
		/* position: absolute;
		right: 142upx;
		bottom: 24upx; */
	}

	.conItemBRBCheckDetail2 {
		width: 176upx;
		height: 80upx;
		line-height: 80upx;
		box-sizing: border-box;
		border-radius: 40upx;
		border: 2upx solid #C8C8C8;
		text-align: center;
		font-size: 28upx;
		font-weight: bold;
		color: #333333;
		margin-right: 24upx;
	}
</style>
