<template>
	<view v-show="!isLoading" :class="['container',type=='seckill'?'':'containers']">
		<seckill-nav title="商品详情" :fontSize="type=='product'?30:30" :backType="type"
			:color="type=='product'?'black':'#333333'"></seckill-nav>
		<!-- 商品图片轮播 -->
		<SlideImage v-if="!isLoading" :images="goods.goods_images" :type="type" />

		<!-- 秒杀 -->
		<view v-if="!isLoading&&type=='seckill'" class="seckillTimeWrap">
			<view class="seckillTimeL">
				<view class="seckillTimeLT">秒杀价</view>
				<view class="seckillTimeLB">
					<view class="seckillTimeLBL">
						<text>￥</text>{{goods.seckill_price}}
					</view>
					<!-- <view class="seckillTimeLBR">￥{{goods.goods_price_min}}</view> -->
				</view>
			</view>
			<view class="seckillTimeR">
				<view class="seckillTimeRWrap">
					<view class="seckillTimeRT" v-if="timeStatus==0">距离开始</view>
					<view class="seckillTimeRT" v-if="timeStatus==1">距离结束</view>
					<view class="seckillTimeRT" v-if="timeStatus==2">已结束</view>
					<view class="seckillTimeRB" style="display: flex;">
						<u-count-down v-if="true" style="display: flex;" @end="endTime" :timestamp="goods.surplusTime"
							:show-border="false" font-size="22" color="#FFFFFF" bgColor="#9C43FD"
							separatorColor="#9C43FD" :showDays="true" height="38"></u-count-down>
					</view>
				</view>
			</view>
		</view>
		<!-- 秒杀商品信息 -->
		<view class="productWrap" v-if="!isLoading&&type=='seckill'">
			<view class="productWrapT">
				{{goods.goods_name}}
			</view>
			<view class="productWrapB">
				<text>销量：{{goods.sales_total}}</text>
				<text>库存：{{goods.stock_total}}</text>
			</view>
		</view>
		<view class="seckillKnow" v-if="!isLoading&&type=='seckill'" @click="showRuler">
			<view class="seckillKnowL">秒杀须知</view>
			<view class="seckillKnowR">
				<text>更多</text>
				<image src="../../static/icon/more_gray.png"></image>
			</view>
		</view>
		<!-- 商品信息 -->
		<view v-if="!isLoading&&type=='product'" class="goods-info">
			<!-- 价格、销量 -->
			<view class="info-item info-item__top dis-flex flex-x-between flex-y-center">
				<view class="block-left dis-flex flex-y-center">
					<!-- 商品售价 -->
					<text class="floor-price__samll">￥</text>

					<text class="floor-price" v-if="goods.if_special_offer==1">{{ goods.goods_price_min }}</text>
					<text class="floor-price" v-else>{{ goods.goods_price_min }}</text>
					<!-- 划线价 -->
					<text class="original-price" v-if="goods.if_special_offer==1">￥{{ goods.line_price_min }}</text>
				</view>
				<view class="block-right dis-flex">
					<!-- 销量 -->
					<view class="goods-sales">
						<text>已售{{ goods.goods_sales }}件</text>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<!-- <view class="goods-share__line"></view> -->
				<view class="goods-share goodsImage">
					<button class="share-btn dis-flex" open-type="share">
						<!-- <text class="share__icon iconfont icon-fenxiang"></text> -->
						<image src="../../static/icon/icon_share.png" mode=""></image>
						<text class="f-24">分享</text>
					</button>
				</view>
				<!-- #endif -->
			</view>
			<!-- 标题、分享 -->
			<view class="info-item info-item__name dis-flex flex-y-center">
				<view class="goods-name flex-box" style="padding-right: 30upx;">
					<text class="twolist-hidden">{{ goods.goods_name }}</text>
				</view>

			</view>
			<!-- 商品卖点 -->
			<view v-if="goods.selling_point" class="info-item info-item_selling-point">
				<text>{{ goods.selling_point }}</text>
			</view>
		</view>

		<!-- 选择商品规格 -->
		<view v-if="goods.spec_type == 20 && type=='product'" class="goods-choice m-top20 b-f"
			@click="onShowSkuPopup(1)">
			<view class="spec-list">
				<view class="flex-box">
					<text class="spec-list-text">选择</text>
					<text class="spec-name spec-list-text2" v-for="(item, index) in goods.specList"
						:key="index">{{ item.spec_name }}</text>
				</view>
				<view class="spec-arrow f-26 col-9 t-r">
					<image src="../../static/icon/icon_right2.png" mode=""></image>
				</view>
			</view>
		</view>
		<view v-if="goods.spec_type == 20 && type=='seckill'" class="goods-choice m-top20 b-f"
			@click="onShowSkuPopup(3)"
			style="width: 718rpx;box-shadow: 0 2rpx 6rpx 0 #C9C9C9;border-radius: 12rpx;padding: 18rpx 0;margin: 0 auto;">
			<view class="spec-list" style="padding: 0 24rpx;height: 100%;width: 100%;box-sizing: border-box;">
				<view class="flex-box" style="display: flex;">
					<text class="spec-list-text" style="font-size: 28rpx;line-height: 40rpx;">选择</text>
					<text class="spec-name spec-list-text2" v-for="(item, index) in goods.specList" :key="index"
						style="font-size: 28rpx;line-height: 40rpx;">{{ item.spec_name }}</text>
				</view>
				<view class="spec-arrow f-26 col-9 t-r">
					<image src="../../static/icon/icon_right2.png" mode=""></image>
				</view>
			</view>
		</view>

		<!-- 商品服务 -->
		<!-- 成为创客||成为团长info_by_key=1隐藏  -->
		<Service v-if="!isLoading&&type=='product'&&bigId!=3" :goods-id="goodsId" />

		<!-- 商品SKU弹窗 -->
		<SkuPopup v-if="!isLoading" v-model="showSkuPopup" :vip_group_order_id="vip_group_order_id" :source=source
			:info_by_key=info_by_key :skuMode="skuMode" :poolId="poolId" :bigId="bigId" :group_order_id="group_order_id"
			:LuckyFreeId="LuckyFreeId" :goods="goods" @addCart="onAddCart" :type="type" :status="timeStatus" />
		<!-- 商品评价 -->
		<Comment v-if="!isLoading" :goods-id="goods.goods_id" :limit="2" />

		<!-- 商品描述 -->
		<view v-if="!isLoading" class="goods-content m-top20" :style="{'margin-top':type=='product'?'':'30rpx'}">
			<view class="item-title b-f" v-if="type=='product'">
				<text>——</text>
				<text> 商品描述 </text>
				<text>——</text>
			</view>
			<block v-if="goods.content != ''">
				<view class="goods-content__detail b-f" :style="{'padding-top': type=='product'?'30upx':''}">
					<jyf-parser :html="goods.content"></jyf-parser>
				</view>
			</block>
			<empty v-else tips="亲，暂无商品描述" />
		</view>

		<!-- 底部选项卡 -->
		<view class="operaBtn" v-if="type=='seckill'">
			<view class="operaBtnL">
				<view class="operaBtnLItem" @click="toHome">
					<image src="../../static/home/collageHome.png" mode="heightFix"></image>
					<text>首页</text>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="coustomer">
					<view class="operaBtnLItem">
						<image src="../../static/home/collageShare.png" mode="heightFix"></image>
						<text>分享</text>
					</view>
				</button>

				<button open-type="contact" class="coustomer">
					<view class="operaBtnLItem" style="margin-right: 0;">
						<image src="../../static/home/collageCoustomer.png" mode="heightFix"></image>
						<text>客服</text>
					</view>
				</button>
				<!-- #endif -->
			</view>
			<view class="operaBtnR" @click="onShowSkuPopup(3)"
				:style="{'background':timeStatus==1?'#DD1010':'#999999'}">
				{{timeStatus==0?'未开始':(timeStatus==1?'立即抢购':'已结束')}}
			</view>
		</view>
		<view class="footer-fixed" v-if="type=='product'">
			<view class="footer-container">
				<!-- 导航图标 -->
				<view class="foo-item-fasts" v-if="!poolId==''||bigId!=''">
					<!-- 首页 -->
					<view class="fast-item" @click="onTargetHome">
						<view class="fast-icon">
							<image src="../../static/icon/icon_home.png" mode=""></image>
						</view>
						<view class="fast-text">
							<text>首页</text>
						</view>
					</view>
					<!-- 客服 (仅微信小程序端显示) -->
					<!-- #ifdef MP-WEIXIN -->
					<button class="btn-normal" style="margin-left: 54rpx;" open-type="contact">
						<view class="fast-item">
							<view class="fast-icon">
								<image src="../../static/icon/icon_kf.png" mode=""></image>
							</view>
							<view class="fast-text">
								<text>客服</text>
							</view>
						</view>
					</button>
					<!-- #endif -->
				</view>
				<view class="foo-item-fast" v-else>
					<!-- 首页 -->
					<!-- #ifdef MP-WEIXIN -->
					<view class="fast-item" @click="onTargetHome">
						<view class="fast-icon">
							<image src="../../static/icon/icon_home.png" mode=""></image>
						</view>
						<view class="fast-text">
							<text>首页</text>
						</view>
					</view>
					<!-- 客服 (仅微信小程序端显示) -->

					<button class="btn-normal" open-type="contact">
						<view class="fast-item">
							<view class="fast-icon">
								<image src="../../static/icon/icon_kf.png" mode=""></image>
							</view>
							<view class="fast-text">
								<text>客服</text>
							</view>
						</view>
					</button>

					<!-- 购物车 (非微信小程序端显示) -->
					<view class="fast-item fast-item--cart" @click="onTargetCart">
						<view v-if="cartTotal > 0" class="fast-badge fast-badge--fixed">
							{{ cartTotal > 99 ? '99+' : cartTotal }}
						</view>
						<view class="fast-icon">
							<image src="../../static/icon/icon_cart.png" mode=""></image>
						</view>
						<view class="fast-text">
							<text>购物车</text>
						</view>
					</view>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<view class="fast-item" style="margin-left: 36rpx;" @click="onTargetHome">
						<view class="fast-icon">
							<image src="../../static/icon/icon_home.png" mode=""></image>
						</view>
						<view class="fast-text">
							<text>首页</text>
						</view>
					</view>
					<!-- 购物车 (非微信小程序端显示) -->
					<view class="fast-item fast-item--cart" style="margin-right: 40rpx;" @click="onTargetCart">
						<view v-if="cartTotal > 0" class="fast-badge fast-badge--fixed">
							{{ cartTotal > 99 ? '99+' : cartTotal }}
						</view>
						<view class="fast-icon">
							<image src="../../static/icon/icon_cart.png" mode=""></image>
						</view>
						<view class="fast-text">
							<text>购物车</text>
						</view>
					</view>
					<!-- #endif -->
				</view>
				<!-- 操作按钮 -->
				<view class="foo-item-btn">
					<view class="btn-wrapper">
						<view class="btn-item btn-item-deputy" v-if="poolId==''&&bigId==''" @click="onShowSkuPopup(2)">
							<text>加入购物车</text>
						</view>
						<view class="btn-item btn-item-main" @click="onShowSkuPopup(3)">
							<text>{{info_by_key?"立即签约":"立即购买"}} </text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-popup v-model="showAgree" mode="bottom" @close="close" @open="open">
			<view style="max-height: 700upx;">
				<view v-html="commonL.seckill_content" style="padding: 30upx;box-sizing: border-box;">

				</view>
			</view>
		</u-popup>
		<!-- 快捷导航 -->
		<!-- <shortcut bottom="120rpx" /> -->

	</view>
</template>

<script>
	import * as GoodsApi from '@/api/goods'
	import * as CartApi from '@/api/cart'
	import * as seckillApi from '@/api/seckill/seckill.js';
	import * as settingApi from '@/api/ticket/setting'
	import jyfParser from '@/components/jyf-parser/jyf-parser'
	import Shortcut from '@/components/shortcut'
	import SlideImage from './components/SlideImage'
	import SkuPopup from './components/SkuPopup'
	import Comment from './components/Comment'
	import Service from './components/Service'
	import seckillNav from '@/components/seckillNav.vue'
	const App = getApp();

	export default {
		components: {
			jyfParser,
			Shortcut,
			SlideImage,
			SkuPopup,
			Comment,
			Service,
			seckillNav
		},
		data() {
			return {
				// 正在加载
				isLoading: true,
				// 当前商品ID
				goodsId: null,
				// 商品详情
				goods: {},
				// 购物车总数量
				cartTotal: 0,
				// 显示/隐藏SKU弹窗
				showSkuPopup: false,
				// 模式 1:都显示 2:只显示购物车 3:只显示立即购买
				skuMode: 1,
				// product:商品 seckill:秒杀
				type: "product",
				endFlag: false,
				showAgree: false,
				timeId: "",
				timeStatus: 0, //0：未开始 1：进行中 2：已结束
				commonL: {},
				poolId: '',
				LuckyFreeId: '',
				bigId: '',
				group_order_id: 0,
				info_by_key: '',
				source: '',
				vip_group_order_id: 0,
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			console.log(options, 'optionsoptions');
			// 记录商品ID
			this.goodsId = parseInt(options.goodsId)
			if (options.type) {
				this.type = options.type;
			}
			if (options.timeid) {
				this.timeId = options.timeid;
			}
			if (options.poolId) {
				this.poolId = options.poolId;
				this.LuckyFreeId = options.LuckyFreeId;
			}
			if (options.bigId) {
				this.bigId = options.bigId;
			}
			if (options.group_order_id) {
				this.group_order_id = options.group_order_id;
			}
			// 成为创始合伙人||成为团长
			if (options.info_by_key) {
				this.info_by_key = options.info_by_key;
			}

			// 大会员
			if (options.source) {
				this.source = options.source;
			}
			if (options.vip_group_order_id) {
				this.vip_group_order_id = options.vip_group_order_id
				uni.setStorageSync('vip_group_order_id', options.vip_group_order_id)
			} else {
				uni.setStorageSync('vip_group_order_id', 0)
			}
			this.getCommon();
			// 加载页面数据
			this.onRefreshPage()
		},
		methods: {
			toHome() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			getCommon() {
				const app = this
				return new Promise((resolve, reject) => {
					settingApi.detail().then(res => {
						res.data.detail.seckill_content = res.data.detail.seckill_content.replace(/<img/g,
							"<img style='width:100%'");
						app.commonL = res.data.detail
						resolve(res)
					}).catch(reject)
				})
			},
			showRuler() {
				this.showAgree = true;
			},
			close() {},
			open() {},
			endTime() {
				this.endFlag = true;
			},
			// 刷新页面数据
			onRefreshPage() {
				const app = this
				app.isLoading = true
				Promise.all([app.getGoodsDetail(), app.getCartTotal()]).catch((error) => {
						uni.switchTab({
							url: '/pages/index/index'
						});
					})
					.finally(() => app.isLoading = false)
			},

			// 获取商品信息
			getGoodsDetail() {
				const app = this
				return new Promise((resolve, reject) => {
					if (app.type == 'product') {
						GoodsApi.detail(app.goodsId)
							.then(result => {
								app.goods = result.data.detail
								console.log(result, 'resultresult');
								// if (result.status == 500) {
								// 	uni.navigateBack()
								// }
								resolve(result)
							})
							.catch(reject)
					} else {
						seckillApi.goodsDetails({
								goodsId: app.goodsId,
								timeId: app.timeId
							})
							.then(result => {

								app.surplusFlag = result.data.activity_status;
								let startTime = result.data.time_info.start_hour.split(":");
								let endTime = result.data.time_info.end_hour.split(":");
								let nowTime = new Date();
								let startNum = Number(startTime[0]) * 60 * 60 + Number(startTime[1]) * 60;
								let endNum = Number(endTime[0]) * 60 * 60 + Number(endTime[1]) * 60;
								let nowNum = Number(nowTime.getHours()) * 60 * 60 + Number(nowTime
									.getMinutes()) * 60 + Number(nowTime.getSeconds());
								if (nowNum < startNum && nowNum < endNum) {
									// 未开始
									result.data.detail.surplusTime = startNum - nowNum;
									app.timeStatus = 0;
								} else if (nowNum >= startNum && nowNum < endNum) {
									// 进行中
									result.data.detail.surplusTime = endNum - nowNum;
									app.timeStatus = 1;
								} else if (nowNum >= startNum && nowNum >= endNum) {
									// 已结束
									result.data.detail.surplusTime = 0;
									app.timeStatus = 2;
								}
								result.data.detail.timeId = app.timeId;
								app.goods = result.data.detail
								resolve(result)
							})
							.catch(reject)
					}

				})
			},

			// 获取购物车总数量
			getCartTotal() {
				const app = this
				return new Promise((resolve, reject) => {
					CartApi.total()
						.then(result => {
							app.cartTotal = result.data.cartTotal
							resolve(result)
						})
						.catch(reject)
				})
			},

			// 更新购物车数量
			onAddCart(total) {
				this.cartTotal = total
			},

			/**
			 * 显示/隐藏SKU弹窗
			 * @param {skuMode} 模式 1:都显示 2:只显示购物车 3:只显示立即购买
			 */
			onShowSkuPopup(skuMode = 1) {
				this.skuMode = skuMode
				this.showSkuPopup = !this.showSkuPopup
			},

			// 跳转到首页
			onTargetHome(e) {
				this.$navTo('pages/index/index')
			},

			// 跳转到购物车页
			onTargetCart() {
				this.$navTo('pages/cart/index')
			},

		},

		/**
		 * 分享当前页面
		 */
		onShareAppMessage() {
			const app = this
			// 构建页面参数
			let pages = getCurrentPages() //获取加载的页面
			let currentPage = pages[pages.length - 1] //获取当前页面的对象
			let options = currentPage.options //如果要获取url中所带的参数可以查看options
			console.log(options, 'options');
			const params = app.$getShareUrlParams(options)
			console.log(`/pages/goods/detail?${params}`);
			if (app.type == "seckill") {
				return {
					title: app.goods.goods_name,
					path: `/pages/goods/detail?${params}`,
					imageUrl: app.goods.goods_image
				}
			} else {
				return {
					title: app.goods.goods_name,
					path: `/pages/goods/detail?${params}`
				}
			}

		},

		/**
		 * 分享到朋友圈
		 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
		 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
		 */
		onShareTimeline() {
			const app = this
			// 构建页面参数
			const params = app.$getShareUrlParams({
				goodsId: app.goodsId,
			})
			return {
				title: app.goods.goods_name,
				path: `/pages/goods/detail?${params}`
			}
		}
	}
</script>

<style>
	page {
		background: #fafafa;
	}
</style>
<style lang="scss" scoped>
	@import "./detail.scss";


	.operaBtn {
		width: 100%;
		height: 108upx;
		background: white;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 60upx;
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
		width: 250upx;
		height: 70upx;
		text-align: center;
		line-height: 70upx;
		font-size: 34upx;
		// background: #DD1010;
		background: linear-gradient(264deg, #9D2BE8 0%, #F22C95 100%);
		border-radius: 40rpx;
		font-weight: bold;
		color: white;
	}

	.coustomer {
		padding: 0;
		margin: 0;
		line-height: 0;
		background: transparent;
	}


	.seckillKnow {
		width: 718rpx;
		height: 76rpx;
		background: #FFFFFF;
		box-shadow: 0 2rpx 6rpx 0 #C9C9C9;
		border-radius: 12rpx;
		box-sizing: border-box;
		margin: 0 auto 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 24rpx;
	}

	.seckillKnowL {
		font-size: 28rpx;
		line-height: 28rpx;
		color: #010101;
	}

	.seckillKnowR {
		display: flex;
		align-items: center;
	}

	.seckillKnowR>text {
		font-size: 22rpx;
		line-height: 22rpx;
		color: #999999;
		margin-right: 10rpx;
	}

	.seckillKnowR>image {
		width: 10rpx;
		height: 18rpx;
	}


	.productWrap {
		width: 718rpx;
		background: #FFFFFF;
		box-shadow: 0 2rpx 6rpx 0 #C9C9C9;
		border-radius: 12rpx;
		margin: 30rpx auto;
		box-sizing: border-box;
		padding: 18rpx 24rpx 24rpx;
	}

	.productWrapT {
		width: 100%;
		line-height: 42rpx;
		font-size: 30rpx;
		color: #2B2B2B;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		margin-bottom: 6rpx;
		font-weight: bold;
	}

	.productWrapB {
		border-top: 2rpx solid rgba(153, 153, 153, .5);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 12rpx;
	}

	.productWrapB>text {
		font-size: 24rpx;
		line-height: 24rpx;
		color: #999999;
	}



	.seckillTimeWrap {
		width: 100%;
		height: 138rpx;
		background-image: url(../../static/background/backSeckill.png);
		background-size: 750rpx 136rpx;
		background-repeat: no-repeat;
		// background: #C80404;
		box-sizing: border-box;
		display: flex;
	}

	.seckillTimeL {
		width: calc(100% - 216rpx);
		height: 136rpx;
		box-sizing: border-box;
		padding: 16rpx 0rpx 14rpx 40rpx;
		display: flex;
		// flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.seckillTimeLT {
		font-size: 24rpx;
		line-height: 28rpx;
		font-weight: bold;
		color: white;
	}

	.seckillTimeLB {
		display: flex;
		align-items: baseline;
	}

	.seckillTimeLBL {
		font-size: 46rpx;
		color: white;
		font-weight: 800;
		margin-right: 16rpx;
		display: flex;
		align-items: baseline;
	}

	.seckillTimeLBL>text {
		font-size: 26rpx;
		line-height: 26rpx;
		color: white;
		font-weight: bold;
	}

	.seckillTimeLBR {
		font-size: 28rpx;
		line-height: 28rpx;
		color: white;
		text-decoration: line-through;
	}

	.seckillTimeR {
		width: 206rpx;
		height: 136rpx;
		box-sizing: border-box;
		// padding: 14rpx 40rpx 14rpx 0;
		// background: #DC0303;
		display: flex;
		justify-content: center;
		position: relative;
	}

	// .seckillTimeR::before{
	//  content: "";
	//  width: 0;
	//  height: 0;
	//  border: 14rpx solid transparent;
	//  border-left: 14rpx solid #DC0303;
	//  border-top: 14rpx solid #DC0303;
	//  position: absolute;
	//  left: -14rpx;
	//  top: 35rpx;
	//  transform: rotate(-45deg);
	// }
	.seckillTimeRWrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.seckillTimeRT {
		font-size: 28rpx;
		line-height: 28rpx;
		font-weight: bold;
		color: #9D44FD;
		text-align: center;
	}

	.seckillTimeRB {
		display: flex;
		align-items: center;
		margin-top: 12rpx;
	}

	.goodsImage {
		position: relative;
		border-radius: 30upx 0 0 30upx;
		padding: 12upx 24upx;
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

	.spec-list-text {
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
		margin-right: 30rpx;
	}

	.spec-list-text2 {
		font-size: 28upx;
		color: #666666;
	}

	.spec-arrow {
		width: 28upx;
		height: 40upx;

	}

	.spec-arrow image {
		width: 100%;
		height: 100%;
		vertical-align: top;
	}
</style>
