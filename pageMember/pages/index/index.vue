<template>
	<mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback"
		:up="upOption" @up="upCallback">

		<view class="header">
			<search class="search" :tips="options.search ? options.search : '搜索商品'" @event="handleSearch" />
			<!-- 切换列表显示方式 -->
			<view class="show-view" @click="handleShowView">
				<text class="iconfont icon-view-tile" v-if="showView"></text>
				<text class="iconfont icon-view-list" v-else></text>
			</view>
		</view>
		<view class="banr">
			<view class="banrC">
				<image :src="poster_image.preview_url" mode=""></image>
			</view>
			<!-- 			<view class="banrRule" @click="checkRule">
				专区规则
			</view>
			<u-popup v-model="showRule" mode="bottom" @close="close" @open="open">
				<view class=""
					style="font-size: 36upx;color: #404040;text-align: center;padding-top: 30upx;font-weight: bold;">
					专区规则
				</view>
				<view style="max-height: 740upx;">
					<view v-html="rules" style="padding: 30upx;box-sizing: border-box;">

					</view>
				</view>
			</u-popup> -->
			<view class="banrOrder" @click="checkOrder">
				成团订单
			</view>
			<u-popup v-model="showOrder" mode="bottom" @close="close" @open="open">
				<view class=""
					style="font-size: 36upx;color: #404040;text-align: center;padding: 20upx 0;font-weight: bold;">
					成团订单
				</view>
				<view style="max-height: 740upx;background-color: #F7F5F5;" v-if="orderList.length>0">
					<view class="specialOrder">
						<view class="specialOrderItem" v-for="(item,index,arr) in orderList" :key="index">
							<view class="specialOrderItemT">
								下单时间：{{item.create_time}}
							</view>
							<view class="specialOrderItemB">
								<view class="specialOrderItemBL">
									<image :src="item.goods[0].goods_image" mode=""></image>
								</view>
								<view class="specialOrderItemBR">
									<view class="specialOrderItemBRT">
										<view class="specialOrderItemBRTL">
											{{item.goods[0].goods_name}}
										</view>
										<view class="specialOrderItemBRTR">
											<view class="orderNum">
												x{{item.goods[0].total_num}}
											</view>
											<view class="orderPrice">
												￥ <text>{{item.goods[0].goods_price}}</text>
											</view>
										</view>
									</view>
									<view class="specialOrderItemBRB">
										<view class="specialOrderItemBRBL">
											<view class="" v-if="item.team.length==0&&item.is_free==1&&!item.order_id">
												<image :class="[indexs!=0?'Image':'']"
													v-for="(items,indexs) in item.team.list" :key="indexs"
													:src="items.user.avatar_url" mode=""></image>
												<image class="Image" v-if="indexs<4" src="../../static/ask.png" mode="">
												</image>
											</view>
											<view class="" v-if="item.is_free==1&&item.pay_status!=10">
												<image :class="[indexs!=0?'Image':'']" v-for="(items,indexs) in 4"
													:key="indexs"
													:src="item.team[indexs]['user']['avatar_url']?item.team[indexs]['user']['avatar_url']:'../../static/ask.png'"
													mode=""></image>
											</view>
										</view>
										<!-- v-if="item.is_free==1&&item.is_inviter==1" -->
										<!-- #ifdef MP-WEIXIN -->
										<button open-type="share" @click="vip_group_order_id = item.group_order_id"
											v-if="item.is_free==1&&item.is_inviter==1&&item.pay_status!=10"
											class="shareBtn">
											<view class="specialOrderItemBRBR2">邀请好友</view>
										</button>

										<!-- #endif -->
										<button @click="onPay(item.order_id)" v-if='item.pay_status==10'
											class="shareBtn">
											<view class="specialOrderItemBRBR2">去支付</view>
										</button>
										<!-- 										<view class="specialOrderItemBRBR3" v-if="item.is_free==0">
											通证奖励
										</view> -->
										<view class="specialOrderItemBRBR4"
											v-if="item.is_free==1&&item.is_back==1&&item.pay_status!=10">
											已返现
										</view>
										<view class="specialOrderItemBRBR1"
											v-if="item.is_free==1&&item.is_back==0&&item.is_inviter==0&&item.pay_status!=10">
											待返现
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="max-height: 740upx;background-color: #F7F5F5;" v-else>
					<view class="noOrder">
						<image src="../../static/emptyOrder.png"></image>
					</view>
					<view class="message" style="text-align: center; padding-bottom: 100upx; color: #848484;">
						暂无订单~
					</view>
				</view>
			</u-popup>
		</view>

		<!-- 排序标签 -->
		<view class="store-sort">
			<view class="sort-item" :class="{ active: sortType === 'all' }" @click="handleSortType('all')">
				<text>综合</text>
			</view>
			<view class="sort-item" :class="{ active: sortType === 'sales' }" @click="handleSortType('sales')">
				<text>销量</text>
			</view>
			<view class="sort-item sort-item-price" :class="{ active: sortType === 'price' }"
				@click="handleSortType('price')">
				<text>价格</text>
				<view class="price-arrow">
					<view class="icon up" :class="{ active: sortType === 'price' && !sortPrice }">
						<text class="iconfont icon-arrow-up"></text>
					</view>
					<view class="icon down" :class="{ active: sortType === 'price' && sortPrice }">
						<text class="iconfont icon-arrow-down"></text>
					</view>
				</view>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="goods-list clearfix" :class="['column-' + (showView ? '1' : '2')]">
			<view class="goods-item" v-for="(item, index) in list.data" :key="index"
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
								<text class="onelist-hidden">{{ item.selling_point }}</text>
							</view>
							<!-- 商品销量 -->
							<view class="desc-goods_sales dis-flex">
								<text>已售{{ item.goods_sales }}件</text>
							</view>
							<!-- 商品价格 -->
							<view class="desc_footer">
								<text class="price_x">¥{{ item.goods_price_min }}</text>
								<text class="price_y col-9"
									v-if="item.line_price_min > 0">¥{{ item.line_price_min }}</text>
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
						<view class="goods-name twolist-hidden" style="margin-top: 16rpx; height: 68rpx;">
							{{ item.goods_name }}
						</view>
						<!-- 商品价格 -->
						<view class="detail-price onelist-hidden" style="margin-top: 18rpx;">
							<text class="goods-price f-30 col-m">￥ <text
									style="font-size: 36rpx;font-weight: bold;">{{ item.goods_price_min }}</text>
							</text>
							<text v-if="item.line_price_min > 0"
								class="line-price col-9 f-24">￥{{ item.line_price_min }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="ranks" v-if="isRanks">
			<view class="ranksL">
				<view class="ranksLL">
					<image :src="team.inviter.user.avatar_url" mode=""></image>
				</view>
				<view class="ranksLR">
					{{team.inviter.user.nick_name}}
					<text style="margin-left: 10rpx;">邀请您参与免单</text>
				</view>

			</view>
			<view class="ranksR">
				<image v-for="(item,index) in 4" :key="index" class="potL"
					:src="team['list'][item]['user']['avatar_url']?team['list'][item]['user']['avatar_url']:'../../static/ask.png'"
					mode="">
				</image>
				<!-- <image class="potL" src="../../static/icon_ask.png" mode=""></image>
			<image class="potL" src="../../static/icon_ask.png" mode=""></image>
			<image class="potL" src="../../static/icon_ask.png" mode=""></image> -->

			</view>
		</view>
	</mescroll-body>
</template>

<script>
	import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
	import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
	import * as GoodsApi from '@/api/goods'
	import * as LuxuryApi from '@/api/luxury'
	import * as memberApi from "@/api/member/index.js";
	import {
		getEmptyPaginateObj,
		getMoreListData
	} from '@/utils/app'
	import Search from '@/components/search'

	const pageSize = 15
	const showViewKey = 'GoodsList-ShowView';
	export const isObj = (o) => {
		return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
	}
	export default {
		components: {
			MescrollBody,
			Search
		},

		mixins: [MescrollMixin],

		data() {
			return {
				showView: false, // 列表显示方式 (true列表、false平铺)
				sortType: 'all', // 排序类型
				sortPrice: false, // 价格排序 (true高到低 false低到高)
				options: {}, // 当前页面参数
				list: getEmptyPaginateObj(), // 商品列表数据

				// 上拉加载配置
				upOption: {
					// 首次自动执行
					auto: true,
					// 每页数据的数量; 默认10
					page: {
						size: pageSize
					},
					// 数量要大于4条才显示无更多数据
					noMoreSize: 4,
				},
				showRule: false,
				showOrder: false,
				isRanks: false,
				isFinish: false,
				rules: '',
				orderList: [],
				poster_image: {},
				team: {},
				vip_group_order_id: 0,
				bigUser: {},
				setting: {},
				pgList: 0,
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 记录options
			this.options = options
			// 设置默认列表显示方式
			if (options.vip_group_order_id) {
				this.vip_group_order_id = options.vip_group_order_id;
				uni.setStorageSync('vip_group_order_id', options.vip_group_order_id)
			} else {
				uni.setStorageSync('vip_group_order_id', 0)
			}
			// 成团订单
			if (options.from == 'cashier') {
				this.checkOrder()
			}
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: "#000000"
			})
			this.setShowView()

		},
		onShow() {
			// this.getRule()
			let allPages = getCurrentPages(); //获取当前页面栈的实例；
			let lastPages = allPages.length - 1; // 获得倒数第二个元素的索引；
			let option = allPages[lastPages].options; // 获得上个页面传递的参数；
			if (!option.vip_group_order_id) {
				uni.setStorageSync('vip_group_order_id', 0)
			} else {
				uni.setStorageSync('vip_group_order_id', option.vip_group_order_id)
			}
			this.getbigvip()
			this.getDetail()
		},
		methods: {
			close() {

			},
			open() {

			},
			checkRule() {
				this.showRule = true;
			},
			checkOrder() {
				this.getOrderList()
				this.showOrder = true;
			},
			getbigvip() {
				var obj = {}
				if (this.invite_user_id) {
					obj.invite_user_id = this.invite_user_id
				}

				memberApi.index(obj).then(res => {
					this.bigUser = res.data.big_vip_user;
					this.setting = res.data.setting;
					// this.rules=res.data.setting.rules.replace(/<img/g,"<img style='width: 100%;'");
					if (this.bigUser.is_vip == 0) {
						this.isFinish = false;
					} else if (this.bigUser.is_vip == 1) {
						this.isFinish = true;
					}
				})
			},
			// getRule(){
			// 	memberApi.rule().then(res=>{
			// 		console.log(res)
			// 		this.rules=res.data.rule.replace(/<img/g,"<img style='width: 100%;'");
			// 	})
			// },
			getDetail() {
				let obj = {};
				obj.group_order_id = this.vip_group_order_id;
				LuxuryApi.bigVipdetail(obj).then(res => {
					console.log(res, 123)
					this.poster_image = res.data.poster_image;
					this.team = res.data.team;
					if (JSON.stringify(this.team) != '{}') {
						console.log(1)
						this.isRanks = true;
					} else {
						console.log(2)
						this.isRanks = false;
					}
				})
			},
			getOrderList() {
				LuxuryApi.bigviplist().then(res => {
					console.log(res.data.list, 'res.data.list');
					this.orderList = res.data.list
					// .map(cur => {
					// 	if (JSON.stringify(cur.team) != '{}') {
					// 		cur.teamStat = true
					// 	} else {
					// 		cur.teamStat = false
					// 	}
					// 	return cur
					// });
					// console.log(this.orderList,'this.orderList');
				})
			},
			/**
			 * 上拉加载的回调 (页面初始化时也会执行一次)
			 * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
			 * @param {Object} page
			 */
			upCallback(page) {
				const app = this
				// 设置列表数据
				app.getGoodsList(page.num)
					.then(list => {
						const curPageLen = list.data.length
						const totalSize = list.data.total
						app.mescroll.endBySize(curPageLen, totalSize)
					})
					.catch(() => app.mescroll.endErr())
			},

			// 设置默认列表显示方式
			setShowView() {
				this.showView = uni.getStorageSync(showViewKey) || false
			},

			/**
			 * 获取商品列表
			 * @param {number} pageNo 页码
			 */
			getGoodsList(pageNo = 1) {
				const app = this
				//console.log(app.options)
				let param = {
					sortType: app.sortType,
					sortPrice: Number(app.sortPrice),
					categoryId: app.options.categoryId || 0,
					goodsName: app.options.search || '',
					page: pageNo
				}
				if (app.options.type == "hot") {
					param.if_hot = 1;
				} else if (app.options.type == "special") {
					param.if_special_offer = 1;
				}
				param.if_big_vip = 1;
				// if(app.options.type=="is_luxury_goods"){

				// }
				return new Promise((resolve, reject) => {
					GoodsApi.list(param)
						.then(result => {
							// 合并新数据
							const newList = result.data.list
							app.list.data = getMoreListData(newList, app.list, pageNo)
							resolve(newList)
						})
						.catch(reject)
				})
			},
			// 点击去支付
			onPay(orderId) {
				// 记录订单id
				// this.payOrderId = orderId
				// // 显示支付方式弹窗
				// this.showPayPopup = true
				this.$navTo('pages/cashier/index', {
					order_id: orderId
				})
			},

			// 切换排序方式
			handleSortType(newSortType) {
				const app = this
				const newSortPrice = newSortType === 'price' ? !app.sortPrice : true
				app.sortType = newSortType
				app.sortPrice = newSortPrice
				// 刷新列表数据
				app.list = getEmptyPaginateObj()
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
				// let bigId=2;
				// let group_order_id=this.group_order_id
				//       this.$navTo('pages/goods/detail', { goodsId,bigId,group_order_id })
				// let goodsId = e.currentTarget.dataset.id || e.target.dataset.id;
				let bigId = 1;
				let vip_group_order_id = this.vip_group_order_id || 0;
				let source = 'Big_member'
				this.$navTo('pages/goods/detail', {
					goodsId,
					bigId,
					vip_group_order_id,
					source
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

			shareMessage(e) {
				let goodsId = e.currentTarget.dataset.id || e.target.dataset.id;
				let bigId = 1
				let vip_group_order_id = this.vip_group_order_id || 0;
				this.$navTo('pages/goods/detail', {
					goodsId,
					bigId,
					vip_group_order_id
				})

			}

		},


		/**
		 * 设置分享内容
		 */
		onShareAppMessage(res) {
			console.log(this.vip_group_order_id, 'vip_group_order_id');
			// 构建分享参数
			console.log("/pageMember/pages/index/index?" + this.$getShareUrlParams() + "&vip_group_order_id=" + this
				.vip_group_order_id)
			// 右上角分享
			if (res.from != 'button') {
				return {
					title: "大会员专区",
					path: "/pageMember/pages/index/index?" + this.$getShareUrlParams() + "&vip_group_order_id=" + 0
				}
			} else {
				// 按钮分享
				let filterItem = this.orderList.filter(item => item.order_id == this.vip_group_order_id);
				console.log(filterItem, 'filterItem');
				if (filterItem.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '参数orderList>order_id错误'
					})
				}
				return {
					title: filterItem[0].user.nick_name + '邀请您参与免单',
					path: "/pageMember/pages/index/index?" + this.$getShareUrlParams() + "&vip_group_order_id=" + this
						.vip_group_order_id,
					imageUrl: filterItem[0].goods[0].goods_image
				}
			}

		},

		/**
		 * 分享到朋友圈
		 * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
		 * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
		 */
		onShareTimeline() {
			// 构建分享参数
			return {
				title: "大会员专区",
				path: "/pageMember/pages/index/index?" + this.$getShareUrlParams() + "&vip_group_order_id=" + this
					.group_order_id
			}
		}

	}
</script>

<style lang="scss" scoped>
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
	}

	// 单列显示
	.goods-list.column-1 {
		.goods-item {
			width: 702rpx;
			// height: 210rpx;
			margin-left: 24rpx;
			margin-bottom: 20rpx;
			padding: 10rpx 14rpx;
			border-radius: 10upx;
			box-sizing: border-box;
			background: #fff;
			line-height: 1.6;

			&:last-child {
				margin-bottom: 0;
			}
		}

		.goods-item_left {
			display: flex;
			width: 170rpx;
			background: #fff;
			align-items: center;
			margin-right: 14rpx;

			.image {
				display: block;
				width: 156rpx;
				height: 156rpx;
				box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.1200);
			}
		}

		.goods-item_right {
			position: relative;
			// width: 450rpx;
			flex: 1;

			.goods-name {
				margin-top: 10rpx;
				height: 68rpx;
				// max-height: 64rpx;
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
			width: 400rpx;
			font-size: 24rpx;
			color: #e49a3d;
		}

		.desc-goods_sales {
			color: #999;
			font-size: 24rpx;
		}

		.desc_footer {
			font-size: 24rpx;

			.price_x {
				margin-right: 16rpx;
				color: #f03c3c;
				font-size: 30rpx;
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
		border-radius: 8upx;

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
				// height: 64rpx;
				max-height: 64rpx;
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

	.banr {
		position: relative;
		background-color: #FFFFFF;
		padding-top: 24upx;

		.banrC {
			margin: 0 auto 0;
			width: 702upx;
			height: 290upx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.banrRule {
			position: absolute;
			top: 58upx;
			right: 0;
			background-color: rgba(51, 51, 51, 0.5);
			width: 112upx;
			height: 40upx;
			line-height: 40upx;
			border-radius: 20upx 0 0 20upx;
			font-size: 24upx;
			line-height: 40upx;
			color: #FFFFFF;
			text-align: center;
		}

		.banrOrder {
			position: fixed;
			top: 557rpx;
			right: 0;
			background-color: #EF343D;
			width: 112upx;
			height: 66rpx;
			line-height: 66rpx;
			border-radius: 20rpx 0 0 20rpx;
			font-size: 24rpx;
			color: #FFFFFF;
			text-align: center;
			z-index: 999
		}
	}

	.advertisement {
		width: 750upx;
		height: 136upx;
		margin-bottom: 28upx;
		position: relative;
		display: flex;
		justify-content: space-between;

		.advertisementImage {
			width: 750upx;
			height: 136upx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.advertisementL {
			margin: 46upx 0 0 112upx;

			.advertisementLT {
				font-size: 32upx;
				color: #A05318;
			}

			.advertisementLB {
				font-size: 24upx;
				color: #815317;
			}
		}

		.advertisementR {
			display: flex;
			margin: 66upx 24upx 0 0;

			.advertisementRL {
				font-size: 24upx;
				color: #FFFFFF;
			}

			.advertisementRR {
				width: 40upx;
				height: 40upx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.advertisement2 {
		width: 750upx;
		height: 136upx;
		margin-bottom: 28upx;
		position: relative;
		display: flex;
		justify-content: space-between;

		.advertisementImage {
			width: 750upx;
			height: 136upx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.advertisementL {
			margin: 56upx 0 0 102upx;
			font-size: 32upx;
			color: #FFFFFF;
		}

		.advertisementR {
			// display: flex;
			margin: 66upx 54upx 0 0;

			.advertisementRT {
				// margin-top: 66upx;
				width: 326upx;
			}

			.advertisementRB {
				display: flex;
				justify-content: space-between;
				margin-top: 6rpx;

				.advertisementRBL {
					font-size: 24upx;
					color: rgba(255, 255, 255, 0.69);
				}

				.advertisementRBR {
					font-size: 24upx;
					color: rgba(255, 255, 255, 0.69);
				}
			}
		}
	}

	.specialOrder {
		// margin-top: 18upx;
		padding-top: 2rpx;
		background-color: #F7F5F5;

		.specialOrderItem {
			width: 702upx;
			height: 254upx;
			border-radius: 10upx;
			background-color: #FFFFFF;
			margin: 18upx auto 0;

			.specialOrderItemT {
				font-size: 24upx;
				color: #999;
				margin-left: 17upx;
				padding-top: 24upx;
			}

			.specialOrderItemB {
				display: flex;
				justify-content: space-between;
				margin: 26upx 16upx 24upx 14upx;

				.specialOrderItemBL {
					width: 156upx;
					height: 158upx;

					image {
						width: 100%;
						height: 100%;
						box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.1200);
					}

				}

				.specialOrderItemBR {
					width: calc(100% - 184rpx);

					.specialOrderItemBRT {
						display: flex;
						justify-content: space-between;

						.specialOrderItemBRTL {
							width: 341upx;
							font-size: 24upx;
							color: #333333;
							font-weight: bold;
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2; //行数需设置
							line-clamp: 2;
							-webkit-box-orient: vertical;
						}

						.specialOrderItemBRTR {
							display: flex;
							flex-direction: column;
							justify-content: flex-end;
							text-align: right;

							.orderNum {
								font-size: 20upx;
								color: #999999;
								margin-top: 4upx;
							}

							.orderPrice {
								color: #ED464C;
								font-size: 16upx;
								margin-top: 4upx;

								text {
									font-size: 24upx;
								}
							}
						}

					}

					.specialOrderItemBRB {
						display: flex;
						justify-content: space-between;
						margin-top: 24upx;

						.specialOrderItemBRBL {
							image {
								width: 66upx;
								height: 66upx;
								border-radius: 50%;
							}

							.Image {
								margin-left: -16upx;
							}
						}

						.specialOrderItemBRBR1 {
							width: 122upx;
							height: 42upx;
							line-height: 42upx;
							border: 2upx solid #333333;
							font-size: 24upx;
							font-weight: bold;
							text-align: center;
							color: #333333;
							border-radius: 20upx;
							margin-top: 17upx;
						}

						.shareBtn {
							width: 150upx;
							height: 42upx;
							margin-top: 17upx;
							margin-right: 10upx;
							background-color: rgba(0, 0, 0, 0.01);
						}

						.specialOrderItemBRBR2 {
							width: 122upx;
							height: 42upx;
							line-height: 42upx;
							;
							font-size: 24upx;
							font-weight: bold;
							text-align: center;
							color: #FFFFFF;
							background-color: #D93D43;
							border-radius: 20upx;

						}

						.specialOrderItemBRBR3 {
							width: 122upx;
							height: 42upx;
							line-height: 42upx;
							background-color: #FDBEC1;
							font-size: 24upx;
							font-weight: bold;
							text-align: center;
							color: #D93D43;
							border-radius: 20upx;
							margin-top: 17upx;
						}

						.specialOrderItemBRBR4 {
							width: 122upx;
							height: 42upx;
							line-height: 42upx;
							background-color: #CCCCCC;
							font-size: 24upx;
							font-weight: bold;
							text-align: center;
							color: #333333;
							border-radius: 20upx;
							margin-top: 17upx;
						}
					}
				}
			}
		}

	}

	.ranks {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 750upx;
		height: 98upx;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: space-between;

		.ranksL {
			display: flex;
			justify-content: space-between;

			.ranksLL {
				width: 60upx;
				height: 60upx;
				margin: 18upx 8upx 0 24upx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					vertical-align: top;
				}
			}

			.ranksLR {
				width: 370upx;
				font-size: 26upx;
				color: #FFFFFF;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: flex;
				align-items: center;
				// justify-content: center;
			}
		}

		.ranksR {
			margin: 18upx 24upx 0 0;

			image {
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
			}

			.potL {
				margin-left: -12upx;
				z-index: 99;
			}
		}
	}

	.unOrder {
		margin: 0 auto;
		width: 350upx;
		text-align: center;
		padding-bottom: 60upx;
	}

	.unOrder-icon {
		width: 350upx;
		height: 272upx;
		margin: 0 auto;

		image {
			width: 100%;
			height: 100%;
		}
	}
</style>
