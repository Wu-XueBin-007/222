<template>
	<view style="background: #FFFFFF;padding-bottom: 160upx;">
		<!-- <nav-head title="商品详情"></nav-head> -->
		<!-- <seckill-nav title="商品详情" backGround="rage(0,0,0,1)" :fontSize="30" backL="transparent" color="#000000"></seckill-nav> -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="productBanner"
			v-if="info.goods_images&&info.goods_images.length>0">
			<swiper-item class="productBannerItem" v-for="(item,index) in info.goods_images">
				<image :src="item.preview_url"></image>
			</swiper-item>
		</swiper>
		<view class="collageMsg">
			<view class="collageMsgB">

				<view class="collageMsgBL">
					<view class="collageMsgT">
						<image src="../../static/home/icon_pt.png" mode=""></image>
					</view>
					<view class="collageMsgBLPrice">
						<text>￥</text>{{info.goods_price?info.goods_price:0}}
					</view>
					<view class="collageMsgBLOldPrice" v-if="info.line_price>0">
						￥{{info.line_price?info.line_price:0}}
					</view>
				</view>
				<view class="collageMsgBR">已售{{info.sale_num?info.sale_num:0}}份</view>
			</view>
		</view>
		<view class="productName">
			<view class="productTiem">{{info.goods_name}}</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="goodsImage">
				<button class="share-btn dis-flex" open-type="share">
					<image src="../../static/icon/icon_share.png" mode=""></image>
					<text class="f-24">分享</text>
				</button>
			</view>
			<!-- #endif -->
			<!-- <view>快递：包邮</view> -->
		</view>
		<view class="collageUser">
			<view class="collageUserCon" v-for="(item,index) in groupList" :key="index" v-if="groupList.length>0">
				<view class="collageUserConL">
					<image :src="item.user.avatar_url"></image>
					<view>{{item.user.nick_name}}</view>
				</view>
				<view class="collageUserConR">
					<view class="collageUserConRL">
						<view class="collageUserConRLT">还差<text>{{item.surplusNum}}人</text>拼成</view>
						<view class="collageUserConRLB">剩余{{item.surplusTime | dateFormat}}</view>
					</view>
					<view class="collageUserConRR" @click="toJoinCollage" :data-index="index">
						<view class="collageUserConRRL">立即查看</view>
						<!-- <image src="../../static/icon/more_white.png"></image> -->
					</view>
				</view>
			</view>
			<!-- <u-empty v-if="groupList.length==0" text="暂无拼团"></u-empty> -->
		</view>
		<!-- <view class="collageUser">
			<view class="collageUserHead">
				<view class="collageUserHeadL">拼团流程</view>
			</view>
			<view class="collageWay">
				<view class="collageWayItem">
					<view>参与拼团</view>
					<view>{{(info.category&&info.category.num)?info.category.num:0}}人成团</view>
				</view>
				<image src="../../static/icon/more_gray.png" class="collageWayImg"></image>
				<view class="collageWayItem">
					<view>拼中发货</view>
					<view>未中退款</view>
				</view>
				<image src="../../static/icon/more_gray.png" class="collageWayImg"></image>
				<view class="collageWayItem">
					<view>拼中得商品</view>
					<view>未拼中得现金红包</view>
				</view>
			</view>
		</view> -->
		<!-- <view class="collageKnow">
			<view class="collageKnowL">拼团须知</view>
			<view class="collageKnowR" @click="checkCollage">
				<text>查看</text>
				<image src="/static/icon/more_gray.png"></image>
			</view>
		</view> -->
		<view class="productDetails">
			<view class="productDetailsHead">
				<text>——</text>
				<text>商品详情</text>
				<text>——</text>
			</view>
			<view class="productDetailsCon" v-html="info.content"></view>
			<view class="productDetailsCon" v-html="info.category.content"></view>
		</view>

		<view class="operaBtn">
			<view class="operaBtnL">
				<view class="operaBtnLItem" @click="toHome">
					<!-- #ifdef MP-QQ -->
					<image style="width: 40rpx;
					height: 40rpx;" src="../../static/home/collageHome.png" mode="heightFix"></image>
					<!-- #endif -->
					<!-- #ifndef MP-QQ -->
					<image src="../../static/home/collageHome.png" mode="heightFix"></image>
					<!-- #endif -->

					<text>首页</text>
				</view>

				<!-- <button open-type="share" class="coustomer">
					<view class="operaBtnLItem">
						<image src="../../static/home/collageShare.png" mode="heightFix"></image>
						<text>分享</text>
					</view>
				</button> -->
				<!-- #ifdef MP -->
				<button open-type="contact" :contact="onEnterContact" class="coustomer">
					<view class="operaBtnLItem" style="margin-right: 0;">
						<!-- #ifdef MP-QQ -->
						<image style="width: 40rpx;
						height: 40rpx;" src="../../static/home/collageCoustomer.png" mode="heightFix"></image>
						<!-- #endif -->
						<!-- #ifndef MP-QQ -->
						<image src="../../static/home/collageCoustomer.png" mode="heightFix"></image>
						<!-- #endif -->

						<text>客服</text>
					</view>
				</button>
				<!-- #endif -->
			</view>
			<view class="operaBtnR" @click="toPayment">我要开团</view>
		</view>
		<view class="collageMoreMark" @click="hideMark" v-if="showFlag"></view>
		<view class="collageMore" v-if="showFlag">
			<view class="collageMoreCon">
				<view class="collageMoreConHead">可参与的拼团</view>
				<scroll-view scroll-y="true" style="max-height: 518upx;">
					<view class="collageMoreItem" v-for="(item,index) in collageMoreList" :key="index">
						<image :src="item.user.avatar_url" class="collageMoreItemL"></image>
						<view class="collageMoreItemC">
							<view class="collageMoreItemCT">{{item.user.nick_name}}</view>
							<view class="collageMoreItemCB">
								还差<text>{{item.surplusNum}}</text>人
							</view>
						</view>
						<view class="collageMoreItemR">
							<view class="collageMoreItemRCon" :data-index="index" @click="toJoinCollageByAll">
								<text>去参团</text>
								<image src="../../static/home/more_pink.png"></image>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="close_icon" @click="hideMark">
				<image src="../../static/home/close_icon.png"></image>
			</view>

		</view>
		<u-popup v-model="showAgree" mode="bottom" @close="close" @open="open">
			<view style="max-height: 700upx;">
				<view v-html="info.category.content" style="padding: 30upx;box-sizing: border-box;">

				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const App = getApp();
	import navHead from "@/components/navHead.vue";
	import seckillNav from "@/components/seckillNav.vue";
	import * as collageApi from "@/api/collage/collage.js";
	export default {
		data() {
			return {
				navInfo: {
					leftDistance: 0,
					lineHeight: 0,
					navH: 0,
					paddingTop: 0
				},
				showAgree: false,
				info: {},
				proId: "",
				timerArr: [],
				groupList: [],
				collageMoreFlag: false,
				collageMoreList: [],
				showFlag: false,
				reqFlag: true
			}
		},
		components: {
			seckillNav,
			navHead
		},
		onLoad(options) {
			// 当前页面参数
			// this.options = options;
			// this.Imgurl=app.globalData.Imgurl;
			// 加载页面数据
			this.proId = options.proid;
			let obj = {};
			obj.leftDistance = App.globalData.leftDistance;
			obj.lineHeight = App.globalData.lineHeight;
			obj.navH = App.globalData.navH;
			obj.paddingTop = App.globalData.paddingTop;
			console.log(obj)
			this.navInfo = obj;
			this.getDetails();
		},
		onShow() {
			if (this.proId) {
				this.getDetails();
			}
		},
		filters: {
			dateFormat: function(value) {
				var date = new Date(value);
				// var sdate = Math.floor(value / 1000 / 60 / 60 / 24);
				var hour = Math.floor(value / 1000 / 60 / 60);
				var minute = Math.floor((value - hour * 1000 * 60 * 60) / 1000 / 60);
				var second = Math.floor((value - hour * 1000 * 60 * 60 - minute * 1000 * 60) / 1000);
				// sdate = sdate < 10 ? "0" + sdate : sdate;
				hour = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				var result = hour + ":" + minute + ":" + second;
				return result;
			}
		},
		onShareAppMessage() {
			return {
				title: this.info.goods_name,
				path: "/pages/groupGoodDetails/groupGoodDetails?proid=" + this.proId,
				imageUrl: App.$vm.globalData.setting.GroupShareImageId.preview_url
			}
		},
		onShareTimeline() {
			return {
				title: this.info.goods_name,
				query: {
					proid: this.proId
				},
				imageUrl: App.$vm.globalData.setting.GroupShareImageId.preview_url
			}
		},
		methods: {
			toHome() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			hideMark() {
				this.reqFlag = true;
				this.showFlag = false;
				this.collageMoreList = [];
				this.collagePage = 1;
			},
			loadMoreCollage() {
				if (!this.reqFlag) {
					return false;
				}
				this.reqFlag = false;
				this.showFlag = true;
				let obj = {};
				obj.category_id = this.info.category.id;
				obj.page = this.collagePage;
				collageApi.taskListAll(obj).then(res => {
					if (this.collagePage == 1) {
						this.collageMoreList = res.data.list.data.map(cur => {
							cur.surplusNum = cur.num - cur.current_num;
							return cur;
						});
					} else {
						this.collageMoreList = this.collageMoreList.concat(res.data.list.data.map(cur => {
							cur.surplusNum = cur.num - cur.current_num;
							return cur;
						}));
					}
					if (this.collagePage < res.data.list.last_page) {
						this.collageMoreFlag = true;
					} else {
						this.collageMoreFlag = false;
					}
					this.reqFlag = true;
				}).catch(err => {
					this.reqFlag = true;
				})
			},
			toJoinCollageByAll(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;

				uni.navigateTo({
					url: "/pages/collageDetail/collageDetail?groupid=" + this.collageMoreList[index].id
				})
			},
			toJoinCollage(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;

				uni.navigateTo({
					url: "/pages/collageDetail/collageDetail?groupid=" + this.groupList[index].id
				})
			},
			toPayment() {
				// App.$vm.globalData.goodsData = this.info;
				let obj = {};
				obj.goods_id = this.info.id;
				obj.group_task_id = 0;
				uni.showModal({
					title: '拼团须知',
					content: '各位会员，拼团产品不支持取消订单及退换货，拼中产品48小时内发货，请在天天赚首页右上角查看完规则或者找推荐人了解清楚规则在下单。',
					success(res) {
						if (res.confirm) {
							collageApi.add(obj).then(res => {
								console.log(res)
								if (res.data && res.data.order_no) {
									// #ifdef MP-WEIXIN
									// wx.requestSubscribeMessage({
									// 	tmplIds: ['rGq6tjBiDTifbJiFVDaJmoip2022JyCrGmnO5m5voA0'],
									// 	success(Messageres) {
									// console.log(Messageres);
									uni.navigateTo({
										url: "/pages/sureOrder/sureOrder?orderid=" +
											res.data.order_no +
											'&type=groupGoodDetails'
									})
									// 	}
									// })
									// #endif
									// #ifndef MP-WEIXIN
									uni.navigateTo({
										url: "/pages/sureOrder/sureOrder?orderid=" +
											res.data
											.order_no
									})
									// #endif
								} else {
									this.$toast("系统繁忙，请稍后再试");
								}

							})
						}
					}
				})


			},
			getDetails() {
				let obj = {};
				obj.goodsId = this.proId;
				collageApi.goodsDetails(obj).then(res => {
					console.log(res)
					res.data.detail.content = res.data.detail.content.replace(/<img /g,
						'<img style="width: 100%;"')
					res.data.detail.category.content = res.data.detail.category.content.replace(/<img/g,
						"<img style='width: 100%;'");
					this.info = res.data.detail;
					this.groupList = res.data.group_task_list.map(cur => {
						cur.surplusTime = cur.expire_time * 1000 - new Date().getTime();
						cur.surplusNum = cur.num - cur.current_num;
						let Timer = setInterval(() => {
							cur.surplusTime = cur.expire_time * 1000 - new Date().getTime();
							if (cur.surplusTime <= 0) {
								clearInterval(Timer);
								let j = null;
								for (let i = 0; i < this.groupList.length; i++) {
									if (this.groupList[i].id == cur.id) {
										j = i;
									}
								}
								if (j !== null) {
									this.groupList.splice(j, 1);
								}
							}
						}, 1000)
						return cur;
					});
				})
			},
			close(e) {
				console.log("close")
			},
			open(e) {
				console.log("open")
			},
			checkCollage() {
				this.showAgree = true;
			},
		}
	}
</script>

<style scoped>
	.collageMoreMark {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		background: rgba(0, 0, 0, .5);
	}

	.collageMore {
		width: 550upx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 100;
	}

	.collageMoreCon {
		width: 550upx;
		box-sizing: border-box;
		background: #fee7e9;
		border-radius: 20upx;
		padding: 50upx 30upx;
	}

	.collageMoreConHead {
		font-size: 34upx;
		line-height: 34upx;
		color: #595757;
		margin-bottom: 40upx;
		text-align: center;
	}

	.collageMoreItem {
		width: 490upx;
		box-sizing: border-box;
		padding: 12upx 16upx;
		background: #FFFFFF;
		box-shadow: 0 2upx 6upx 0 rgba(255, 95, 96, 0.35);
		border-radius: 12upx;
		margin-bottom: 10upx;
		display: flex;
		align-items: center;
	}

	.collageMoreItemL {
		width: 54upx;
		height: 54upx;
		border-radius: 50%;
		margin-right: 20upx;
	}

	.collageMoreItemC {
		width: calc(100% - 236upx);
		height: 54upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-right: 20upx;
	}

	.collageMoreItemCT {
		font-size: 24upx;
		line-height: 24upx;
		color: #595757;
	}

	.collageMoreItemCB {
		font-size: 20upx;
		line-height: 20upx;
		color: #595757;
	}

	.collageMoreItemCB>text {
		color: #FE5960;
		font-size: 20upx;
		line-height: 20upx;
	}

	.collageMoreItemR {
		width: 142upx;
		height: 38upx;
		border-radius: 20upx;
		background: linear-gradient(45deg, #FF5F60 0%, #DE6BAD 100%);
		padding: 2upx;
		box-sizing: border-box;
	}

	.collageMoreItemRCon {
		width: 138upx;
		height: 34upx;
		border-radius: 18upx;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.collageMoreItemRCon>text {
		font-size: 24upx;
		line-height: 34upx;
		color: #FF5F60;
		margin-right: 8upx;
	}

	.collageMoreItemRCon>image {
		width: 10upx;
		height: 20upx;
	}

	.close_icon {
		margin-top: 90upx;
		display: flex;
		justify-content: center;
	}

	.close_icon>image {
		width: 50upx;
		height: 50upx;
	}



	.operaBtn {
		width: 100%;
		/* height: 98upx; */
		background: white;
		position: fixed;
		bottom: var(--window-bottom);
		left: 0;
		/* bottom: 0; */
		z-index: 9999999;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: 8rpx 24upx;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.operaBtnL {
		display: flex;
		align-items: center;
	}

	.operaBtnLItem {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 50upx;
		flex-direction: column;
	}

	.operaBtnLItem>image {
		height: 40upx;
	}

	.operaBtnLItem>text {
		margin-top: 6upx;
		width: 100%;
		text-align: center;
		font-size: 26upx;
		line-height: 26upx;
		color: #999999;
	}

	.operaBtnR {
		width: 472upx;
		height: 80upx;
		text-align: center;
		line-height: 80upx;
		font-size: 26upx;
		background: #F23A3A;
		font-weight: bold;
		color: white;
		border-radius: 40upx;
		margin-left: 40upx;
		margin-bottom: 8rpx;
	}


	.coustomer {
		padding: 0;
		margin: 0;
		line-height: 0;
		background: transparent;
	}


	.productDetails {
		width: 100%;
		padding: 24upx 0;
		background: #FFFFFF;
		box-shadow: 0 2upx 6upx 0 #C9C9C9;
		border-radius: 12upx;
		margin: 30upx auto 0;
	}

	.productDetailsHead {
		font-size: 28upx;
		color: #595656;
		font-weight: bold;
		line-height: 28upx;
		margin-bottom: 16upx;
		padding: 26rpx 30rpx;
		text-align: center;
	}

	.productDetailsHead text:nth-child(1) {
		color: #EFEFEF;
	}

	.productDetailsHead text:nth-child(2) {
		font-size: 30upx;
		color: #333333;
		font-weight: bold;
		margin: 0 20upx;
	}

	.productDetailsHead text:nth-child(3) {
		color: #EFEFEF;
	}

	.collageKnow {
		width: 718upx;
		padding: 24upx 28upx;
		background: #FFFFFF;
		box-shadow: 0 2upx 6upx 0 #C9C9C9;
		border-radius: 12upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 30upx auto 0;
	}

	.collageKnowL {
		font-size: 28upx;
		color: #595656;
		font-weight: bold;
	}

	.collageKnowR {
		display: flex;
		align-items: center;
	}

	.collageKnowR>text {
		font-size: 28upx;
		line-height: 28upx;
		color: #999999;
		margin-right: 10upx;
	}

	.collageKnowR>image {
		width: 12upx;
		height: 20upx;
	}



	.collageWay {
		padding: 20upx 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.collageWayItem {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.collageWayItem>view {
		font-size: 24upx;
		line-height: 24upx;
		color: #575759;
	}

	.collageWayItem>view:nth-child(1) {
		margin-bottom: 10upx;
	}

	.collageWayImg {
		width: 14upx;
		height: 26upx;
	}


	.collageUser {
		width: 718upx;
		margin: 30upx auto 0;
		border-radius: 12upx;
		/* box-shadow: 0 4upx 18upx 2upx #FDC6E2; */
		box-shadow: 0 2upx 6upx 0 #C9C9C9;
		padding: 0 28upx;
		box-sizing: border-box;
		background: linear-gradient(180deg, #FFF2E3 0%, #FFE8D5 100%);
	}

	.collageUserHead {
		padding: 20upx 0 10upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2upx solid rgba(153, 153, 153, .5);
	}

	.collageUserHeadL {
		font-size: 28upx;
		color: #595656;
		font-weight: bold;
	}

	.collageUserHeadR {
		display: flex;
		align-items: center;
	}

	.collageUserHeadR>text {
		font-size: 22upx;
		color: #999999;
		margin-right: 10upx;
	}

	.collageUserHeadR>image {
		width: 10upx;
		height: 18upx;
	}

	.collageUserCon {
		padding: 20upx 0 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.collageUserConL {
		display: flex;
		align-items: center;
	}

	.collageUserConL>image {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		margin-right: 18upx;
	}

	.collageUserConL>view {
		font-size: 28upx;
		font-weight: bold;
		color: #333333;
		max-width: 224upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.collageUserConR {
		display: flex;
		align-items: center;
		width: 54%;
		justify-content: space-between;
	}

	.collageUserConRL {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
	}

	.collageUserConRLT {
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
		margin-bottom: 4upx;
	}

	.collageUserConRLT>text {
		font-size: 24upx;
		line-height: 24upx;
		color: #FE5960;
	}

	.collageUserConRLB {
		font-size: 24upx;
		line-height: 24upx;
		color: #333333;
		margin-top: 14upx;
	}

	.collageUserConRR {
		width: 160upx;
		height: 64upx;
		line-height: 64upx;
		background-color: #947256;
		/* background: linear-gradient(120deg, #FF5F60, #DF6BAC); */
		border-radius: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 18upx;
	}

	.collageUserConRR>view {
		font-size: 26upx;
		color: white;
		line-height: 64upx;
		height: 64upx;
		margin-right: 6upx;
	}

	.collageUserConRR>image {
		width: 8upx;
		height: 16upx;
	}

	.productName {
		width: 100%;
		line-height: 40upx;
		margin: 32upx auto 0;
		box-sizing: border-box;
		padding-left: 24upx;
		border-radius: 12upx;
		/* box-shadow: 0 2upx 6upx 0 #C9C9C9; */
		margin-bottom: 30upx;
		background: white;
		display: flex;
		justify-content: space-between;
		font-size: 32upx;
		font-weight: bold;
		color: #333333;
	}

	.productTiem {
		width: 74%;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2; //行数需设置
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.goodsImage {
		position: relative;
		border-radius: 30upx 0 0 30upx;
		height: 64rpx;
		padding: 12upx 0;
		background-color: #F8F8F8;
	}

	.goodsImage image {
		width: 40upx;
		height: 40upx;
		vertical-align: top;
	}

	.goodsImage text {
		font-size: 26upx;
		color: #333333;
		font-weight: 500;
		line-height: 40upx;
		margin-left: 6upx;
		opacity: 0.7;
	}


	.collageMsg {
		width: 100%;
		padding: 16upx 24upx;
		box-sizing: border-box;
		background-image: url(../../static/home/proDetailBack.png);
		background-size: 100% 100%;
		background-position: 0 0;
	}

	.collageMsgT {
		width: 158upx;
		height: 72upx;

	}

	.collageMsgT image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.collageMsgB {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.collageMsgBL {
		display: flex;
		align-items: center;
	}

	.collageMsgBLPrice {
		display: flex;
		align-items: flex-end;
		font-size: 34upx;
		color: white;
		font-weight: bold;
		margin-left: 16upx;
		line-height: 34upx;
	}

	.collageMsgBLPrice>text {
		font-size: 26upx;
		line-height: 26upx;
		color: #FFFFFF;
	}

	.collageMsgBLOldPrice {
		line-height: 28upx;
		font-size: 28upx;
		font-family: PingFang;
		font-weight: 400;
		text-decoration: line-through;
		color: #FFFFFF;
	}

	.collageMsgBR {
		line-height: 26upx;
		font-size: 28upx;
		font-family: PingFang;
		font-weight: 400;
		color: #FFFFFF;
		height: 64upx;
		line-height: 64upx;
		background-color: rgba(255, 255, 255, 0.2);
		padding: 0 24upx;
		border-radius: 32upx;
	}


	.productBanner {
		width: 100%;
		height: 750upx;
	}

	.productBannerItem {
		width: 100%;
		height: 100%;
	}

	.productBannerItem>image {
		width: 100%;
		height: 100%;
	}
</style>
