<template>
	<view>
		<view class="home-recommend">
			<!-- <view class="recommend-header">
				为您推荐
			</view> -->
			<view class="recommend-bjt"></view>
			<view class="recommend-content">
				<view class="recommend-item" v-for="(item,index) in list" :key="index" :data-id="item.goods_id"
					@click="onTargetGoodsList">
					<view class="recommend-img">
						<image :src="item.goods.images[0].file.preview_url" mode=""></image>
					</view>
					<view class="recommend-main">
						<view class="recommend-title1">
							{{item.goods.goods_name}}
						</view>
						<view class="recommend-title2">
							<view class="recommend-text1">
								￥<text>{{item.goods.goods_price_min}}</text>
							</view>
							<view class="recommend-text3">
								<text>库存：{{item.num}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as VipCardApi from '@/api/teledcard/vipCard'
	export default {
		data() {
			return {
				list:{}
			}
		},
		onLoad() {
			this.getGoodsStockList()
		},
		methods: {
			getGoodsStockList(){
			  const app = this
			  VipCardApi.user_goods_stockList()
				.then(result => {
				   console.log(result)
				   app.list=result.data.list.data;
				  // 显示领取成功提示
				  // app.$success(result.message)
				  // 刷新优惠券列表
				  // app.getCouponList(false)
				}) 
			},
			// 跳转至商品列表页
			onTargetGoodsList(e) {
				let goodsId = e.currentTarget.dataset.id || e.target.dataset.id;
				this.$navTo('pages/goods/detail', {
					goodsId
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* 首页推荐 */
	.home-recommend {
		/* margin-top: 32upx; */
		background-color: #FFFFFF;
		padding-bottom: 40upx;
	}

	.home-recommend .recommend-header {
		font-size: 28upx;
		font-weight: bold;
		color: #333333;
		text-align: center;
		margin-top: 48upx;
	}

	.recommend-bjt {
		width: 80upx;
		height: 4upx;
		// background-image: url(../../static/home/icon_bjt2.png);
		background-size: 80upx 4px;
		margin: 8upx auto 0;
	}

	.home-recommend .recommend-content {
		display: flex;
		flex-wrap: wrap;
	}

	.home-recommend .recommend-item {
		width: 342upx;
		height: 424upx;
		margin-left: 18upx;
		margin-top: 24upx;
		border-radius: 10upx;
		box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.35);
	}

	.home-recommend .recommend-img {
		width: 296upx;
		height: 236upx;
		margin: 24upx auto 0;
	}

	.home-recommend .recommend-img>image {
		width: 100%;
		height: 100%;
	}

	.home-recommend .recommend-main {
		padding: 0 24upx;
		margin-top: 48upx;
	}

	.home-recommend .recommend-title1 {
		font-size: 24upx;
		color: #000000;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.home-recommend .recommend-title2 {
		display: flex;
		justify-content: space-between;
		margin-top: 17upx;
	}

	.home-recommend .recommend-text1 {
		font-size: 28upx;
		font-weight: bold;
		line-height: 48upx;
		color: #ff5060;
	}

	.home-recommend .recommend-text2 {
		width: 48upx;
		height: 48upx;
		padding: 8upx;
		background-color: #ff5060;
		border-radius: 50%;
	}
	.home-recommend .recommend-text3 {
		font-size: 26upx;
		// font-weight: bold;
		line-height: 48upx;
		// color: #ff5060;
	}
	.recommend-text2>image {
		width: 32upx;
		height: 32upx;
		vertical-align: top;
	}

	/* 首页推荐 end */
</style>
