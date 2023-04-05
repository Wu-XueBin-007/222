<template>
	<view>
		<view class="productWrapCon">
			<view class="productWrapConBox" v-if="productList.length>0">
				<view class="productWrapConItem" v-for="(item,index) in productList" :key="index" :data-index="index">
					<view class="productWrapConItemT">
						<view class="productWrapConItemTImg" :style="{'background-image': 'url('+item.goods_image+')'}">
						</view>
					</view>
					<view class="productWrapConItemB">
						<view class="productWrapConItemBT">{{item.good_name}}</view>
						<view class="spell">
							兑换时间：{{item.create_time}}
						</view>
						<view class="spell">
							兑换订单号：{{item.exchange_order_no}}
						</view>
						<view class="spell">
							商品价格：{{item.goods_price}}
						</view>
						<!-- <view class="productWrapConItemBB">
							<view class="productWrapConItemBBL">
								<view class="productWrapConItemBBLPrice ct">
									<image
										src="https://oss.gzrhhj.com/10001/20230209/895c6338f18ddc72060c11bede37ff2b.png"
										mode=""></image>
									<text>￥</text>
									<text style="font-size: 40rpx;">{{item.goods_price}}</text>
								</view>
							</view>
							<view class="productWrapConItemBBR ct">
							</view>
						</view> -->
					</view>
				</view>
			</view>

			<u-empty style="margin-top: 200rpx;" v-if="productList.length==0"></u-empty>

		</view>
	</view>
</template>

<script>
	import * as goodsApi from "@/api/collage/collage.js";
	export default {
		data() {
			return {
				productList: []
			};
		},
		onLoad() {
			goodsApi.exchangeinforecords({}).then(res => {
				console.log(res);
				this.productList = res.data.list.data
			})
		}
	}
</script>

<style lang="less">
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
		display: flex;

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
		width: 224rpx;
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
		width: 224rpx;
		height: 68rpx;
		position: absolute;
		top: 0;
		left: 0;
	}

	.productWrapConItemBBR {
		width: 203rpx;
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
		// margin-top: 4upx;
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
		background: white;
		transform: translateY(-10upx);
		border-radius: 20upx;
		box-sizing: border-box;
		padding-bottom: 10rpx;
		padding: 80rpx 18rpx;
	}
</style>
