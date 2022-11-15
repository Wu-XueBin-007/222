<template>
	<view class="giveGoods">
		<view class="giveGoodsH">
			<view class="main">
				<view class="name">
					{{goodsList.pool.name}}
				</view>
				<view class="moeny">
					{{goodsList.pool.turnover}}元
				</view>
				<image src="../../static/back2.png" mode=""></image>
			</view>
		</view>
		<view class="giveGoodsC">
			<view class="giveGoodsItem" v-for="(item,index) in goodsLst" :data-poolid="item.id"
				:data-luckyid="item.lucky_free_id" :data-id="item.goods_id" :key="index" @click="onTargetGoodsList">
				<view class="Image">
					<image :src="item.goods_image" mode=""></image>
				</view>
				<view class="title">
					{{item.goods_name}}
				</view>
				<view class="goods_price">
					<view class="goods_priceL">
						￥<text>{{item.goods_price_min}}</text>
					</view>
					<view class="goods_priceR">
						￥{{item.line_price_min}}
					</view>
				</view>
			</view>
		</view>
		<view
			style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%;background:#F8F8F8 ;z-index: -1;"
			catchtouchmove="true"></view>
	</view>
</template>

<script>
	import * as giveApi from "@/api/give/index.js";
	import * as settingApi from '@/api/ticket/setting'
	const App = getApp();
	export default {
		data() {
			return {
				goodsList: {},
				goodsLst: [],
				page: 1,
				limit: 6,
				bottomFlag: true,
				topFlag: true,
			}
		},
		onLoad(options) {
			this.name = options.name;
			this.pool_id = options.id;
			uni.setNavigationBarTitle({
				title: this.name
			})
			this.getGoodsList();
			// uni.setStorageSync('agreementState',true)
		},
		onPullDownRefresh() {
			// 下拉
			if (!this.topFlag) {
				return false;
			}
			this.bottomFlag = true;
			this.page = 1;
			this.topFlag = false;
			this.getGoodsList(true);
		},
		onReachBottom() {
			// 触底
			if (!this.bottomFlag) {
				return false;
			}
			this.page = this.page + 1;
			this.bottomFlag = false;
			this.status = "loading";
			this.getGoodsList();

		},
		methods: {
			getGoodsList(flag) {
				var obj = {}
				obj.pool_id = this.pool_id;
				obj.page = this.page;
				obj.limit = this.limit;
				giveApi.goodsList(obj).then(res => {
					//console.log(res);
					this.goodsList = res.data;
					if (res.status == 200) {
						// this.JgoodsList=res.data.list.data;
						if (flag) {
							this.topFlag = true;
							this.bottomFlag = true;
							uni.stopPullDownRefresh()
						}
						if (Math.ceil(res.data.goods_list.total / this.limit) != this.page && res.data.goods_list
							.last_page > 0) {
							this.bottomFlag = true;
							this.status = "loadmore";
						} else {
							this.status = "normal";
						}
						if (this.page != 1) {
							this.goodsLst = this.goodsLst.concat(res.data.goods_list.data);


						} else {
							this.goodsLst = res.data.goods_list.data;
						}

					}
				})
			},
			// 跳转至商品详情
			onTargetGoodsList(e) {
				let goodsId = e.currentTarget.dataset.id || e.target.dataset.id;
				let poolId = this.pool_id;
				let LuckyFreeId = e.currentTarget.dataset.luckyid || e.target.dataset.luckyid;
				let type = "give"
				this.$navTo('pages/goods/detail', {
					goodsId,
					poolId,
					LuckyFreeId
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.giveGoods {
		.giveGoodsH {
			position: fixed;
			top: 0;
			bottom: 0;
			width: 750upx;
			height: 148upx;
			z-index: 999;

			.main {
				position: relative;
				width: 100%;
				height: 100%;

				.name {
					position: relative;
					font-size: 32upx;
					font-weight: bold;
					color: #FFFFFF;
					padding-top: 20upx;
					margin: 0 0 0 54upx;
					z-index: 999;
				}

				.moeny {
					position: relative;
					font-size: 48upx;
					font-weight: bold;
					font-style: oblique;
					color: #FFFFFF;
					margin: 10upx 0 0 44upx;
					z-index: 999;
				}

				image {
					position: absolute;
					top: 0;
					left: 0;
					z-index: 99;
					width: 750upx;
					height: 148upx;
				}
			}

		}

		.giveGoodsC {
			margin-top: 176upx;
			display: flex;
			flex-wrap: wrap;

			.giveGoodsItem {
				width: 338upx;
				border-radius: 20upx;
				margin-left: 24upx;
				background-color: #FFFFFF;
				margin-bottom: 24upx;

				.Image {
					width: 338upx;
					height: 338upx;
					border-radius: 20upx 20upx 0 0;

					image {
						width: 100%;
						height: 100%;
						border-radius: 20upx 20upx 0 0;
					}

				}

				.title {
					margin: 10upx 10upx 0 10upx;
					font-size: 28upx;
					color: #333333;
					font-weight: bold;
					text-overflow: -o-ellipsis-lastlime;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
					height: 80upx;
				}

				.goods_price {
					display: flex;
					margin: 24upx 12upx 20upx 10upx;

					.goods_priceL {
						font-size: 22upx;
						color: #EF343D  ;

						text {
							font-size: 40upx;
						}
					}

					.goods_priceR {
						font-size: 22upx;
						color: #999999;
						margin-left: 8upx;
						margin-top: 20upx;
						text-decoration: line-through;
					}
				}
			}
		}
	}
</style>
