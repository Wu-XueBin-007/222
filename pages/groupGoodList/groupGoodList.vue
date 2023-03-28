<template>
	<view class="back">
		<!-- <view class="head">
			立即参团
		</view> -->
		<view class="top">
			<!-- <view class="head">
				<view class="headL">
					<view class="headLBack" @click="back">
						<image src="/static/icon/back_white.png"></image>
					</view>
					<view class="headLTxt">幸运拼团</view>
				</view>
				#ifdef APP
				<button open-type="share" class="headR">
					<image src="/static/icon/share.png" style="width: 100%;height: 100%;"></image>
				</button>
				#endif
			</view> -->

			<nav-head v-if="showStaic" title=" " backGround="rage(0,0,0,0.01)" :fontSize="30" backL="transparent"
				color="white"></nav-head>
			<seckill-nav v-else backGround="rage(0,0,0,1)" :fontSize="30" backL="transparent" color="#000000">
			</seckill-nav>
			<view class="banner">
				<image class="bannerImg"
					src="https://oss.gzrhhj.com/10001/20230224/951200f333b821609d18eb6ea204a7b4.png">
				</image>
				<view class="rightfix">
					<navigator url='/pageHome/IncomeDetail/IncomeDetail' class="income ct">
						收益明细
					</navigator>
					<navigator url='/pageHome/make/make' class="income make ct">
						成员列表
					</navigator>
					<navigator url='/pageHome/ruleDetails/ruleDetails' class="rule ct">
						规则详情
					</navigator>
				</view>
			</view>
			<!-- 			<view class="searchWrap">
				<image src="/static/icon/search_gray.png" class="searchIcon"></image>
				<input type="text" v-model="keyword" placeholder="融汇生活" class="searchInp" />
				<view class="searchBtn" @click="searchVal">搜索</view>
			</view> -->
			<view class="collageUser" v-if="collageList.length>0">
				<!-- <view class="collageUserHead">
						<view class="collageUserHeadL">正在拼团</view>
					</view> -->
				<swiper :indicator-dots="false" :autoplay="true" :interval="2000" :duration="1000" :circular="true"
					:vertical="true" style="height: 120upx;">
					<swiper-item v-for="(item,index) in collageList" :key="index">
						<view class="collageUserCon">
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
					</swiper-item>
				</swiper>

			</view>
			<view class="collageUser" v-else>
				<swiper :indicator-dots="false" :autoplay="true" :interval="2000" :duration="1000" :circular="true"
					:vertical="true" style="height: 120upx;">
					<swiper-item>
						<view class="collageUserCon">
							<view class="collageUserConL">
								<view class="openData" style="border-radius: 50%;">
									<open-data type="userAvatarUrl"></open-data>
								</view>

								<view class="">
									<!-- <open-data type="userNickName"></open-data> -->
									<view class="NotInvolved">当前您未参与拼团</view>
								</view>
							</view>
							<view class="collageUserConR">
								<view class="collageUserConRL">
									<view class="collageUserConRLT"></view>
									<view class="collageUserConRLB"></view>
								</view>
								<navigator class="collageUserConRR" url="/pageHome/myCollage/myCollage"
									:data-index="index">
									<view class="collageUserConRRL">我的抢购</view>
									<!-- <image src="../../static/icon/more_white.png"></image> -->
								</navigator>
							</view>
						</view>
					</swiper-item>
				</swiper>

			</view>

			<view class="collageMoreMark" @click="hideMark" v-if="showFlag"></view>
			<view class="collageMore" v-if="showFlag">
				<view class="collageMoreCon">
					<view class="collageMoreConHead">可参与的拼团</view>
					<scroll-view scroll-y="true" style="max-height: 548upx;">
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
		</view>

		<!-- <u-popup v-model="showAgree" mode="bottom"  @close="close" @open="open">
			<view style="max-height: 700upx;">
				<view v-html="list[collageIndex].content" style="padding: 30upx;box-sizing: border-box;">
					
				</view>
			</view>
			
		</u-popup> -->
		<view class="toTop" v-if="showTo" @click="toTop">
			<image src="../../static/home/icon_top.png"></image>
			<!-- <view>返回顶部</view> -->
		</view>
		<view style="background-color: #F8F8F8;border-radius: 20upx 20upx 0 0;">
			<!-- <view class="collageUser">
					<view class="collageUserHead">
						<view class="collageUserHeadL">拼团流程</view>
					</view>
					<view class="collageWay">
						<view class="collageWayItem">
							<view>参与拼团</view>
							<view>{{list[collageIndex].num}}人成团</view>
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
				</view>
				<view class="collageKnow">
					<view class="collageKnowL">拼团须知</view>
					<view class="collageKnowR" @click="checkCollage">
						<text>查看</text>
						<image src="/static/icon/more_gray.png"></image>
					</view>
				</view> -->
			<view class="productWrap">
				<view class="productWrapHead">
					<view :class="['productWrapHeadItem',index==collageIndex?'active':'']" :data-index="index"
						:key="index" @click="taggleCollage" v-for="(item,index) in list" v-if="index<3">
						<view class="" style="z-index: 1;">
							{{item.name}}
						</view>
						<image src="../../static/icon/icon_bjleft.png" mode="" v-if="index==0&&index==collageIndex">
						</image>
						<image src="../../static/icon/icon_bjcont.png" mode="" v-if="index==1&&index==collageIndex">
						</image>
						<image src="../../static/icon/icon_bjright.png" mode="" v-if="index==2&&index==collageIndex">
						</image>
					</view>

				</view>
				<view class="productWrapCon">
					<view class="productWrapConBox" v-if="productList.length>0">
						<view class="productWrapConItem" v-for="(item,index) in productList" :key="index"
							:data-index="index" @click="toDetail">
							<view class="productWrapConItemT">
								<!-- <view class="productWrapConItemTT">幸运拼团</view> -->
								<view class="productWrapConItemTImg"
									:style="{'background-image': 'url('+item.goods_image+')'}"></view>
							</view>
							<view class="productWrapConItemB">
								<view class="productWrapConItemBT">{{item.goods_name}}</view>
								<view class="spell">
									{{item.sale_num}}人已拼成
								</view>
								<view class="productWrapConItemBB">
									<view class="productWrapConItemBBL">
										<!-- <view class="productWrapConItemBBLTxt">参团价</view> -->
										<view class="productWrapConItemBBLPrice ct">
											<image
												src="https://oss.gzrhhj.com/10001/20230209/895c6338f18ddc72060c11bede37ff2b.png"
												mode=""></image>
											<text>{{item.num}}人拼￥：</text><text
												style="font-size: 40rpx;">{{item.goods_price}}</text>
										</view>
									</view>
									<view class="productWrapConItemBBR ct">
										<view class="productWrapConItemBBRL">
											<text>马上抢</text>
											<!-- <image src="../../static/icon/icon_right.png"></image> -->
										</view>
										<!-- <view class="productWrapConItemBBRR">
											{{item.num}}人成团
										</view> -->
									</view>
								</view>
							</view>
						</view>
					</view>

					<u-empty v-if="productList.length==0"></u-empty>

				</view>
			</view>

		</view>
		<view v-if="showTurntable" style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;margin: auto;display: flex;
    align-items: center;
    justify-content: center;background: rgba(0, 0, 0, 0.4);z-index: 100;">
			<q-turntable :areaNumber='6' :speed='16' ref="turntable" @start="turntableStart"
				@success="turntableSuccess">
			</q-turntable>
		</view>
		<view v-if="showLottery" class="module">
			<view class="title">
				提示
			</view>
			<text class="txt">
				恭喜达成！
			</text>
			<view class="btnGRop">
				<button @click="closeBtn(1)" class="btn onebtn">参与抽奖</button>
				<button @click="closeBtn(2)" class="btn twobtn">参与活动分红</button>
			</view>
		</view>
	</view>
</template>

<script>
	import * as goodsApi from "@/api/collage/collage.js";
	import store from '@/store'
	import navHead from "@/components/navHead.vue";
	import seckillNav from "@/components/seckillNav.vue";
	const App = getApp();
	let time = null
	export default {
		data() {
			return {
				list: [],
				keyword: "",
				collageIndex: 0,
				productList: [],
				page: 1,
				showAgree: false,
				collageList: [],
				collagePage: 1,
				moreFlag: false,
				collageMoreFlag: false,
				collageMoreList: [],
				showFlag: false,
				reqFlag: true,
				Timer: null,
				showTo: false,
				showStaic: true,
				windowHeight: [],
				award: 1,
				tapIndex: 0,
				showLottery: false,
				navInfo: {
					leftDistance: 0,
					lineHeight: 0,
					navH: 0,
					paddingTop: 0
				},
				showTurntable: false,
				awardList: [{
						title: '特等奖'
					},
					{
						title: '一等奖'
					},
					{
						title: '二等奖'
					},
					{
						title: '三等奖'
					},
					{
						title: '四等奖'
					},
					{
						title: '啥也没有'
					}
				]
			}
		},
		components: {
			navHead,
			seckillNav
		},
		onLoad() {
			let obj = {};
			obj.leftDistance = App.globalData.leftDistance;
			obj.lineHeight = App.globalData.lineHeight;
			obj.navH = App.globalData.navH;
			obj.paddingTop = App.globalData.paddingTop;
			this.navInfo = obj;
		},

		onPageScroll(e) {
			// 获取页面高度
			uni.getSystemInfo({
				success: res => {
					this.windowHeight = res.windowHeight
				}
			})

			if (e.scrollTop >= this.windowHeight) {
				this.showTo = true;
			} else {
				this.showTo = false;
			}
			if (e.scrollTop <= this.navInfo.navH) {
				this.showStaic = true;
			} else {
				this.showStaic = false;
			}
		},
		onShow() {
			this.getList();
			this.isReach()
		},
		onPullDownRefresh() {
			this.page = 1;
			this.getProductList();
		},
		onShareAppMessage() {
			return {
				title: "幸运拼团",
				path: "/pages/groupGoodList/groupGoodList"
			}
		},
		onShareTimeline() {
			return {
				title: "幸运拼团"
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
		onReachBottom() {
			if (!this.moreFlag) {
				return false;
			}
			this.moreFlag = false;
			this.page = this.page + 1;
			this.getProductList();
		},
		beforeDestroy() {
			clearInterval(this.Timer);
		},
		methods: {
			hideMark() {
				this.reqFlag = true;
				this.showFlag = false;
				this.collageMoreList = [];
				this.collagePage = 1;
			},
			closeBtn(index) {

				if (index == 1) {
					this.showLottery = false;
					this.showTurntable = true
				} else {
					this.showLottery = false;
					goodsApi.pickPartakeType({
						type: index
					}, {
						load: false
					}).then(res1 => {

						console.log(res1);
					})
					this.getList()
				}
			},
			isReach() {
				let _this = this
				goodsApi.isReach().then(res => {
					console.log(res)
					if (res.data.isReach > 0) {
						this.showLottery = true
						// 	uni.showActionSheet({
						// 		itemList: ['第一个', '第二个'],
						// 		success: function(res) {
						// 			if (res.tapIndex == 0) {
						// 				_this.showTurntable = true;

						// 			} else {
						// 				_this.getList();
						// 			}
						// 			_this.tapIndex = res.tapIndex
						// 			console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						// 		},
						// 		fail: function(res) {
						// 			console.log(res.errMsg);
						// 		}
						// 	});
						// 	clearInterval(time)
					}
				})
			},
			turntableStart() {
				let index = Math.floor(Math.random() * 6 + 1) //前端随机数，这里应该后台返回中奖结果
				this.award = index
				this.$refs.turntable.begin(this.award);
			},


			// 抽奖完成后操作
			turntableSuccess() {
				const index = this.award - 1;
				let _this = this
				console.log('bind:success', this.awardList[index]);
				uni.showToast({
					title: `恭喜你获得${this.awardList[index].title}`,
					icon: 'none',
					success() {
						goodsApi.pickPartakeType({
							type: _this.tapIndex + 1
						}, {
							load: false
						}).then(res1 => {
							setTimeout(function() {
								_this.showTurntable = false
							}, 1500)
							console.log(res1);
						})
					}
				});
			},
			loadMoreCollage() {
				if (!this.reqFlag) {
					return false;
				}
				this.reqFlag = false;
				this.showFlag = true;
				let obj = {};
				obj.category_id = this.list[this.collageIndex].id;
				obj.page = this.collagePage;
				goodsApi.taskListAll(obj).then(res => {
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
			toJoinCollage(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				if (this.collageList.length > 0) {
					uni.navigateTo({
						url: "/pages/collageDetail/collageDetail?groupid=" + this.collageList[index].id
					})
				} else {
					// uni.navigateTo({
					// 	url: "/pages/collageDetail/collageDetail"
					// })
				}

			},
			toJoinCollageByAll(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;

				uni.navigateTo({
					url: "/pages/collageDetail/collageDetail?groupid=" + this.collageMoreList[index].id
				})
			},
			getCollageList() {
				let obj = {};
				obj.category_id = this.list[this.collageIndex].id;
				goodsApi.taskList(obj).then(res => {
					console.log(res)
					this.collageList = res.data.list.map(cur => {
						cur.surplusTime = cur.expire_time * 1000 - new Date().getTime();
						cur.surplusNum = cur.num - cur.current_num;
						this.Timer = setInterval(() => {
							cur.surplusTime = cur.expire_time * 1000 - new Date().getTime();
							if (cur.surplusTime <= 0) {
								clearInterval(this.Timer);
								return;
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
			toDetail(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				uni.navigateTo({
					url: "/pages/groupGoodDetails/groupGoodDetails?proid=" + this.productList[index].id
				})
			},
			searchVal() {
				this.page = 1;
				this.getList();
			},
			close(e) {
				console.log("close")
			},
			open(e) {
				console.log("open")
			},
			toTop() {
				uni.pageScrollTo({
					scrollTop: 0
				})
			},
			checkCollage() {
				this.showAgree = true;
			},
			taggleCollage(e) {
				let index = e.target.dataset.index || e.currentTarget.dataset.index;
				this.collageIndex = index;
				this.page = 1;
				this.getProductList();
				this.getCollageList();
			},
			back() {
				let page = getCurrentPages();
				console.log(page);
				if (page.length == 1) {
					uni.switchTab({
						url: "/pages/index/index"
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			},
			getList() {
				goodsApi.list().then(res => {
					console.log(res)
					this.list = res.data.list.map(cur => {
						cur.content = cur.content.replace(/<img/g, "<img style='width: 100%;'");
						return cur;
					});
					this.getProductList();
					this.getCollageList();
				})
			},
			getProductList() {
				let obj = {};
				obj.page = this.page;
				if (this.keyword.trim()) {
					obj.keyword = this.keyword;
				}
				obj.category_id = this.list[this.collageIndex].id;
				goodsApi.goodsList(obj).then(res => {
						console.log(res)
						uni.stopPullDownRefresh();
						if (this.page == 1) {
							this.productList = res.data.list.data.map(cur => {
								cur.goods_price = Number(cur.goods_price);
								cur.num = this.list[this.collageIndex].num
								return cur;
							});
						} else {
							this.productList = this.productList.concat(res.data.list.data.map(cur => {
								cur.goods_price = Number(cur.goods_price);
								cur.num = this.list[this.collageIndex].num
								return cur;
							}));
						}
						if (this.page < res.data.list.last_page) {
							this.moreFlag = true;
						} else {
							this.moreFlag = false;
						}
					})
					.catch(err => {
						uni.stopPullDownRefresh();
					})
			}
		}
	}
</script>

<style scoped lang="scss">
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
		width: 680upx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 100;
	}

	.collageMoreCon {
		width: 680upx;
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
		width: 620upx;
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
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
		margin-right: 20upx;
	}

	.collageMoreItemC {
		width: calc(100% - 244upx);
		height: 60upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-right: 20upx;
	}

	.collageMoreItemCT {
		font-size: 28upx;
		line-height: 28upx;
		color: #595757;
	}

	.collageMoreItemCB {
		font-size: 24upx;
		line-height: 24upx;
		color: #595757;
	}

	.collageMoreItemCB>text {
		color: #FE5960;
		font-size: 24upx;
		line-height: 24upx;
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
		width: 60upx;
		height: 60upx;
	}




	.toTop {
		width: 108rpx;
		height: 108rpx;
		position: fixed;
		right: 34rpx;
		bottom: 120rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	.toTop>image {
		width: 108upx;
		height: 108upx;
	}

	.toTop>view {
		font-size: 32upx;
		line-height: 32upx;
		text-align: center;
		color: #595757;
	}


	.productWrapConItemB {
		padding: 16upx 4upx 0 10upx;
		box-sizing: border-box;
		margin-left: 24upx;
	}

	.productWrapConItemB .spell {
		color: #999999;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 24rpx;
	}

	.productWrapConItemBT {
		font-size: 28upx;
		font-weight: bold;
		line-height: 40upx;
		color: #333333;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-box-clamp: 2;
		overflow: hidden;
		height: 80upx;
	}

	.productWrapConItemBB {
		width: 420rpx;
		height: 68rpx;

		background: linear-gradient(97.79deg, #F4C774 61.06%, #FBE7C2 100%);
		border-radius: 20px;
		border-radius: 50upx;
		margin-top: 32upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.productWrapConItemBBL {
		/* display: flex; */
		/* align-items: flex-end; */
		// margin-left: 20upx;
		// margin-right: 24rpx;
	}

	.productWrapConItemBBLTxt {
		font-size: 24upx;
		line-height: 24upx;
		color: #FFFFFF;
		margin-right: 20upx;
	}

	.productWrapConItemBBLPrice {
		display: flex;
		// align-items: flex-end;
		font-size: 40rpx;
		line-height: 28upx;
		color: #FFFFFF;
		font-weight: bold;
		position: relative;
		width: 286rpx;
		height: 68rpx;
		z-index: 2;
		// background: #F23A3A;
	}

	.productWrapConItemBBLPrice>text {
		font-weight: bold;
		color: #FFFFFF;
		font-size: 24upx;
		line-height: 24upx;
		z-index: 2;
	}

	.productWrapConItemBBLPrice>image {
		width: 286rpx;
		height: 68rpx;
		position: absolute;
		top: 0;
		left: 0;
	}

	.productWrapConItemBBR {
		width: 164upx;
		height: 75upx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 700;
		font-size: 32rpx;
		color: #947256;
	}

	.productWrapConItemBBRL {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 30upx;
		margin-top: 4upx;
	}

	.productWrapConItemBBRL>text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 700;
		font-size: 32rpx;
		color: #947256;
	}

	.productWrapConItemBBRL>image {
		width: 14upx;
		height: 14upx;
		margin-left: 2upx;
		vertical-align: top;
	}

	.productWrapConItemBBRR {
		height: 30upx;
		text-align: center;
		font-size: 24upx;
		margin-top: 4upx;
	}

	.productWrapConBox {
		/* display: flex; */
		/* flex-wrap: wrap; */
	}

	.productWrapConItem {
		width: 702upx;
		margin: 0 auto 24upx;
		display: flex;
		// background-color: #FFFFFF;
		border-radius: 20upx;
		// padding: 24upx;
	}

	/* .productWrapConItem:nth-child(1),
	.productWrapConItem:nth-child(2){
		margin-top: 0;
	}
	.productWrapConItem:nth-child(2n+2){
		margin-right: 0;
	} */
	.productWrapConItemT {
		width: 240rpx;
		height: 240rpx;
		box-sizing: border-box;
		/* background-image: url(../../static/home/collageProductBack.png); */
		/* background-position: 0 0;
		background-size: 100% 100%; */
		padding: 0 4upx 4upx;
		border-radius: 20upx;
	}

	.productWrapConItemTT {
		width: 100%;
		box-sizing: border-box;
		height: 36upx;
		line-height: 36upx;
		padding-left: 20upx;
		color: white;
		font-size: 20upx;
	}

	.productWrapConItemTImg {
		width: 240rpx;
		height: 240rpx;
		border-radius: 40rpx;
		background-position: center;
		background-size: cover;
	}



	.productWrap {
		width: 100%;
		// margin: 24upx auto 0;
	}

	.productWrapHead {
		width: 100%;
		height: 92upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(180deg, #E2E2E2 0%, #F8F8F8 100%);
		// box-shadow: inset 0px 1px 0px 1px #FFFFFF;
		// border-radius: 20upx 20upx 0 0;
	}

	.productWrapHeadItem {
		width: 254upx;
		height: 92upx;
		border-radius: 20upx 20upx 0 0;
		/* background: #fef0f3; */
		padding-bottom: 10upx;
		box-sizing: border-box;
		/* text-align: center; */
		/* line-height: 68upx; */
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #999999;
		font-weight: bold;
		position: relative;
	}

	.productWrapHeadItem.active {
		color: #333333;
		font-weight: 900;
		font-size: 32rpx;
		/* background: white; */
	}

	.productWrapHeadItem image {
		position: absolute;
		top: 0;
		left: 0;
		width: 254upx;
		height: 92upx;
		/* z-index: -1; */
	}

	.productWrapCon {
		width: 100%;
		/* height: 500upx; */
		background: white;
		transform: translateY(-10upx);
		// border-radius: 20upx;
		padding: 18upx;
		box-sizing: border-box;
		padding-bottom: 10rpx;
	}



	.collageKnow {
		width: 702upx;
		padding: 20upx 16upx;
		background: #FFFFFF;
		box-shadow: 0 4upx 18upx 2upx #FCD0E6;
		border-radius: 12upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 40upx auto 0;
	}

	.collageKnowL {
		font-size: 30upx;
		color: #FF5F60;
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
		width: 702upx;
		margin: 24upx auto 0;
		height: 120upx;
		border-radius: 12upx;
		/* box-shadow: 0 4upx 18upx 2upx #FDC6E2; */
		padding: 0 16upx;
		box-sizing: border-box;
		background: linear-gradient(180deg, #FFF2E3 0%, #FFE8D5 100%);
		margin-top: 0;
	}

	.collageUserHead {
		padding: 20upx 0 10upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2upx solid rgba(153, 153, 153, .5);
	}

	.collageUserHeadL {
		font-size: 30upx;
		color: #FF5F60;
		font-weight: 400;
	}

	.collageUserHeadR {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 54%;
	}

	.collageUserHeadR>text {
		font-size: 28upx;
		color: #999999;
		margin-right: 10upx;
	}

	.collageUserHeadR>image {
		width: 12upx;
		height: 20upx;
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

	.collageUserConL .NotInvolved {
		font-size: 12px;
		color: #633A19;
	}

	.collageUserConL>image {
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		margin-right: 18upx;
	}

	.collageUserConL>.openData {
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



	.searchWrap {
		width: 702upx;
		height: 70upx;
		padding: 6upx 6upx 6upx 26upx;
		display: flex;
		align-items: center;
		background: white;
		border-radius: 36upx;
		margin: 48upx auto 0;
	}

	.searchIcon {
		width: 30upx;
		height: 30upx;
		margin-right: 12upx;
	}

	.searchBtn {
		width: 116upx;
		height: 56upx;
		line-height: 56upx;
		text-align: center;
		font-size: 26upx;
		font-weight: bold;
		color: #FFFFFF;
		border-radius: 70upx;
		background-color: #EF343D;
		/* background: linear-gradient(to right , rgba(255,95,96,.2) , rgba(222,107,173,.2)); */
		margin-left: 12upx;
	}

	.searchInp {
		width: calc(100% - 152upx);
		height: 100%;
		font-size: 24upx;
		color: #A7A7A7;
		border: none;
	}


	.back {
		width: 100%;
		min-height: 100vh;
		// background: linear-gradient(180deg, #EF343D 0%, rgba(239, 164, 52, 0.38) 100%);
	}

	.top {
		width: 100%;
		background: linear-gradient(180deg, #EF343D 0%, rgba(239, 164, 52, 0.38) 100%);
		padding-bottom: 30rpx;
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 32upx;
	}

	.headL {
		display: flex;
		align-items: center;
	}

	.headLBack {
		width: 70upx;
		height: 36upx;
		display: flex;
		box-sizing: border-box;
		padding-left: 34upx;
		background: linear-gradient(43deg, #FF5F60 0%, #DF6BAC 100%);
		border-radius: 0 18upx 18upx 0;
		margin-right: 14upx;
		align-items: center;
	}

	.headLBack>image {
		width: 16upx;
		height: 28upx;
	}

	.headLTxt {
		font-size: 40upx;
		font-family: PingFang;
		font-weight: bold;
		color: #FF5F60;
		background: linear-gradient(0deg, #FF5F60 0%, #DF6BAC 98.6328125%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.headR {
		width: 34upx;
		height: 38upx;
		background: transparent;
		padding: 0;
		margin: 0;
		line-height: 0;
	}

	.banner {
		width: 702rpx;
		// padding: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 30rpx;
		position: relative;
		margin: 0 auto;
		margin-top: 20rpx;

		.rightfix {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			display: flex;
			flex-direction: column;
			justify-content: center;
			color: #FFFFFF;
			font-family: 'PingFang SC';
			font-style: normal;
			font-style: normal;
			font-weight: 700;
			font-size: 28rpx;

			.income {
				width: 150rpx;
				height: 50rpx;
				background: rgba(240, 126, 29, 0.6);
				backdrop-filter: blur(10rpx);
				/* Note: backdrop-filter has minimal browser support */
				border-radius: 30rpx 0px 0px 30rpx;
				margin-bottom: 16rpx;

			}

			.make {
				background: #947256
			}

			.rule {
				width: 150rpx;
				height: 50rpx;
				background: rgba(242, 58, 58, 0.6);
				backdrop-filter: blur(10rpx);
				/* Note: backdrop-filter has minimal browser support */
				border-radius: 30rpx 0px 0px 30rpx;
			}
		}

		.bannerImg {
			width: 702rpx;
			height: 292rpx;
		}
	}

	.module {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #ffffff;
		border-radius: 20rpx;
		// padding: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 100;
		width: 608rpx;
		box-sizing: border-box;

		.txt {
			box-sizing: 58rpx;
			font-weight: 600
		}

		.title {
			font-size: 40rpx;
			// background: #303133;
			padding: 35rpx 0;
			// color: #b0ee04;
			width: 100%;
			text-align: center;
			border-radius: 20rpx;
			margin-bottom: 32rpx;
		}

		.btnGRop {
			display: flex;
			// flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-top: 50rpx;
			margin-bottom: 70rpx;

			.btn {
				width: 224rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 20rpx;
				padding: 0;
				border: 0;
				padding: 0;
				font-size: 24rpx;
				border-radius: 40rpx;


			}

			.onebtn {
				background: royalblue;
				color: white;
			}

			.twobtn {
				border: 2rpx solid royalblue;
				background: transparent;
				color: #000000;
			}
		}
	}
</style>
