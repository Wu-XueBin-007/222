<template>
	<view style="padding-bottom: 98upx;">
		<!-- <nav-head title="拼团详情"></nav-head> -->
		<seckill-nav title="拼团详情" backGround="#FFFFFF" backL="transparent" color="#333333"></seckill-nav>
		<view class="" style="width: 750upx;background-color: #F23A3A;padding: 24upx;">
			<view class="collageUser">
				<view class="userInfo">
					<view :class="['userInfoItem',info.record.length>index?'active':'']"
						v-for="(item,index) in info.num" :key="index"
						:style="{'background-image':info.record.length>index?'url('+info.record[index].user.avatar_url+')':''}">
						<image src="../../static/home/ask.png" class="userInfoItemAsk" v-if="info.record.length<=index">
						</image>
					</view>
				</view>
				<view class="surplusUser" v-if="info.surplusUser!=0">仅剩<text>{{info.surplusUser}}</text>人，快呼唤小伙伴参加吧！
				</view>
				<view class="surplusUser" v-else>拼团已结束</view>
				<view class="" style="display: flex;margin-top: 30upx;justify-content: center;">
					<view class="collageUserTitle">
						<!-- <view class="collageUserTitleL">
							<view></view>
							<view></view>
							<view></view>
						</view> -->
						<view class="collageUserTitleC">结束时间</view>
						<!-- <view class="collageUserTitleR">
							<view></view>
							<view></view>
							<view></view>
						</view> -->
					</view>
					<view class="timeWrap">
						<u-count-down v-if="info.surplusTime||info.surplusTime===0" @end="endTime"
							:timestamp="info.surplusTime" :show-border="false" font-size="28" color="white"
							:bgColor="info.surplusTime===0?'#999999':'#F23A3A'"
							:separatorColor="info.surplusTime===0?'#999999':'#F23A3A'" :showDays="true" height="46">
						</u-count-down>
					</view>
				</view>


				<button open-type="share" class="shareBtn" v-if="info.record.length<info.num">
					<view class="shareBtnCon">邀请好友参团</view>
				</button>
				<!-- <view class="collageNeedKnow" @click="showRuler">拼团须知</view> -->
			</view>
		</view>
		<view class="proWrap" v-if="!isJoin&&(info.record.length<info.num)">
			<view class="proItem" v-for="(item,index) in goodsList" :key="index" :data-index="index"
				@click="selectProduct">
				<view class="proItemT">
					<image :src="item.goods_image"></image>
				</view>
				<view class="proItemC">
					{{item.goods_name}}
				</view>
				<view class="proItemB">
					<image src="../../static/home/select_act.png" v-if="selectIndex==index"></image>
					<image src="../../static/home/select.png" v-else></image>
				</view>
			</view>
		</view>
		<view class="submit" @click="submit" v-if="!isJoin&&(info.record.length<info.num)">{{endFlag?'拼团已过期':'立即参团'}}
		</view>
		<view class="submit" @click="toHome" v-if="info.record.length==info.num">回到幸运拼团</view>
		<u-popup v-model="showAgree" mode="bottom" @close="close" @open="open">
			<view style="max-height: 700upx;">
				<view v-html="info.category.content" style="padding: 30upx;box-sizing: border-box;">

				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import navHead from "@/components/navHead.vue";
	import seckillNav from "@/components/seckillNav.vue";
	import * as collageApi from "@/api/collage/collage.js";
	const App = getApp();
	export default {
		data() {
			return {
				timeData: {},
				selectIndex: 0,
				moreFlag: false,
				groupid: 0,
				info: {},
				page: 1,
				goodsList: [],
				showAgree: false,
				isJoin: false,
				endFlag: false,
				reqFlag: true
			}
		},
		components: {
			seckillNav,
			navHead
		},
		onReachBottom() {
			console.log("bottom")
			if (!this.moreFlag) {
				return false;
			}
			this.moreFlag = false;
			this.page = this.page + 1;
			this.getProductList();
		},
		onShareAppMessage() {
			let app = this;
			console.log("/pages/collageDetail/collageDetail?" + app.$getShareUrlParams({
				groupid: app.groupid
			}));
			return {
				title: "拼团详情",
				path: "/pages/collageDetail/collageDetail?" + app.$getShareUrlParams({
					groupid: app.groupid
				}),
				imageUrl: App.$vm.globalData.setting.GroupShareImageId.preview_url
			}
		},
		onLoad(options) {
			this.groupid = options.groupid;
			this.getDetail();
		},
		onShow() {
			if (this.groupid) {
				this.getDetail();
			}
		},
		onPullDownRefresh() {
			this.getDetail();
		},
		methods: {
			toHome() {
				uni.redirectTo({
					url: "/pages/groupGoodList/groupGoodList"
				})
			},
			endTime() {
				this.endFlag = true;
			},
			submit() {
				if (this.info.num == this.info.record.length) {
					let id = null;
					for (let i = 0; i < this.info.record.length; i++) {
						if (this.info.record[i].user_id == uni.getStorageSync("userId")) {
							id = this.info.record[i].order.order_id;
						}
					}
					if (id) {
						uni.navigateTo({
							url: "/pageHome/collageOrderDetail/collageOrderDetail?orderid=" + id
						})
					}

				} else {
					if (this.endFlag) {
						return false;
					}
					if (!this.reqFlag) {
						return false;
					}
					let obj = {};
					obj.goods_id = this.goodsList[this.selectIndex].id;
					obj.group_task_id = this.groupid;
					this.reqFlag = false;
					collageApi.add(obj).then(res => {
						console.log(res)
						this.reqFlag = true;
						if (res.data && res.data.order_no) {
							uni.redirectTo({
								url: "/pages/sureOrder/sureOrder?orderid=" + res.data.order_no
							})
						} else {
							this.$toast("系统繁忙，请稍后再试");
						}
					}).catch(err => {
						this.reqFlag = true;
					})
				}

			},
			close() {},
			open() {},
			showRuler() {
				this.showAgree = true;
			},
			getDetail() {
				let obj = {};
				obj.group_task_id = this.groupid;
				collageApi.groupInfo(obj).then(res => {
					console.log(res)
					this.isJoin = res.data.is_group_task;
					if (res.data.detail.num <= res.data.detail.record.length) {
						res.data.detail.surplusTime = 0;
					} else {
						res.data.detail.surplusTime = res.data.detail.expire_time - Math.floor(new Date()
							.getTime() / 1000);
					}
					res.data.detail.surplusUser = res.data.detail.num - res.data.detail.current_num;
					res.data.detail.category.content = res.data.detail.category.content.replace(/<img/g,
						"<img style='width: 100%;'");
					this.info = res.data.detail;
					this.getProductList();
				})
			},
			getProductList() {
				let obj = {};
				if (!this.info.category) {
					return false;
				}
				obj.category_id = this.info.category.id;
				obj.page = this.page;
				collageApi.goodsList(obj).then(res => {
					console.log(res)
					uni.stopPullDownRefresh();
					if (this.page == 1) {
						this.goodsList = res.data.list.data;
					} else {
						this.goodsList = this.goodsList.concat(res.data.list.data);
					}
					if (this.page < res.data.list.last_page) {
						this.moreFlag = true;
					} else {
						this.moreFlag = false;
					}
				})
			},
			onChange(e) {
				this.timeData = e;
			},
			selectProduct(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				this.selectIndex = index;
			}
		}
	}
</script>

<style scoped>
	.submit {
		width: 100%;
		height: 98upx;
		line-height: 98upx;
		text-align: center;
		position: fixed;
		left: 0;
		bottom: 0;
		color: white;
		font-size: 34upx;
		font-weight: bold;
		background: #F23A3A;
		z-index: 99;
	}


	.proWrap {
		display: flex;
		flex-wrap: wrap;
		width: 682upx;
		margin: 22upx auto 0;
		background-color: #F8F8F8;
	}

	.proItem {
		width: 330upx;
		margin-right: 22upx;
		margin-bottom: 24upx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
	}

	.proItem:nth-child(2n+2) {
		margin-right: 0;
		background-color: #FFFFFF;
		border-radius: 20rpx;
	}

	.proItemT {
		width: 330upx;
		height: 330upx;
		box-sizing: border-box;
		background: white;
		padding: 10upx;
	}

	.proItemT>image {
		width: 310upx;
		height: 310upx;
		border-radius: 20rpx;
	}

	.proItemC {
		font-size: 28upx;
		line-height: 40upx;
		color: #575759;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-box-clamp: 2;
		overflow: hidden;
		height: 80upx;
		margin-left: 10rpx;
		/* margin-top: 20upx; */
	}

	.proItemB {
		width: 330upx;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		padding: 20upx 0 24upx 0;
	}

	.proItemB>image {
		width: 40upx;
		height: 40upx;
	}



	.collageNeedKnow {
		width: 120upx;
		height: 40upx;
		background: linear-gradient(45deg, #FF5F60 0%, #DE6BAD 100%);
		border-radius: 0 0 0 12upx;
		position: absolute;
		top: 0;
		right: 30upx;
		color: white;
		font-size: 22upx;
		line-height: 40upx;
		text-align: center;
	}

	.shareBtn {
		padding: 0;
		margin: 0;
		line-height: 0;
		background: transparent;
		margin: 40upx auto 0;
	}

	.shareBtnCon {
		width: 472upx;
		height: 80upx;
		border-radius: 40upx;
		text-align: center;
		line-height: 80upx;
		color: #F23A3A;
		border: 2upx solid #F23A3A;

		/* background: linear-gradient(45deg, #FF5F60 0%, #DE6BAD 100%); */
		font-size: 26upx;
		font-weight: bold;
		margin: 0 auto 40upx;
	}


	.userInfo {
		display: flex;
		flex-wrap: wrap;
		width: 74%;
		margin: 0 auto 0;
	}

	.userInfoItem {
		width: 80upx;
		height: 80upx;
		box-sizing: border-box;
		/* border: 2upx dashed #FF5F60; */
		/* background: #FEE2E2; */
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 28upx;
		margin-top: 28upx;
		border-radius: 50%;
	}

	.userInfoItemAsk {
		width: 80upx;
		height: 80upx;
	}

	.userInfoItem:nth-child(1),
	.userInfoItem:nth-child(2),
	.userInfoItem:nth-child(3),
	.userInfoItem:nth-child(4),
	.userInfoItem:nth-child(5) {
		margin-top: 0;
	}

	.userInfoItem:nth-child(5n+5) {
		margin-right: 0;
	}

	.userInfoItem.active {
		border-style: solid;
		/* background-image: url(../../static/background/cardVoucher1.png); */
		background-position: center;
		background-size: cover;
	}


	.surplusUser {
		margin-top: 30upx;
		text-align: center;
		font-size: 28upx;
		line-height: 28upx;
		color: #000000;
	}

	.surplusUser>text {
		font-size: 28upx;
		line-height: 28upx;
		color: #FF5F60;
	}

	.timeWrap {
		/* margin-top: 30upx; */
		display: flex;
		justify-content: center;
	}

	.collageUser {
		width: 702upx;
		background: #FFFFFF;
		/* box-shadow: 0 2upx 10upx 2upx rgba(153, 153, 153, 0.5); */
		border-radius: 20upx;
		margin: 24upx auto 0;
		box-sizing: border-box;
		padding: 40upx 0 0;
		position: relative;
	}

	.collageUserTitle {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.collageUserTitleL,
	.collageUserTitleR {
		display: flex;
		align-items: center;
	}

	.collageUserTitleL>view:nth-child(1),
	.collageUserTitleR>view:nth-child(3) {
		width: 4upx;
		height: 4upx;
		border-radius: 50%;
		background: #999999;
	}

	.collageUserTitleL>view:nth-child(2),
	.collageUserTitleR>view:nth-child(2) {
		width: 8upx;
		height: 8upx;
		border-radius: 50%;
		background: #999999;
	}

	.collageUserTitleL>view:nth-child(3),
	.collageUserTitleR>view:nth-child(1) {
		width: 12upx;
		height: 12upx;
		border-radius: 50%;
		background: #999999;
	}

	.collageUserTitleL>view:nth-child(1),
	.collageUserTitleR>view:nth-child(1),
	.collageUserTitleL>view:nth-child(2),
	.collageUserTitleR>view:nth-child(2) {
		margin-right: 8upx;
	}

	.collageUserTitleC {
		font-size: 28upx;
		line-height: 28upx;
		color: #000000;
		margin: 0 20upx;
		/* font-weight: bold; */
	}
</style>
