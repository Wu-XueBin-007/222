<template>
	<view class="container" :style="{'box-sizing': 'border-box'}">
		<view class="header" :style="{'height': navInfo.navH+'px','padding-top':navInfo.paddingTop+'px'}">
			<!-- #ifdef MP-WEIXIN -->
			<view class="heads2">
				<view class="heads2-left">
					<text>融汇链生活</text>
				</view>
				<view class="heads2-right" @click="btn_invitation">
					<view class="heads2-right-imgwrap">
						<image src="../../static/home/icon_code.png" mode=""></image>
					</view>
					邀请码
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef !MP-WEIXIN -->
			<view class="heads2" style="width: 100%;">
				<view class="heads2-left">
					<text>融汇链生活</text>
				</view>
				<view class="heads2-right" @click="btn_invitation">
					<view class="heads2-right-imgwrap">
						<image src="../../static/home/icon_code.png" mode=""></image>
					</view>
					邀请码
				</view>
			</view>
			<!-- #endif -->
		</view>
		<view class="subject" :style="{'padding-top': navInfo.navH-10+'px'}">
			<view class="home-header">
				<view class="home-header-inp">
					<view @click="handleSearch">
						融汇链生活
					</view>
					<image src="../../static/sreach.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="newMain">
			<!-- 轮播图 -->
			<view class="home-lunb">
				<swiper class="swiper" indicator-dots="false" indicator-active-color="#ff5060" indicator-color="#FFFFFF"
					autoplay="true" interval="3000" duration="500">
					<swiper-item v-for="(item,index) in imgList" :key="index">
						<image :src="item.image" :data-url="item.url" @click="btn_tourl"></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 轮播图 end-->
			<!-- 金刚区 -->
			<view class="home-point">
				<template v-for="item in Kingkong">
					<view class="point-item" v-if="item.status" @click="btn_give(item)">
						<view class="point-img">
							<image :src="item.image_url"></image>
						</view>
						<view class="point-text">{{item.title}}</view>
					</view>
				</template>
			</view>
			<!-- 金刚区 end-->
			<!-- 通证信息 -->
			<view v-if="passMessage.token_price&&passMessage.token_increase&&passMessage.name" class="pass">
				<view class="passL">
					<view class="passMessageL">
						<image src="../../static/home/pass.png"></image>
					</view>
					<view class="passMessageR">
						<!-- {{passMessage.name}} -->
						BLCXF
					</view>

					<!-- <view class="passData" v-if="showPass">
						￥{{passMessage.token_price}}
					</view> -->
				</view>
				<view class="ct" v-if="passMessage.token_increase">
					<view class="passData" v-if="passMessage.token_price">
						￥{{passMessage.token_price}}
					</view>
					<view v-else style="margin-left: 20rpx; margin-top: 16rpx;font-size: 24rpx;">￥--</view>
					<view class="passR">
						+{{passMessage.token_increase}}
					</view>

				</view>
			</view>
			<!-- 通证信息 end -->
		</view>

		<!-- 秒杀 -->
		<view @click="btn_seckill" class="home-seckill"
			v-if="seckillGoodsBanner.length>0&&!(JSON.stringify(seckilltime) === '{}')&&showseckilltime">
			<view class="seckill-header">
				<view class="seckill-headerL" style="display: flex;align-items: center;">
					<image src="../../static/img_xsms.png" mode=""></image>
				</view>
				<view class="seckillMore">
					<view class="title">距离结束剩余</view>
					<view class="time_wrap">
						<view class="hour">
							{{hour}}
						</view>
						<view class="colon">
							:
						</view>
						<view class="hour minute">
							{{minute}}
						</view>
						<view class="colon">
							:
						</view>
						<view class="hour seconds">
							{{second}}
						</view>
					</view>
				</view>
			</view>
			<view class="seckillConWrap">
				<scroll-view scroll-x="true"
					style="display: flex;white-space: nowrap;width: 100%;box-sizing: border-box;overflow: scroll;">
					<view class="seckillCon">
						<view class="seckillItem" v-for="(pitem,pindex) in seckillGoodsBanner" :key="pindex"
							v-if="pitem.seckill_price!=null">
							<view class="seckillItemT"
								:style="{'background-image': 'url('+pitem.images[0].file.preview_url+')'}"></view>
							<view class="seckillItemB">
								<view class="seckillItemBT">
									<text style="font-size: 20rpx;">￥</text>
									<text>{{pitem.seckill_price.split('.')[0]}}</text>
									<text style="font-size: 20rpx;">.{{pitem.seckill_price.split('.')[1]}}</text>
								</view>
								<view class="seckillItemBB">￥{{pitem.goods_price_min}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 秒杀 end-->

		<!-- 首页推荐 -->
		<view class="home-recommend">
			<zero-waterfall ref="waterfall" :list="JgoodsList" v-if="JgoodsList.length>0">
				<!--  #ifdef  MP -->
				<view v-for="(item, index) of JgoodsList" :key="index" slot="slot{{item.goods_id}}">
					<view class="cnt">
						<view class="text">{{ item.extra }}</view>
					</view>
				</view>
				<!--  #endif -->

				<!-- #ifndef  MP -->
				<template v-slot:default="item">
					<view class="cnt">
						<view class="text">{{ item.extra }}</view>
					</view>
				</template>
				<!-- #endif -->
			</zero-waterfall>
			<uni-load-more v-if="!isLoading" bg-color="rgb(240, 240, 240)" :status="loadStatus"
				@clickLoadMore='getJgoodslist'>
			</uni-load-more>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<button open-type="contact" style="opacity: 1;">
			<view class="home-kf">
				<image src="../../static/home/icon_kf.png" mode=""></image>
			</view>
		</button>
		<!-- #endif -->
		<view class="home-returnTop" v-if="back" @click="btn_top">
			<image src="../../static/home/icon_zd.png" mode=""></image>
		</view>

	</view>
</template>

<script>
	import {
		setCartTabBadge
	} from '@/utils/app'
	import * as Rapi from '@/api/home/rotation'
	import * as goodsApi from '@/api/goods'
	import * as articleApi from "@/api/article/index.js"
	import * as seckillApi from '@/api/seckill/seckill.js'
	import {
		detail,
		blockChina
	} from "@/api/common.js"
	import store from '@/store'
	const App = getApp()
	export default {

		data() {
			return {
				secIndex: 0,
				imgList: {},
				Imgurl: '',
				// 页面参数
				options: {},
				// 页面属性
				page: {},
				navInfo: {
					leftDistance: 0,
					lineHeight: 0,
					navH: 0,
					paddingTop: 0
				},
				// 系统设置
				setting: {},
				//特价商品
				TgoodsList: {},
				//热门商品
				RgoodsList: {},
				//精选商品
				JgoodsList: {},
				articleList: [],
				classList: [],
				commonL: {},
				seckillGoodsBanner: [],
				loading: false,
				loadStatus: 'more',
				page: 0,
				limit: 15,
				bottomFlag: true,
				back: false,
				windowHeight: [],
				requestSwitch: false,
				Kingkong: [], //金刚区
				seckilltime: {},
				showseckilltime: false, //是否显示秒杀
				hour: 0,
				minute: 0,
				second: 0,
				isLoading: false,
				passMessage: {}
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			let obj = {};
			obj.leftDistance = App.globalData.leftDistance;
			obj.lineHeight = App.globalData.lineHeight;
			obj.navH = App.globalData.navH;
			obj.paddingTop = App.globalData.paddingTop;
			this.navInfo = obj;
			this.getRandomList();
			this.getseckilltime()
			this.getPageData();
			this.getPass();
		},

		watch: {
			classList: function(val) {
				let time = null;
				if (uni.getSystemInfoSync().platform == "ios") {
					time = setInterval(() => {
						console.log(111);
						if (val.length == 0) {
							this.onLoad();
							this.onShow()
						} else {
							clearInterval(time)
						}
					}, 500)
				}
			}
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// 更新购物车角标
			setCartTabBadge()
			// this.getbigVip()
		},
		onPullDownRefresh() {
			// 下拉
			this.getPageData(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if (!this.bottomFlag) {
				return false;
			}
			this.getJgoodslist();
		},
		onPageScroll(e) {
			// 获取页面高度
			uni.getSystemInfo({
				success: res => {
					this.windowHeight = res.windowHeight
				}
			})
			if (e.scrollTop >= this.windowHeight) {
				this.back = true;
			} else {
				this.back = false;
			}
		},
		methods: {
			btn_seckill() {
				uni.navigateTo({
					url: "/pageSecKill/seckillList/seckillList"
				})
			},
			getPass() {
				blockChina().then(res => {

						this.passMessage = res.data.data
						this.showPass = true
					})
					.catch(err => {
						if (err.status == 500) {

						}
						this.showPass = true
					})
					.finally(res => {
						this.showPass = true
					})
			},
			getseckilltime() {
				seckillApi.seckilltime().then(res => {
					this.seckilltime = res.data.list && res.data.list[0];
					// this.seckilltime.end_hour = '11:42'
					if (this.seckilltime && this.seckilltime.start_hour) {
						let time = setInterval(() => {
							let now = new Date();
							var nowTime = +new Date();
							let getyears = now.getFullYear();
							let getmonth = now.getMonth();
							let getday = now.getDate()
							let startHour = this.seckilltime.start_hour.split(':')
							let startHourTimeStamp = +new Date(getyears, getmonth, getday, +startHour[0],
								+startHour[1]);
							let showseckilltime = startHourTimeStamp < nowTime;
							this.showseckilltime = showseckilltime;
							if (!showseckilltime) {
								clearInterval(time);
							}
							let endHour = this.seckilltime.end_hour.split(':')
							let endHourTimeStamp = +new Date(getyears, getmonth, getday, +endHour[0], +
								endHour[1]);
							//把剩余时间毫秒数转化为秒
							var times = (endHourTimeStamp - nowTime) / 1000;
							//计算小时数 转化为整数
							var h = parseInt(times / 60 / 60 % 24);
							this.hour = h < 10 ? "0" + h : h
							var m = parseInt(times / 60 % 60);
							this.minute = m < 10 ? "0" + m : m
							var s = parseInt(times % 60);
							this.second = s < 10 ? "0" + s : s;
							if (h <= 0 && m <= 0 && s <= 0) {
								console.log(h, m, s)
								clearInterval(time);
								this.showseckilltime = false
								return;
							}
						}, 1000)
					}
				})
			},
			getRandomList() {
				seckillApi.randomList().then(res => {
					let arr = res.data.list;
					this.seckillGoodsBanner = arr;
				})
			},
			/**
			 *  滚动到顶部
			 * */
			btn_top() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 500
				});
			},
			//轮播图
			btn_tourl(e) {
				let url = e.currentTarget.dataset.url || e.target.dataset.url;
				var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
				if (!reg.test(url)) {
					uni.navigateTo({
						url: url
					})
					// console.log('这网址不是以http://https://开头，或者不是网址')
				} else {
					if (this.$store.getters.token) {
						let url = this.commonL.blc_url;
						// let url='https://walletc.rhchainos.com/#/?id='+this.$store.getters.userId;
						if (this.commonL.pass_cert_switch == 1) {
							uni.navigateTo({
								url: '/pages/showhfive/showhfive?url=' + url
							})
						}
					} else {
						uni.showModal({
							title: '温馨提示',
							content: '此时此刻需要您登录喔~',
							confirmText: "去登录",
							cancelText: "再逛会",
							success: res => {
								if (res.confirm) {
									uni.navigateTo({
										url: "/pages/login/index"
									})
								}
							}
						})
					}
				}

			},
			// 邀请码
			btn_invitation() {
				if (this.$store.getters.token) {
					detail()
						.then(res => {
							this.$navTo('pageHome/code/index')
						})
				} else {
					uni.showModal({
						title: '温馨提示',
						content: '此时此刻需要您登录喔~',
						confirmText: "去登录",
						cancelText: "再逛会",
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: "/pages/login/index"
								})
							}
						}
					})
				}
			},

			// 金刚区
			btn_give(item) {
				if (item.url != '//') {
					uni.navigateTo({
						url: item.url
					})
				} else {
					uni.showToast({
						title: '此功能暂未开放，敬请期待',
						icon: "none",
						duration: 2000
					});
				}
			},
			// 获取页面数据
			getPageData(callback) {
				const app = this
				app.isLoading = true
				app.page = 1;
				app.JgoodsList = [];
				Promise.all([app.getKingkong(), app.getrotation(), app.getTgoodslist(),
						app.getJgoodslist(true)
					])
					.then(result => {
						app.isLoading = false;
						// 执行回调函数
						callback && callback()
					})
					.catch(err => {
						//console.log('catch', err)
					})
			},
			// 获取轮播图
			getrotation() {
				const app = this
				return new Promise((resolve, reject) => {
					Rapi.list().then(res => {
						app.imgList = res.data.list.data;
						resolve(res)
					}).catch(reject)
				})
			},
			// 获取商品列表
			getTgoodslist() {
				const app = this
				return new Promise((resolve, reject) => {
					goodsApi.list({
						if_special_offer: 1
					}).then(res => {
						app.TgoodsList = res.data.list.data
						resolve(res)
					}).catch(reject)
				})
			},
			// 获取金刚区
			getKingkong() {
				const app = this
				return new Promise((resolve, reject) => {
					goodsApi.Kingkong({}).then(res => {
						this.Kingkong = res.data.list.data || [];
						resolve(res)
					}).catch(reject)
				})

			},
			getJgoodslist(flag) {
				if (this.requestSwitch) return;
				console.log(this.page, 'this.page');
				if (!this.requestSwitch) this.page = this.page + 1;
				if (flag) {
					this.page = 1
				}
				this.bottomFlag = false;
				this.loadStatus = "loading";
				this.requestSwitch = true;
				var _that = this;
				var obj = {};
				obj.page = this.page;
				obj.limit = this.limit;
				obj.if_selected = 1;
				console.log(obj, 'obj');
				goodsApi.list(obj).then(res => {
					this.requestSwitch = false
					if (res.status == 200) {
						// this.JgoodsList=res.data.list.data;
						if (flag) {
							this.bottomFlag = true;
							uni.stopPullDownRefresh()
						}
						if (res.data.list.last_page != this.page && res.data.list.last_page >
							0) {
							this.bottomFlag = true;
							this.loadStatus = "more";
						} else {
							this.page = res.data.list.last_page || 1;
							this.bottomFlag = false;
							this.loadStatus = "normal";
						}
						if (this.page != 1) {
							this.JgoodsList = this.JgoodsList.concat(res.data.list.data);
						} else {
							this.JgoodsList = res.data.list.data;
						}

					}
				})
			},

			/**
			 * 商品搜索
			 */
			handleSearch() {
				const searchPageUrl = 'pages/search/index'
				// 判断来源页面
				let pages = getCurrentPages()
				if (pages.length > 1 &&
					pages[pages.length - 2].route === searchPageUrl) {
					uni.navigateBack()
					return
				}
				// 跳转到商品搜索页
				this.$navTo(searchPageUrl)
			},


		},

		/**
		 * 下拉刷新
		 */
		onPullDownRefresh() {
			// 获取首页数据
			this.getPageData(() => {
				uni.stopPullDownRefresh()
			})
		},

		/**
		 * 分享当前页面
		 */
		onShareAppMessage() {
			const app = this
			const {
				page
			} = app;
			console.log("/pages/index/index?" + app.$getShareUrlParams());
			return {
				// title: page.params.share_title,
				path: "/pages/index/index?" + app.$getShareUrlParams()
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
				// title: page.params.share_title,
				path: "/pages/index/index?" + app.$getShareUrlParams()
			}
		}

	}
</script>

<style lang="scss" scoped>
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	.indoctor {
		position: absolute;
		bottom: -44rpx;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;

	}

	.indoctorItem {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background: rgba(255, 95, 96, .5);
		margin-right: 12rpx;
	}

	.indoctorItem:last-child {
		margin-right: 0;
	}

	.indoctorItem.indoctorItemActive {
		background: #FF5F60;
	}


	.seckillConWrap {
		position: relative;
		// width: 702rpx;
		margin: 20rpx auto 0;
	}

	.seckillCon {
		width: 100%;
		display: flex;
		// justify-content: space-around;
	}

	.seckillItem {
		width: 160rpx;
		margin: 0 20rpx;
		// height: 214rpx;
	}

	.seckillItemT {
		width: 160rpx;
		height: 160rpx;
		// background: #E7E6E6;
		box-shadow: 0 4rpx 4rpx 0 rgba(45, 45, 45, 0.10);
		border-radius: 10rpx;
		background-size: cover;
		background-position: center;
	}

	.seckillItemB {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
	}

	.seckillItemBT {
		font-family: 'PingFang SC';
		font-style: normal;
		font-size: 28rpx;
		color: #F97112;
		text-align: center;
		// overflow: hidden;
		// text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 700;
		margin-right: 4px;
	}

	.seckillItemBB {
		font-family: 'PingFang SC';
		font-style: normal;
		font-size: 20rpx;
		color: #999999;
		text-align: center;
		white-space: nowrap;
	}

	.header {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 99999;
		background: #fff3ef;
		// filter: blur(100px);
	}

	.headerimg {
		width: 100%;
		// height: 100%;
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 999999;
		pointer-events: none
	}

	.subject {
		// position: fixed;
		// width: 100%;
		// top: 0;
		// left: 0;
		// align-items: center;
		box-sizing: border-box;
		// z-index: 1;
		// color: white;
		position: relative;
		// background-image: url(../../static/home/logo.png);
		// background-size: 750upx 560upx;
		background-color: transparent;
	}

	.subject-img {
		position: absolute;
		top: 0;
		left: 0;
		width: 750upx;
		// height: 560upx;
		// z-index: -1;
	}

	.subject-img image {
		width: 100%;
		height: 100%;
	}

	.typeTwo {
		margin-top: 18upx;
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.typeTwoL,
	.typeTwoR {
		width: 342upx;
		height: 120upx;
		border-radius: 8upx;
		overflow: hidden;
		font-family: Adobe Heiti Std;
		background-size: 100% 100%;
		background-position: 0 0;
		font-size: 30upx;
		line-height: 56upx;
		box-sizing: border-box;
		padding: 6upx 20upx;
		color: white;
		font-weight: bold;
		letter-spacing: 2rpx;
	}

	.typeOne {
		width: 100%;
		display: flex;
		margin-top: 18upx;
		justify-content: space-between;
		// height: 250upx;
	}

	.typeOneL {
		width: 262upx;
		height: 258upx;
		border-radius: 8upx;
		overflow: hidden;
		font-family: Adobe Heiti Std;
		background-size: 100% 100%;
		background-position: 0 0;
		font-size: 30upx;
		line-height: 56upx;
		box-sizing: border-box;
		padding: 12upx 36upx 12upx 20upx;
		color: white;
		font-weight: bold;
		letter-spacing: 2rpx;
	}

	.typeOneLMain {
		padding: 12upx 30upx 12upx 40upx;
	}

	.typeOneRT,
	.typeOneRB {
		width: 422upx;
		height: 120upx;
		padding: 12upx 20upx;
		font-size: 30upx;
		line-height: 56upx;
		color: white;
		box-sizing: border-box;
		border-radius: 8upx;
		overflow: hidden;
		background-size: 100% 100%;
		background-position: 0 0;
		font-weight: bold;
		font-family: Adobe Heiti Std;
		letter-spacing: 2rpx;
	}

	.typeOneRB {
		margin-top: 18upx;
	}

	.cateBox {
		width: 100%;
		height: 336upx;
		box-sizing: border-box;
		padding: 32upx 54upx;
	}

	.cateWrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.cateItems {
		width: 90upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 94upx;
		margin-bottom: 20upx;
		height: 126upx;
	}

	.cateItems:nth-child(4n+4) {
		margin-right: 0;
	}

	.cateItems>image {
		width: 90upx;
		height: 90upx;
		margin-bottom: 16upx;
		border-radius: 6upx;
	}

	.cateItems>text {
		width: 90upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 20upx;
		line-height: 20upx;
		color: #333333;
		text-align: center;
	}


	.heads {
		position: fixed;
		width: 100%;

		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		// background: white;
		box-sizing: border-box;
		z-index: 1;
		color: #FFFFFF;
	}

	.heads2 {
		display: flex;
		align-items: center;
		// justify-content: space-between;
		box-sizing: border-box;
		width: 78%;
		padding: 0 40rpx 0 40upx;
		color: #F97014;
		height: 100%;

	}

	.heads2-right {
		display: flex;
		align-items: center;
		font-size: 20rpx;
		margin-left: 30rpx;
		width: 128rpx;
		height: 40rpx;
		background: rgba(249, 112, 20, 0.1);
		border-radius: 8rpx;
		color: #F97014;
	}

	.heads2-right .heads2-right-imgwrap {
		width: 48rpx;
		height: 40rpx;
		background: #F97014;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10rpx;
	}

	.heads2 .heads2-left image {
		width: 40upx;
		height: 40upx;
		vertical-align: top;
	}

	.heads2 .heads2-right image {
		width: 28rpx;
		height: 28rpx;
		vertical-align: top;
	}

	.heads2-left text {
		color: var(--main-color);
		margin-left: 12rpx;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 700;
		font-size: 36rpx;
		line-height: 50rpx;
	}

	/* #ifdef H5 */
	uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}

	/* #endif */
	.noticeCon {
		width: 100%;
		box-sizing: border-box;
		padding: 0 24upx;
		margin-top: 16upx;
	}

	.noticeItem {
		width: 100%;
		height: 70upx;
		box-sizing: border-box;
		border-bottom: 2upx solid #F5F5F5;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		padding-left: 32upx;
	}

	.noticeItem::before {
		width: 20upx;
		height: 20upx;
		border-radius: 50%;
		background: linear-gradient(180deg, #90F0C6 0%, #1EE6D8 100%);
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.noticeItem>image {
		width: 24upx;
		height: 24upx;
	}

	.noticeItem>view {
		width: calc(100% - 48upx);
		font-size: 20upx;
		line-height: 20upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.container {
		background: #F8F8F8;
	}

	.home-header {
		width: 100%;
		// height: 72upx;
		display: flex;
		justify-content: center;
		// background: white;
		margin-top: 28upx;
		// margin-bottom: 14upx;
	}

	.home-header .home-header-icon {
		width: 80upx;
		height: 70upx;
	}

	.home-header-icon>image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
	}

	.home-header-inp {
		position: relative;
		width: 702upx;
		box-sizing: border-box;
		height: 64upx;
		// border: 2upx solid #737373;
		border-radius: 36upx;
		background-color: #FFFFFF;
	}

	.home-header-inp>image {
		position: absolute;
		top: 20upx;
		left: 30upx;
		width: 28upx;
		height: 28upx;
	}

	.home-header-inp>view {
		width: 702upx;
		padding: 0;
		margin: 0;
		padding-left: 68upx;
		border: none;
		height: 64upx;
		font-size: 24upx;
		line-height: 64upx;
		box-sizing: border-box;
		color: #A7A7A7;
	}

	/* 轮播 */
	.home-lunb {
		// margin-top: 24upx;
		z-index: 999;
	}

	.swiper {
		// height: 382upx;
		width: 702upx;
		height: 300upx;
		margin: 0 auto 0;
		border-radius: 10upx;
	}

	.swiper swiper-item image {
		width: 100%;
		height: 300upx;
		border-radius: 10upx;
	}

	// .swiper6{
	// 	width: 750upx;
	// 	height: 300upx;
	// 	margin: 0 auto 0;
	// }
	/* 轮播 */
	.home-lunb2 {
		margin-top: -12upx;
	}

	.adverImg {
		width: 702upx;
		height: 192upx;
		margin: 24upx auto 0;
		display: flex;
		border-radius: 20upx;
	}

	.adverImg>image {
		width: 100%;
		height: 100%;
		border-radius: 20upx;
	}

	.swiper2 {
		// height: 382upx;
		width: 702upx;
		height: 192upx;
		margin: 0 auto 0;
		border-radius: 10upx;
	}

	.swiper2 swiper-item image {
		width: 100%;
		height: 192upx;
		border-radius: 10upx;
	}

	/* 走马灯 */
	.swiper4 {
		height: 60upx;
		width: 82%;
		padding-left: 20upx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.swiper4 swiper-item image {
		width: 100%;
		height: 60upx;
	}

	.newMain {
		width: 702upx;
		margin: 24upx auto 0;
		// background-color: #FFFFFF;
		border-radius: 20upx;
	}

	.home-point {
		// padding: 30upx 0;
		/* display: flex;
		justify-content: space-between; */
		// background-color: #FFFFFF;
		margin-top: 40upx;
	}

	.swiper6 {
		width: 702upx;
		height: 380upx;
		margin: 0 auto 0;
	}

	/* 金刚区 */
	.home-district {
		padding: 30upx 0;
		width: 100%;
		/* display: flex;
		flex-wrap: wrap;
		justify-content: flex-start; */
		background-color: #FFFFFF;
		margin-top: 20upx;
	}

	.home-district-header {
		font-size: 30upx;
		color: #333333;
		padding-left: 28upx;
		margin-bottom: 30upx;
		font-weight: PingFang-SC-Regular;
	}

	.point-item {
		width: 126upx;
		margin-left: 14upx;
		margin-bottom: 24upx;
		display: inline-block;
	}

	.point-item:nth-child(6),
	.point-item:nth-child(7),
	.point-item:nth-child(8),
	.point-item:nth-child(9),
	.point-item:nth-child(10) {
		margin-bottom: 20upx;
	}

	.point-img {
		width: 80upx;
		height: 80upx;
		margin: 0 auto;
	}

	.point-img>image {
		width: 100%;
		height: 100%;
	}

	.point-item .point-text {
		font-size: 22upx;
		text-align: center;
		display: inline-block;
		width: 100%;
	}

	/* 金刚区 end*/
	.homepage-lantern {
		width: 702upx;
		height: 82upx;
		margin: 24upx auto 0;
		border-radius: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		background-color: #FFFFFF;
	}

	.homepage-lantern-item {
		width: 82%;
		height: 100%;
		padding-left: 20upx;
	}

	.homepage-lantern-text {
		display: inline-block;
		width: 100%;
		height: 82upx;
		line-height: 82upx;
		font-size: 28upx;
		color: #333333;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.homepage-lantern-icon1 {
		width: 40upx;
		height: 40upx;
		padding-top: 22upx;
	}

	.homepage-lantern-icon1>image {
		vertical-align: top;
		width: 40upx;
		height: 40upx;
	}

	.homepage-lantern-icon2 {
		width: 28upx;
		height: 28upx;
		padding-top: 30upx;
	}

	.homepage-lantern-icon2>image {
		width: 28upx;
		height: 28upx;
		vertical-align: top;
	}


	.homepage-lantern-icon2>text {
		display: inline-block;

	}

	// 限时特价
	.home-district {
		padding: 0 24upx;
		margin-top: 32upx;
		box-sizing: border-box;
	}

	.home-district-header {
		display: flex;
		justify-content: space-between;
	}

	.home-district-left {
		display: flex;
	}

	.home-district-right {
		display: flex;
		padding-top: 6upx;
	}

	.home-district-text1 {
		font-size: 28upx;
		color: #333333;
		font-weight: bold;
		margin-left: 20upx;
	}

	.home-district-text2 {
		font-size: 16upx;
		color: #999999;
		font-weight: bold;
		height: 32upx;
		line-height: 32upx;
		margin: 8upx 0 0 16upx;
	}

	.home-district-text3 {
		font-size: 20upx;
		color: #333333;
		margin-right: 8upx;
		line-height: 34upx;
	}

	.home-district-colour {
		position: relative;
	}

	.home-district-color1 {
		width: 40upx;
		height: 40upx;
		background-color: #ff5060;
	}

	.home-district-color2 {
		width: 32upx;
		height: 32upx;
		background-color: #5FFFEF;
		position: absolute;
		top: 16upx;
		left: 12upx;
	}

	.home-district-icon {
		width: 32upx;
		height: 32upx;
	}

	.home-district-icon>image {
		width: 100%;
		height: 100%;
	}

	.home-district-item {
		width: 702upx;
		height: 342upx;
		padding-top: 24upx;
		padding-left: 14upx;
		background-color: #F3F3F3;
		border-radius: 8upx;
		margin: 32upx auto 0;
		display: flex;
	}

	.home-district-list {
		width: 204upx;
		height: 300upx;
		padding-top: 24upx;
		background-color: #FFFFFF;
		margin: 0 0 0 16upx;
	}

	.home-district-img {
		width: 144upx;
		height: 144upx;
		margin: 0 auto 0;
	}

	.home-district-img>image {
		width: 100%;
		height: 100%;
	}

	.home-district-text4 {
		font-size: 20upx;
		color: #333333;
		width: 172upx;
		height: 50upx;
		margin: 16upx auto 0;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.home-list-b {
		position: relative;
		margin-top: 16upx;
		width: 100%;
		height: 48upx;
	}

	.home-list-b-left {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 134upx;
		height: 48upx;
		padding-left: 8upx;
		line-height: 48upx;
		background-image: url(../../static/home/icon_bjt.png);
		background-size: 134upx 48px;
		z-index: 88;
	}

	// .home-list-b-left view:nth-child(1){
	//  display: inline-block;
	//  font-size: 20upx;
	//  color: #333333;
	//  margin-left: 8upx;
	//  font-weight: bold;
	//  vertical-align: top;
	// }
	.home-list-b-left view:nth-child(1) {
		display: inline-block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 20upx;
		color: #333333;
		font-weight: bold;
	}

	.home-list-b-right {
		width: 76upx;
		height: 32upx;
		background-color: #515151;
		position: absolute;
		right: 0;
		bottom: 0;
		line-height: 32upx;
		font-size: 16upx;
		color: #D0D0D0;
		text-align: center;
		text-decoration: line-through;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.home-list-bb {
		margin-top: 16upx;
		padding: 0 16upx;
		display: flex;
		justify-content: space-between;
	}

	.home-list-bb-left {
		font-size: 20upx;
		color: #ff5060;
		line-height: 32upx;
		font-weight: bold;
	}

	.home-list-bb-right {
		width: 32upx;
		height: 32upx;
		padding: 4upx;
		border-radius: 50%;
		background-color: #ff5060;
	}

	.home-list-bb-right>image {
		width: 24upx;
		height: 24upx;
		vertical-align: top;
	}

	// 客服
	.home-kf {
		position: fixed;
		bottom: 204upx;
		right: 24upx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.home-kf>image {
		width: 48rpx;
		height: 48rpx;
		vertical-align: top;
	}

	// 返回头部
	.home-returnTop {
		position: fixed;
		bottom: 120upx;
		right: 24upx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #F97112;
		backdrop-filter: blur(5px);
	}

	.home-returnTop>image {
		width: 48rpx;
		height: 48rpx;
		vertical-align: top;
	}

	/* 首页推荐 */
	.home-recommend {
		margin-top: 24upx;
		padding: 0 12upx;
		// background-color: #FFFFFF;
	}

	.home-recommend .recommend-header {
		width: 702upx;
		height: 46upx;
		// background: linear-gradient(90deg, #FF5F60 60%, #DE6BAE 100%);
		background-image: url(../../static/icon/icon_bjt.png);
		background-size: 702upx 46rpx;
		margin: 0 auto 0;
		display: flex;
		align-items: center;
	}

	.recommend-header image {
		width: 21upx;
		height: 26upx;
		margin: 6upx 12upx 4upx 10upx;
	}

	.recommend-header text {
		font-size: 30upx;
		color: #FFFFFF;
		line-height: 46upx;
		vertical-align: top;
	}

	.home-seckill {
		width: 702upx;
		margin: 24upx auto 0;
		background-color: #fff8f3;
		border-radius: 20upx;
		padding: 24upx 20upx;
	}

	.seckill-header {
		height: 46upx;
		margin: 0 auto 0;
		display: flex;
		align-items: center;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.seckill-headerL image {
		width: 190rpx;
		height: 48rpx;
	}

	.seckillMore {
		font-size: 28rpx;
		color: #565656;
		line-height: 28rpx;
		display: flex;
		align-items: center;
		color: #666666;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 24rpx;
	}

	.seckillMore .title {
		margin-right: 20rpx;
	}

	.seckillMore image {
		width: 28upx;
		height: 28upx;
		vertical-align: top;
	}

	.time_wrap {
		display: flex;
		align-items: center;
	}

	.colon {
		color: #333333;
		margin: 0 8rpx;
		font-size: 28rpx;
		font-weight: 700;
	}

	.hour {
		width: 44rpx;
		height: 44rpx;
		background: #333333;
		box-shadow: inset 0px -2rpx 2rpx rgba(0, 0, 0, 0.5), inset 0px 2rpx 2rpx rgba(255, 255, 255, 0.25);
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		font-weight: 900;
		font-size: 24rpx;
		font-family: 'PingFang SC';
		font-style: normal;
	}

	.recommend-bjt {
		width: 80upx;
		height: 4upx;
		margin: 8upx auto 0;
	}

	.home-recommend .recommend-content {
		display: flex;
		flex-wrap: wrap;
	}

	.home-recommend .recommend-item {
		// width: 342upx;
		// height: 424upx;
		width: 338upx;
		// height: 500upx;
		margin-left: 24upx;
		margin-bottom: 24upx;
		background-color: #FFFFFF;
		// background: rgba(135,135,135,0.1);
		// opacity: 0.1;
		color: #595858;
		border-radius: 20upx;
	}

	.home-recommend .recommend-img {
		width: 338upx;
		height: 338upx;
		border-radius: 20upx 20upx 0 0;
	}

	.home-recommend .recommend-img>image {
		width: 100%;
		height: 100%;
		border-radius: 20upx 20upx 0 0;
	}

	.home-recommend .recommend-main {
		// padding: 0 24upx;
		margin-top: 10upx;
		// max-width: calc(100% - 270upx);
	}

	.home-recommend .recommend-title1 {
		font-size: 28upx;
		color: #333333;
		font-weight: Bold;
		padding: 0 10upx;
		height: 80upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		margin-bottom: 24upx;
	}

	.home-recommend .recommend-title2 {
		display: flex;
		padding: 0 10upx;
		justify-content: space-between;
		// margin-top: 17upx;
		margin-bottom: 20upx;
	}

	.home-recommend .recommend-title3 {
		font-size: 22upx;
		color: #878787;
		// margin-top: 18upx;
		line-height: 22upx;
	}

	.home-recommend .recommend-text1 {
		font-size: 22upx;
		// font-weight: bold;
		line-height: 22upx;
		color: #EF343D;
		margin-right: 18upx;
	}

	.home-recommend .recommend-text1 text {
		font-size: 36upx;
		font-weight: bold;
	}

	.home-recommend .recommend-texts {
		font-size: 22upx;
		// font-weight: bold;
		line-height: 22upx;
		color: #878787;
		text-decoration: line-through;
	}

	.home-recommend .recommend-text2 {
		width: 48upx;
		height: 48upx;
		padding: 8upx;
		background-color: #ff5060;
		border-radius: 50%;
	}

	.recommend-text2>image {
		width: 32upx;
		height: 32upx;
		vertical-align: top;
	}

	/* 首页推荐 end */

	.home-popup {
		width: 526upx;
		position: fixed;
		top: 26%;
		left: 14%;
		z-index: 2000;
	}

	.home-box {
		width: 100%;
		height: 568upx;
		background: linear-gradient(180deg, #F7E5B5 0%, #F2923E 100%);
	}

	.home-box-t {
		padding-top: 32upx;
	}

	.home-box-text1 {
		font-size: 28upx;
		color: #850000;
		font-family: Alibaba PuHuiTi;
		font-weight: 400;
		line-height: 40upx;
		text-align: center;
	}

	.home-box-text2 {
		font-size: 16upx;
		color: #333333;
		line-height: 28upx;
		text-align: center;
	}

	.home-box-b {
		width: 232upx;
		height: 82upx;
		text-align: center;
		line-height: 82upx;
		margin: 40upx auto 0;
		border-radius: 42upx;
		font-size: 36upx;
		font-weight: bold;
		color: #333333;
		background: linear-gradient(360deg, #F4BF5A 0%, #FFECAD 100%);
	}

	.home-box-c {
		display: flex;
		flex-wrap: wrap;
	}

	.home-box-item {
		margin-left: 40upx;
		margin-top: 24upx;
	}

	.home-box-text3 {
		font-size: 20upx;
		color: #333333;
		text-align: center;
		margin-top: 32upx;
	}

	.home-box-list {
		width: 80upx;
		height: 80upx;
		background-color: #FFEDC3;
	}

	.home-box-tt {
		font-size: 16upx;
		color: #CB5302;
		line-height: 40upx;
		text-align: center;
	}

	.home-box-bb {
		width: 80upx;
		height: 52upx;
		background-image: url(../../static/home/icon_qd1.png);
		background-size: 80upx 52upx;
	}

	.home-box-list2 {
		width: 80upx;
		height: 80upx;
		background-color: #F1F1F1;
	}

	.home-box-tt2 {
		font-size: 16upx;
		color: #D0D0D0;
		line-height: 40upx;
		text-align: center;
	}

	.home-box-bb2 {
		width: 80upx;
		height: 52upx;
		background-image: url(../../static/home/icon_qd2.png);
		background-size: 80upx 52upx;
	}

	.home-popup-close {
		width: 48upx;
		height: 48upx;
		margin: 48upx auto 0;
	}

	.home-popup-close>image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.home-district {
		padding: 30upx 0;
		width: 100%;
		/* display: flex;
		flex-wrap: wrap;
		justify-content: flex-start; */
		background-color: #FFFFFF;
		margin-top: 20upx;
	}

	.home-district-header {
		font-size: 30upx;
		color: #333333;
		padding-left: 28upx;
		padding-right: 24upx;
		margin-bottom: 30upx;
		font-weight: PingFang-SC-Regular;
	}

	// 分类
	.district-item2 {
		width: 22%;
		// margin-left: 32upx;
		display: inline-block;
	}

	.district-item2 .district-text {
		font-size: 28upx;
		color: #FFE9E9;
		text-align: center;
		display: inline-block;
		width: 100%;
		// position: relative;
		margin-top: 20upx;
		// padding: 32upx 0 16upx 0;
	}

	.district-item2 .active {
		position: relative;
		padding-bottom: 16upx;
		font-weight: bold;
		color: #FFFFFF;
	}

	.active::after {
		content: "";
		position: absolute;
		width: 40upx;
		height: 4upx;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		border-radius: 2upx;
		background-color: #FFFFFF;
	}

	.classification-conter {
		position: absolute;
		top: 0;
		right: 110upx;
		width: 46upx;
		height: 52upx;
		margin: 20upx 0 10upx 0;
		background: linear-gradient(272deg, #EF343D 0%, rgba(222, 59, 67, 0) 100%);
		opacity: 1;
	}

	.classification {
		width: 17.2%;
		height: 52upx;
		position: absolute;
		top: 0;
		right: 0;
		margin: 18upx 0 10upx 0;
		padding: 0 10upx 0 10upx;
		background-color: #EF343D;
		// border-radius:30upx 0 0 30upx ;

	}

	.classification image {
		width: 40upx;
		height: 40upx;
		vertical-align: top;
	}

	.classification text {
		font-size: 28upx;
		color: #FFFFFF;
		margin-left: 6upx;
	}

	// 购票
	.addCon {
		box-sizing: border-box;
		width: 702upx;
		margin: 24upx auto 0;
	}

	.ticket {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin: 24upx 0 0 0;
		box-sizing: border-box;
		// padding: 0 24upx;
	}

	.ticket-left {
		width: 340upx;
		height: 160upx;
		overflow: hidden;
		background: #FFFFFF;
		border-radius: 20upx;
		display: flex;
		// padding: 24upx 16upx;
		box-sizing: border-box;
	}

	.ticket-right {
		width: 340upx;
		// height: 136upx;
		height: 160upx;
		background: #FFFFFF;
		border-radius: 20upx;
		display: flex;
		// padding: 24upx 16upx;
		box-sizing: border-box;
	}

	.ticket-img {
		// width: 88upx;
		// height: 88upx;
		width: 340upx;
		height: 160upx;
	}

	.ticket-img>image {
		// width: 100%;
		// height: 100%;
		width: 340upx;
		height: 160upx;
		vertical-align: top;
	}

	.ticket-conter {
		margin-left: 8upx;
	}

	.ticket-conterT {
		font-size: 32upx;
		color: #333333;
		font-family: PingFang SC-Bold, PingFang SC;
		font-weight: bold;
		position: relative;
		display: inline-block;
	}

	.ticket-label {
		position: absolute;
		top: 4upx;
		right: -76upx;
		width: 66upx;
		height: 32upx;
		line-height: 32upx;
		background: linear-gradient(272deg, #FF3A43 0%, #FF9F74 100%);
		border-radius: 20upx 20upx 20upx 0upx;
		font-size: 22upx;
		color: #FFFFFF;
		text-align: center;
		font-weight: 500;
	}

	.ticket-conterB {
		font-size: 24upx;
		color: #9C9C9C;
		margin-top: 10upx;
	}

	//客服
	.popup-kf {
		width: 400upx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2000;
		// background-color: #FFFFFF;
	}

	.popup-kf-img {
		width: 400upx;
		height: 400upx;
	}

	.popup-kf-img>image {
		width: 100%;
		height: 100%;
	}

	.home-popup2 {
		width: 528upx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2000;
	}

	.home-box2 {
		width: 100%;
		// height: 512upx;
	}

	.home-box2>image {
		width: 100%;
		height: 100%;
	}

	.home-popup2-close {
		width: 48upx;
		height: 48upx;
		margin: 0 auto 0;
	}

	.home-popup2-close>image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}

	.pass {
		width: 702upx;
		height: 80rpx;
		margin: 36rpx auto 0;
		padding-left: 20upx;
		padding-right: 12upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(180deg, #f0f3f7 0%, rgba(245, 249, 255, 0.5) 100%);
		border-radius: 20rpx;
	}

	.passL {
		display: flex;
		justify-content: flex-start;
	}

	.passMessage {
		height: 42upx;
		margin-top: 12upx;
		display: flex;
		justify-content: flex-start;
	}

	.passMessageL {
		width: 36upx;
		height: 36upx;
		margin-top: 16upx;
		margin-left: 30rpx;
		// margin-right: 20rpx;
	}

	.passMessageL>image {
		width: 100%;
		height: 100%;
	}

	.passMessageR {
		width: 102upx;
		height: 42upx;
		font-weight: bold;
		font-size: 30upx;
		line-height: 42upx;
		text-align: center;
		margin-left: 20upx;
		margin-top: 12upx;
	}

	.passData {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 28rpx;
		line-height: 20px;
		/* identical to box height */
		color: #666666;
		margin-right: 20rpx;
	}

	.passR {
		// width: 120rpx;
		padding: 0 16rpx;
		// height: 40rpx;
		color: #EF343D;
		// line-height: 42upx;
		margin: 12upx 0;
		text-align: center;
		font-size: 24upx;
		font-weight: 500;
		background: #FEF1F1;
		border: 2rpx solid #F24C4C;
		border-radius: 8rpx;
	}
</style>
