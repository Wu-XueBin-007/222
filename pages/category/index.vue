<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="header">
			<search class="search" :tips="options.search ? options.search : '搜索商品'" @event="handleSearch" />
			<!-- 切换列表显示方式 -->
			<!-- 			<view class="show-view" @click="handleShowView">
				<text class="iconfont icon-view-tile" v-if="showView"></text>
				<text class="iconfont icon-view-list" v-else></text>
			</view> -->
		</view>

		<!-- 分类样式：一级分类(大图) 10 -->
		<view class="cate-content" v-if="templet.style == 10 && list.length > 0">
			<view class="cate-wrapper cate_style__10">
				<scroll-view :scroll-y="true" :style="{ height: `${scrollHeight - 10}px` }">
					<view class="cate-item" v-for="(item, index) in list" :key="index"
						@click="onTargetGoodsList(item.category_id)">
						<image v-if="item.image" mode="widthFix" :src="item.image.preview_url"></image>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 分类样式：一级分类(小图) 11 -->
		<view class="cate-content" v-else-if="templet.style == 11 && list.length > 0">
			<view class="cate-wrapper cate_style__11">
				<scroll-view class="clear" :scroll-y="true" :style="{ height: `${scrollHeight - 10}px` }">
					<view class="cate-item" v-for="(item, index) in list" :key="index"
						@click="onTargetGoodsList(item.category_id)">
						<image v-if="item.image" mode="widthFix" :src="item.image.preview_url"></image>
						<text class="f-26">{{ item.name }}</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 分类样式：二级分类 20 -->
		<view class="cate-content dis-flex" v-else-if="templet.style == 20 && list.length > 0">

			<!-- 左侧 一级分类 -->
			<scroll-view class="cate-left f-28" :scroll-y="true" :style="{ height: `${scrollHeight}px` }">
				<text class="type-nav" :class="{ selected: curIndex == index }" v-for="(item, index) in list"
					:key="index" @click="handleSelectNav(item,index)">{{ item.name }}</text>
			</scroll-view>

			<!-- 右侧 二级分类 -->
			<scroll-view @scrolltolower='upCallback' class="cate-right b-f" :scroll-top="scrollTop" :scroll-y="true"
				:style="{ height: `${scrollHeight}px` }">
				<!-- 				<mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }"
					@down="downCallback" :up="upOption" @up="upCallback"> -->
				<!-- 商品列表 -->
				<view class="goods-list clearfix" :class="['column-' + (showView ? '1' : '2')]">
					<view class="goods-item" v-for="(item, index) in goodslist" :key="index"
						@click="onTargetDetail(item.goods_id)">
						<!-- 单列显示 -->
						<view v-if="showView" class="dis-flex">
							<!-- 商品图片 -->
							<view class="goods-item_left">
								<image class="image" :src="item.goods_image"></image>
							</view>
							<view class="goods-item_right">
								<!-- 商品名称 -->
								<view class="goods-name twolist-hidden">
									<text>{{ item.goods_name }}</text>
								</view>
								<view class="goods-item_desc">
									<!-- 商品卖点 -->
									<view class="desc-selling_point dis-flex">
										<!-- <text class="onelist-hidden">{{ item.selling_point }}</text> -->
									</view>
									<!-- 商品销量 -->
									<!-- 									<view class="desc-goods_sales dis-flex">
										<text>已售{{ item.goods_sales }}件</text>
									</view> -->
									<!-- 商品价格 -->
									<view class="desc_footer">
										<text class="price_x"> ￥<text
												style="font-size: 38rpx;font-weight: 700;font-family: 'PingFang SC';font-style: normal;">{{item.goods_price_min.split('.')[0]}}<text
													style="font-size:20rpx;font-weight: 700;">.{{item.goods_price_min.split('.')[1]}}</text>
											</text></text>
										<!-- 										<text class="price_y col-9"
											v-if="item.line_price_min > 0">¥{{ item.line_price_min }}</text> -->

										<view @click.stop="onShowSkuPopup(2,item.goods_id)" class="shoppcart">
											<image src="../../static/icon_gwc.png" mode=""></image>
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 多列显示 -->
						<view v-else class="multi">
							<!-- 商品图片 -->
							<view class="goods-image">
								<image class="image" mode="aspectFill" :src="item.goods_image"></image>
							</view>
							<view class="detail">
								<!-- 商品标题 -->
								<view class="goods-name twolist-hidden">
									{{ item.goods_name }}
								</view>
								<!-- 商品价格 -->
								<view class="detail-price onelist-hidden">
									<text class="goods-price f-30 col-m">￥{{ item.goods_price_min }}</text>
									<text v-if="item.line_price_min > 0"
										class="line-price col-9 f-24">￥{{ item.line_price_min }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<empty v-if="!goodslist.length&&!isLoading" :isLoading="isLoading" />
				<!-- </view> -->
				<!-- </mescroll-body> -->
				<!-- 				<uni-load-more bg-color="rgb(240, 240, 240)" :status="loadStatus">
				</uni-load-more> -->
			</scroll-view>
		</view>
		<empty v-if="!list.length&&!isLoading" :isLoading="isLoading" />
		<!-- 商品SKU弹窗 -->
		<SkuPopup v-if="showSkuPopup" @closeSkuPopup='closeSkuPopup' v-model="showSkuPopup"
			:vip_group_order_id="vip_group_order_id" :source=source :info_by_key=info_by_key :skuMode="skuMode"
			:poolId="poolId" :bigId="bigId" :group_order_id="group_order_id" :LuckyFreeId="LuckyFreeId" :goods="goods"
			:type="type" :status="timeStatus" />
	</view>
</template>

<script>
	import SettingKeyEnum from '@/common/enum/setting/Key'
	import SettingModel from '@/common/model/Setting'
	import * as CategoryApi from '@/api/category'
	import empty from '@/components/empty'
	import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import * as GoodsApi from '@/api/goods'
	import {
		getEmptyPaginateObj,
		getMoreListData
	} from '@/utils/app'
	import Search from '@/components/search'
	const pageSize = 15
	const showViewKey = 'GoodsList-ShowView';
	const App = getApp()
	let pageNo = 1
	import SkuPopup from '../goods/components/SkuPopup'
	import * as CartApi from '@/api/cart'
	import {
		setCartTotalNum,
		setCartTabBadge
	} from '@/utils/app'
	export default {
		components: {
			Search,
			empty,
			MescrollBody,
			SkuPopup,
		},
		mixins: [MescrollMixin],
		data() {
			return {
				// 列表高度
				scrollHeight: 0,
				// 一级分类：指针
				curIndex: 0,
				// 内容区竖向滚动条位置
				scrollTop: 0,
				// 分类列表
				list: [],
				// 分类模板设置
				templet: {},
				// 正在加载中
				isLoading: true,
				showView: true, // 列表显示方式 (true列表、false平铺)
				sortType: 'all', // 排序类型
				sortPrice: false, // 价格排序 (true高到低 false低到高)
				options: {}, // 当前页面参数
				goodslist: [], // 商品列表数据
				requestSwitch: false,
				loadStatus: 'more',
				bottomFlag: true,
				// 显示/隐藏SKU弹窗
				showSkuPopup: false,
				vip_group_order_id: 0,
				source: '',
				info_by_key: '',
				// 模式 1:都显示 2:只显示购物车 3:只显示立即购买
				skuMode: 1,
				poolId: '',
				bigId: '',
				group_order_id: 0,
				LuckyFreeId: '',
				// 商品详情
				goods: {},
				// 购物车总数量
				cartTotal: 0,
				// product:商品 seckill:秒杀
				type: "product",
				timeStatus: 0,
				goodsId: 0,
				total: 0
				// 上拉加载配置
				// upOption: {
				// 	// 首次自动执行
				// 	auto: true,
				// 	// 每页数据的数量; 默认10
				// 	page: {
				// 		size: pageSize
				// 	},
				// 	// 数量要大于4条才显示无更多数据
				// 	noMoreSize: 4,
				// }

			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			const app = this
			// 获取页面数据
			app.getPageData()
			// 设置分类列表高度
			app.setListHeight()
			// 记录options
			this.options = options
			// 设置默认列表显示方式
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			const app = this
			// 更新购物车角标
			setCartTabBadge()
		},
		watch: {
			showSkuPopup() {
				if (this.showSkuPopup) {
					uni.hideTabBar()
				} else {
					uni.showTabBar();
				}
			},
		},

		methods: {
			/**
			 * 上拉加载的回调 (页面初始化时也会执行一次)
			 * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
			 * @param {Object} page
			 */
			upCallback() {
				if (!this.bottomFlag) {
					return false;
				}
				const app = this;
				if (this.requestSwitch) return;
				this.requestSwitch = true;
				// 设置列表数据
				app.getGoodsList()
					.then(list => {
						this.requestSwitch = false
						app.goodslist = list;
						pageNo++

						// app.mescroll.endBySize(curPageLen, totalSize)
					})
					.catch((err) => console.log(err, 222)).finally(() => app.isLoading = false)
			},

			// 获取商品信息
			getGoodsDetail() {
				const app = this
				return new Promise((resolve, reject) => {
					if (app.type == 'product') {
						GoodsApi.detail(app.goodsId)
							.then(result => {
								app.goods = result.data.detail
								// if (result.status == 500) {
								// 	uni.navigateBack()
								this.showSkuPopup = !this.showSkuPopup;
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
			/**
			 * 显示/隐藏SKU弹窗
			 * @param {skuMode} 模式 1:都显示 2:只显示购物车 3:只显示立即购买
			 */
			onShowSkuPopup(skuMode = 1, goodsId) {
				this.skuMode = skuMode;
				this.goodsId = goodsId;
				this.getGoodsDetail()

			},


			// 设置默认列表显示方式
			setShowView() {
				this.showView = uni.getStorageSync(showViewKey) || false
			},

			/**
			 * 获取商品列表
			 * @param {number} pageNo 页码
			 */
			getGoodsList() {
				const app = this
				let categoryId = app.list[app.curIndex].category_id
				console.log(categoryId, 'app.category_id')
				console.log(pageNo, 'pageNo')
				let param = {
					sortType: app.sortType,
					sortPrice: Number(app.sortPrice),
					categoryId,
					goodsName: app.options.search || '',
					page: pageNo
				}
				if (app.options.type == "hot") {
					param.if_hot = 1;
				} else if (app.options.type == "special") {
					param.if_special_offer = 1;
				}
				return new Promise((resolve, reject) => {
					GoodsApi.list(param)
						.then(result => {
							console.log(result, 'result');
							const last_page = result.data.list.last_page;
							if (last_page != pageNo && last_page > 0) {
								app.bottomFlag = true;
								app.loadStatus = "more";
							} else {
								pageNo = last_page || 1;
								app.bottomFlag = false;
								app.loadStatus = "normal";
							}

							// 合并新数据
							const newList = [
								...app.goodslist || [],
								...result.data.list.data || []
							];
							resolve(newList);
						})
						.catch(reject)
				})
			},

			// 切换排序方式
			handleSortType(newSortType) {
				const app = this
				const newSortPrice = newSortType === 'price' ? !app.sortPrice : true
				app.sortType = newSortType
				app.sortPrice = newSortPrice
				// 刷新列表数据
				app.goodslist = getEmptyPaginateObj()
				app.mescroll.resetUpScroll()
			},

			// 切换列表显示方式
			handleShowView() {
				const app = this
				app.showView = !app.showView
				uni.setStorageSync(showViewKey, app.showView)
			},

			// 跳转商品详情页
			onTargetDetail(goodsId) {
				this.$navTo('pages/goods/detail', {
					goodsId
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



			/**
			 * 获取页面数据
			 */
			getPageData() {
				const app = this
				app.isLoading = true
				Promise.all([
						// 获取分类模板设置
						// 优化建议: 可以将此处的false改为true 启用缓存
						SettingModel.data(false),
						// 获取分类列表
						CategoryApi.list()
					])
					.then(result => {
						// 初始化分类模板设置
						app.initTemplet(result[0])
						// 初始化分类列表数据
						app.initCategory(result[1])
						app.upCallback()
					})
					.finally(() => app.isLoading = false)
			},

			/**
			 * 初始化分类模板设置
			 * @param {Object} result
			 */
			initTemplet(setting) {
				this.templet = setting[SettingKeyEnum.PAGE_CATEGORY_TEMPLATE.value]
			},

			/**
			 * 初始化分类列表数据
			 * @param {Object} result
			 */
			initCategory(result) {
				const app = this
				const data = result.data
				app.list = data.list
			},

			/**
			 * 设置分类列表高度
			 */
			setListHeight() {
				const app = this
				uni.getSystemInfo({
					success(res) {
						app.scrollHeight = res.windowHeight - 47
					}
				})
			},

			// 一级分类：选中分类
			handleSelectNav(item, index) {
				const app = this
				app.curIndex = index
				app.scrollTop = 0;
				this.goodslist = [];
				pageNo = 1;
				app.bottomFlag = true;
				app.isLoading = true
				app.upCallback()
			},

			// 跳转至商品列表页
			onTargetGoodsList(categoryId) {
				this.$navTo('pages/goods/list', {
					categoryId
				})
			}

		},

		/**
		 * 设置分享内容
		 */
		onShareAppMessage() {
			const app = this;
			console.log('/pages/category/index?' + app.$getShareUrlParams());
			return {
				title: app.templet.shareTitle,
				path: '/pages/category/index?' + app.$getShareUrlParams()
			}
		},

		/**
		 * 分享到朋友圈
		 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
		 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
		 */
		onShareTimeline() {
			const app = this
			return {
				title: app.templet.shareTitle,
				path: '/pages/category/index?' + app.$getShareUrlParams()
			}
		}

	}
</script>

<style>
	page {
		background: #fff;
	}
</style>
<style lang="scss" scoped>
	.cate-content {
		background: #F3F3F3;
		display: flex;
	}

	.cate-wrapper {
		padding: 0 20upx 20upx 20upx;
		box-sizing: border-box;
	}

	/* 一级分类(大图) 10 */

	.cate_style__10 .cate-item {
		margin-bottom: 18upx;
	}

	.cate_style__10 .cate-item:last-child {
		margin-bottom: 0;
	}

	.cate_style__10 .cate-item image {
		display: block;
		width: 100%;
		height: auto;
	}

	/* 一级分类(小图) 11 */

	.cate_style__11 .cate-item {
		float: left;
		padding: 25upx;
		width: 33.3333%;
		text-align: center;
		box-sizing: border-box;
	}

	.cate_style__11 .cate-item image {
		/* height: 208.656upx; */
		width: 100%;
		display: block;
	}

	.cate_style__11 .cate-item image {
		display: block;
		width: 100%;
		margin-bottom: 10upx;
	}

	.cate_style__11 .cate-item text {
		display: block;
		color: #555;
	}

	/* 二级分类 20 */

	.cate-content {
		width: 100%;
		background: #F3F3F3;
		padding-top: 16upx;
	}

	.cate-left {
		flex-direction: column;
		display: flex;
		width: 200upx;
		color: #444;
		height: 100%;
		margin-left: 20rpx // background: #f8f8f8;
	}

	.cate-right {
		display: flex;
		flex-direction: column;
		// width: 550upx;
		height: 100%;
		overflow: hidden;
		width: calc(100% - 240rpx);
	}

	.cate-right-cont {
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		align-content: flex-start;
		padding-top: 26upx;
	}

	.type-nav {
		position: relative;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		z-index: 10;
		display: block;
		font-size: 26upx;
	}

	// .type-nav.selected {
	//   background: #fff;
	//   color: #fa2209;
	//   border-right: none;
	//   font-size: 28upx;
	// }
	.type-nav.selected {
		color: #333333;
		background: #fff;
		border-radius: 8rpx 0px 0px 8rpx;
	}

	.type-nav.selected::after {
		content: "";
		position: absolute;
		width: 6rpx;
		height: 36rpx;
		top: 0;
		left: 0;
		// transform: translateX(-50%);
		/* 主色 */
		transform: translateY(50%);
		margin-top: 0%;
		background: #F97112;
		border-radius: 0px 4rpx 4rpx 0px;
		margin-top: 9rpx;
	}

	.cate-cont-box {
		margin-bottom: 30upx;
		padding-bottom: 10upx;
		background: #fff;
		overflow: hidden;
	}

	.cate-cont-box .cate-img {
		padding: 13upx 10upx 4upx 10upx;
	}

	.cate-cont-box .cate-img image {
		width: 100%;
		height: 150upx;
		border-radius: 10upx;
	}

	.cate-cont-box text {
		text-align: center;
		display: block;
		font-size: 26upx;
		padding-bottom: 14upx;
		color: #444;
		padding: 0 15upx 30upx 15upx;
	}

	.cate-two-box {
		width: 100%;
		padding: 0 10px;
	}

	// 页面头部
	.header {
		display: flex;
		align-items: center;
		background-color: #fff;

		// 搜索框
		.search {
			flex: 1;
		}

		// 切换显示方式
		.show-view {
			width: 60rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 36rpx;
			color: #505050;
		}
	}

	// 排序组件
	.store-sort {
		position: sticky;
		top: var(--window-top);
		display: flex;
		padding: 20rpx 0;
		font-size: 28rpx;
		background: #fff;
		color: #000;
		z-index: 99;

		.sort-item {
			flex-basis: 33.3333%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 50rpx;

			&.active {
				color: #e49a3d;
			}
		}

		.sort-item-price .price-arrow {
			margin-left: 20rpx;
			font-size: 24rpx;
			color: #000;

			.icon {
				&.active {
					color: #e49a3d;
				}

				&.up {
					margin-bottom: -16rpx;
				}

				&.down {
					margin-top: -16rpx;
				}
			}

		}

	}

	// 商品列表
	.goods-list {
		padding: 4rpx;
		box-sizing: border-box;
		padding-bottom: 40rpx;
	}

	// 单列显示
	.goods-list.column-1 {
		.goods-item {
			width: 100%;
			height: 180rpx;
			padding: 20rpx;
			box-sizing: border-box;
			background: #fff;
			line-height: 1.6;
			margin: 13px 0;

			&:last-child {
				margin-bottom: 0;
			}
		}

		.goods-item_left {
			display: flex;
			width: 300rpx;
			background: #fff;
			align-items: center;

			.image {
				display: block;
				width: 180rpx;
				height: 180rpx;
				border-radius: 20rpx;
				margin-right: 20rpx;
			}
		}

		.goods-item_right {
			position: relative;
			// width: 450rpx;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				margin-top: 10rpx;
				height: 64rpx;
				line-height: 1.3;
				white-space: normal;
				color: #484848;
				font-size: 26rpx;
			}
		}

		.goods-item_desc {
			margin-top: 8rpx;
		}

		.desc-selling_point {
			width: 263rpx;
			font-size: 24rpx;
			color: #e49a3d;
		}

		.desc-goods_sales {
			color: #999;
			font-size: 24rpx;
		}

		.desc_footer {
			font-size: 24rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.price_x {
				margin-right: 16rpx;
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 700;
				font-size: 20rpx;
				color: #F97112;
			}

			.shoppcart {
				width: 52rpx;
				height: 52rpx;
				background: #F97112;
				border-radius: 26rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 38rpx;
					height: 36rpx;
				}

			}

			.price_y {
				text-decoration: line-through;
			}
		}
	}

	// 平铺显示
	.goods-list.column-2 {
		.goods-item {
			width: 50%;
		}
	}

	.multi {
		box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
	}

	.goods-item {
		float: left;
		box-sizing: border-box;
		padding: 6rpx;

		.goods-image {
			position: relative;
			width: 100%;
			height: 0;
			padding-bottom: 100%;
			overflow: hidden;
			background: #fff;

			&:after {
				content: '';
				display: block;
				margin-top: 100%;
			}

			.image {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				-o-object-fit: cover;
				object-fit: cover;
			}
		}

		.detail {
			padding: 8rpx;
			background: #fff;

			.goods-name {
				height: 64rpx;
				line-height: 32rpx;
				white-space: normal;
				color: #484848;
				font-size: 26rpx;
			}

			.detail-price {
				.goods-price {
					margin-right: 8rpx;
				}

				.line-price {
					text-decoration: line-through;
				}
			}
		}
	}
</style>
