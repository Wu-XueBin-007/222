<template>
	<mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback"
		:up="upOption" @up="upCallback">

		<view class="banr">
			<view class="banrC">
				<image :src="poster_image.preview_url" mode=""></image>
			</view>
			<view class="banrRule" @click="checkRule">
				专区规则
			</view>
			<u-popup v-model="showRule" mode="bottom" @close="close" @open="open">
				<view class=""
					style="font-size: 36upx;color: #404040;text-align: center;padding-top: 30upx;font-weight: bold;">
					
				</view>
				<view style="max-height: 740upx;">
					<view class="drill">
						<view @click="drillIndex=0"  class="blueDiamond Diamond" :class="drillIndex==0?'Diamondsel':''">
							蓝钻规则
						</view>
						<view @click="drillIndex=1"  class="redDiamond Diamond" :class="drillIndex==1?'Diamondsel':''" >
							红钻规则
						</view>
					</view>
					<view v-html="drillIndex==0?rules.blueRules:rules.redRules" style="padding: 30upx;box-sizing: border-box;">
					</view>
				</view>
			</u-popup>
			<view class="banrOrder" @click="checkOrder">
				专区订单
			</view>
			<u-popup v-model="showOrder" mode="bottom" @close="close" @open="open">
				<view class=""
					style="font-size: 36upx;color: #404040;text-align: center;padding: 20upx 0;font-weight: bold;">
					专区订单
				</view>
				<view style="max-height: 740upx;background-color: #F7F5F5;" v-if="orderList.length>0">
					<view class="specialOrder">
						<view class="specialOrderItem" v-for="(item,index) in orderList" :key="index">
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
											<view class="" v-if="item.teamStat&&item.is_free==1">
												<image :class="[indexs!=0?'Image':'']"
													v-for="(items,indexs) in item.team.list" :key="indexs"
													:src="items.user.avatar_url" mode=""></image>
												<image class="Image" v-if="indexs<4" src="../../static/ask.png" mode="">
												</image>

											</view>
											<view class="" v-if="!item.teamStat&&item.is_free==1">
												<image :class="[indexs!=0?'Image':'']" v-for="(items,indexs) in 4"
													:key="indexs" src="../../static/ask.png" mode=""></image>
											</view>
										</view>

										<!-- v-if="item.is_free==1&&item.is_inviter==1" -->
										<!-- #ifdef MP-WEIXIN -->
										<button open-type="share" @click="group_order_id = item.group_order_id"
											v-if="item.is_free==1&&item.is_inviter==1" class="shareBtn">
											<view class="specialOrderItemBRBR2">邀请好友</view>
										</button>
										<!-- #endif -->
										<view class="specialOrderItemBRBR3" v-if="item.is_free==0">
											通证奖励
										</view>
										<view class="specialOrderItemBRBR4" v-if="item.is_free==1&&item.is_back==1">
											已返现
										</view>
										<view class="specialOrderItemBRBR1"
											v-if="item.is_free==1&&item.is_back==0&&item.is_inviter==0">
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
		<!-- 会员开始  -->
		   <!-- 普通会员 -->
		<view v-if="user_quota.is_auto_upgrade ==0" class="membersList">
			 <image class="membersType"  src="../../static/img_pthy_gsmp.png" mode=""></image>
			  <!-- <image class="membersType" v-if="user_quota.user_level==3" src="../../static/img_hhr.png" mode=""></image> -->
			 <view class="rightProgress">
			 	<text class="cumulative">累计消费{{user_quota.user_quota||0}}元，升级蓝钻还需消费{{user_quota.gap||0}}元</text>
				<view class="Progress">
					<view :style=[styleOBJ] class="ProgressItem"></view>
				</view>
				<view class="ProgressNum">
					{{user_quota.user_quota||0}}/980
				</view>
			 </view>
		</view>
		<!-- 蓝砖 -->
		<view v-if="user_quota.is_auto_upgrade ==1" class="membersList">
			 
			 <image class="membersType"  src="../../static/img_lz_gsmp.png" mode=""></image>
			  <!-- <image class="membersType" v-if="user_quota.user_level==3" src="../../static/img_hhr.png" mode=""></image> -->
			 <view class="rightProgress">
			 	<text class="cumulative">累计消费{{user_quota.user_quota||0}}元，升级红钻还需消费{{user_quota.gap||0}}元</text>
				<view class="Progress">
					<view :style=[styleOBJ] class="ProgressItem"></view>
				</view>
				<view class="ProgressNum">
					{{user_quota.user_quota||0}}/2980
				</view>
			 </view>
		</view>
		<!-- 红砖 -->
		<view v-if="user_quota.is_auto_upgrade ==2" class="membersList">
			 <image class="membersType"  src="../../static/img_hz_gsmp.png" mode=""></image>
			  <!-- <image class="membersType" v-if="user_quota.user_level==3" src="../../static/img_hhr.png" mode=""></image> -->
			 <view class="rightProgress">
			 	<text class="cumulative">累计消费{{user_quota.user_quota||0}}元</text>
				<view class="Progress">
					<view :style=[styleOBJ] class="ProgressItem"></view>
				</view>
				<view class="ProgressNum">
					您目前已是最尊贵的红钻用户了！！
				</view>
			 </view>
		</view>
<!-- 会员结束  -->
		<!-- 页面头部 -->
		<view class="header">
			<search class="search" :tips="options.search ? options.search : '搜索商品'" @event="handleSearch" />
			<!-- 切换列表显示方式 -->
			<view class="show-view" @click="handleShowView">
				<text class="iconfont icon-view-tile" v-if="showView"></text>
				<text class="iconfont icon-view-list" v-else></text>
			</view>
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
						<view class="goods-name twolist-hidden" style="margin-top: 16rpx;">
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
				</view>
			</view>
			<view class="ranksR">
				<image v-for="(item,index) in 4" :kry="index" class="potL"
					:src="item.user.avatar_url?item.user.avatar_url:'../../static/icon_ask.png'" mode="">
				</image>
				<!-- <image class="potL" src="../../static/icon_ask.png" mode=""></image>
			<image class="potL" src="../../static/icon_ask.png" mode=""></image>
			<image class="potL" src="../../static/icon_ask.png" mode=""></image> -->

			</view>
		</view>
		<uni-popup background-color="#fff" ref="popup" type="center">
			<view class="popup-content"><text class="text">权益消费额度：
					1、购买合伙人身份可获得权益消费额度9800元/年，连续3年
					2、购买团长身份可获得权益消费额度2980元/年，连续3年
					3、权益消费额度可在高奢名品区购买商品</text></view>
		</uni-popup>
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
	import {
		checkLogin
	} from '@/utils/app'
	import * as UserApi from '@/api/user'
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
				rules: {},
				orderList: {},
				poster_image: {},
				team: {},
				group_order_id: 0,
				bigUser: {},
				setting: {},
				pgList: 0,
				show: false,
				equities: {}, //权益消费额度
				userInfo: {},
				helpTipState: false,
				helpTipTitle: '',
				helpTipContent: '',
				user_quota:{},
				drillIndex:0,
				styleOBJ:{}
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 记录options
			this.options = options
			// 设置默认列表显示方式
			if (options.group_order_id) {
				this.group_order_id = options.group_order_id
			}
			this.setShowView()
		},
		onShow() {
			this.getRule()
			this.getDetail()
			// this.getbigvip()
			this.getuser_quota()
			this.getUserInfo()

		},
		methods: {
			close() {

			},
			open() {

			},
			shoWequity() {
				this.helpTipState = true;
				this.helpTipTitle = '权益消费额度：'
				this.helpTipContent =
					`1、购买合伙人身份可获得权益消费额度9800元/年，连续3年
				2、购买团长身份可获得权益消费额度2980元/年，连续3年
				3、权益消费额度可在高奢名品区购买商品
				`
				console.log(2222);
				// this.$refs.popup.open('center')
			},
			// 获取当前用户信息
			getUserInfo() {
				const app = this
				UserApi.info()
					.then(result => {
						let userInfo = result.data.userInfo
						app.userInfo = userInfo
						if (userInfo.team_level == 2 || userInfo.team_level == 3) {
							app.getequities()
						}
					})
					.catch(err => {
						console.log(err);
					})
			},
			// 获取权益额度
			getequities() {
				LuxuryApi.equities().then(res => {
					this.equities = res.data
					console.log(res, 'equities');
				})
			},
			helpTipColse() {
				this.helpTipState = false
			},
			checkRule() {
				this.showRule = true;
			},
			checkOrder() {
				this.getOrderList()
				this.showOrder = true;

			},
			getRule() {
				LuxuryApi.rule().then(res => {
					console.log(res,'rule')
					res.data.blueRules.replace(/<img/g, "<img style='width: 100%;'");
					res.data.redRules.replace(/<img/g, "<img style='width: 100%;'");
					this.rules = res.data
				})
			},
			getbigvip() {
				var obj = {}
				if (this.invite_user_id) {
					obj.invite_user_id = this.invite_user_id
				}
				memberApi.index(obj).then(res => {
					this.bigUser = res.data.big_vip_user;
					this.setting = res.data.setting;
					let possces = 0
					process = Math.ceil(Number(this.bigUser.consumption) / Number(this.setting
						.Luxury_upgrade_consum) * 100)
					this.pgList = process
					console.log(Number(this.bigUser.consumption), Number(this.setting.Luxury_upgrade_consum),
						process)
					// this.rules=res.data.setting.rules.replace(/<img/g,"<img style='width: 100%;'");
					if (this.bigUser.is_vip == 0) {
						this.isFinish = false;
					} else if (this.bigUser.is_vip == 1) {
						this.isFinish = true;
					}
				})
			},
			getuser_quota(){
				var obj = {}
				LuxuryApi.user_quota(obj).then(res=>{
					// res.data.user_quota = 1980
						let styleobj = {
							0:{
								"background": "linear-gradient(90deg, #EFD4C1 0%, #FEFBFF 100%);",
								"width":(res.data.user_quota/980)*100+'%'
							},
							1:{
								"background": "linear-gradient(90deg, #B8D7FA 0%, #FEFBFF 100%)",
								"width":(res.data.user_quota/2980)*100+'%'
							},
							2:{
								"background": "linear-gradient(90deg, #F7AFC1 0%, #FEFBFF 100%);",
								"width":'100%'
							}
						}
					
					this.user_quota = res.data;
					this.styleOBJ = styleobj[res.data['is_auto_upgrade']]
				})
			},
			getDetail() {
				LuxuryApi.detail({
					group_order_id: this.group_order_id,
				}).then(res => {
					console.log('poster_image',res);
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
				LuxuryApi.list().then(res => {
					this.orderList = res.data.list.map(cur => {
						console.log(cur, 456)
						if (JSON.stringify(cur.team) != '{}') {
							cur.teamStat = true
						} else {
							cur.teamStat = false
						}
						return cur
					});
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
				param.is_luxury_goods = 1;
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
				let bigId = 2;
				let group_order_id = this.group_order_id
				this.$navTo('pages/goods/detail', {
					goodsId,
					bigId,
					group_order_id
				})
			},
			getEquity() {
				this.$navTo('pageMember/pages/index/Equitydetails')
				// uni.navigateTo({
				// 	url:'/pageMember/pages/index/Myrights'
				// })
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
			}

		},


		/**
		 * 设置分享内容
		 */
		onShareAppMessage() {
			// 构建分享参数
			console.log("/pageLuxury/pages/index/index?" + this.$getShareUrlParams() + "&group_order_id=" + this
				.group_order_id);
			return {
				title: "高奢名品",
				path: "/pageLuxury/pages/index/index?" + this.$getShareUrlParams() + "&group_order_id=" + this
					.group_order_id
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
				title: "高奢名品",
				path: "/pageLuxury/pages/index/index?" + this.$getShareUrlParams() + "&group_order_id=" + this
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
		display: flex;
		flex-wrap: wrap;
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
            height: 162rpx;
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

	.popup-content {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 15px;
		height: 50px;
		background-color: #fff;
	}

	.EquityLines {
		width: 100%;
		padding: 0 22rpx;
		box-sizing: border-box;
		margin: 24rpx 0;
		background: #FFFFFF;
		padding-bottom: 24rpx;

		.EquityLinesTitle {
			font-size: 30rpx;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #333333;
			padding: 20rpx 0;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 2rpx;
				background: #F8F8F8;
				border-radius: 0px 0px 0px 0px;
				opacity: 1;
			}
		}

		.lines {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;

			.combination,
			.remainingAmount {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}

			.combinationTitle {
				color: #999999;
				font-size: 24rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				margin-bottom: 6rpx;
			}

			.combinationNum {
				font-size: 32rpx;
				font-family: DINbek-Medium, DINbek;
				font-weight: 500;
				color: #333333;
				font-weight: 500;
				color: #333333;
			}

			.combination {
				border-right: 2rpx solid #F8F8F8;
				display: flex;
				margin-left: 20rpx;
				margin-top: 20rpx;
			}

			.remainingAmount {
				display: flex;
				margin-left: 62rpx;
			}
		}
	}

	.banr {
		position: relative;
		background-color: #FFFFFF;
		padding-top: 24upx;
		.drill {
			display: flex;
			align-items: center;
			justify-content: space-around;
			border-bottom: 1px solid #EEEEEE;
			padding-bottom: 20rpx;
			.Diamond{
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 700;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #666666;
				&.Diamondsel{
					color: #F97112;
					position: relative;
					&::after{
						content: '';
						position: absolute;
						bottom: -20rpx;
						left: 50%;
						margin-left: -35rpx;
						width: 70rpx;
						height: 6rpx;
						background: #F97112;
					}
				}
			}
		}
	

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
			position: absolute;
			top: 124upx;
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
				line-height: 98upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
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
	.membersList{
		width:calc(100% - 60rpx);
		height: 144rpx;
		background: linear-gradient(90deg, #333844 0%, #5A5D68 100%);
		box-shadow: inset 0px 0px 16rpx rgba(255, 255, 255, 0.4);
		border-radius: 20rpx;
		display: flex;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		margin: 30rpx auto 30rpx;
		align-items: center;
		.membersType{
			width: 108rpx;
			height: 124rpx;
		}
		.rightProgress{
			flex: 1;
			margin-left: 30rpx;
			.cumulative{
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 400;
				font-size: 24rpx;
				color: #DDDDDD;
				margin: 10rpx 0;
				line-height: 34rpx;
			}
			.Progress{
				width: 100%;
				height: 6px;
				position: relative;
				background: #6E707B;
				border-radius: 8rpx;
				margin: 8rpx 0;
				.ProgressItem{
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background: linear-gradient(90deg, #EFD4C1 0%, #FEFBFF 100%);
					border-radius: 8rpx;
					z-index: 2;
					width: 0;
					transition: all 0.3s; 
					max-width: 100%;
					min-width: 0;
				}
			}
			.ProgressNum{
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 400;
				font-size: 24rpx;
				line-height: 34rpx;
				/* 图形_D */
				color: #999999;
			}
		}
	}
</style>
